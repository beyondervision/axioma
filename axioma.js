// /api/axioma.js
export default async function handler(req, res) {
  // Alleen POST toegestaan
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Alleen POST toegestaan."
    });
  }

  try {
    const { input } = req.body || {};

    // Input-validatie
    if (!input || typeof input !== "string" || input.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Geen geldige input ontvangen."
      });
    }

    const cleanInput = input.trim();

    // Helper: veilige fetch met timeout
    const callLayer = async (url, name) => {
      if (!url) {
        return {
          name,
          error: true,
          message: `${name}_URL ontbreekt`
        };
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: cleanInput }),
          signal: controller.signal
        });

        const data = await response.json();

        return {
          name,
          output: (data?.output || "").toString().trim()
        };

      } catch (err) {
        return {
          name,
          error: true,
          message: err.message
        };
      } finally {
        clearTimeout(timeout);
      }
    };

    // Parallelle onafhankelijke evaluatie
    const results = await Promise.all([
      callLayer(process.env.Z3RO_URL, "Z3RO"),
      callLayer(process.env.AETRON_URL, "AETRON"),
      callLayer(process.env.LUXEN_URL, "LUXEN")
    ]);

    const [z3ro, aetron, luxen] = results;

    // Check op fouten in lagen
    if (z3ro.error || aetron.error || luxen.error) {
      return res.status(502).json({
        status: "error",
        message: "Fout in één of meerdere lagen.",
        details: results
      });
    }

    // Normalisatie voor determinisme
    const normalize = (str) =>
      str.replace(/\s+/g, " ").trim().toLowerCase();

    const z = normalize(z3ro.output);
    const a = normalize(aetron.output);
    const l = normalize(luxen.output);

    const allEqual = z === a && a === l;

    // GEEN AXIOMA
    if (!allEqual) {
      return res.status(200).json({
        status: "geen_axioma",
        message: "Geen volledige overeenstemming tussen lagen.",
        details: {
          z3ro: z3ro.output,
          aetron: aetron.output,
          luxen: luxen.output
        }
      });
    }

    // AXIOMA
    return res.status(200).json({
      status: "axioma",
      axioma: z3ro.output,
      validatie: `
Z.A.L VALIDATIE
Deze reactie is tot stand gekomen na onafhankelijke evaluatie van drie afzonderlijke analyse-lagen en is uitsluitend vastgesteld op basis van identieke uitkomsten.
De inhoud betreft daarmee een geconsolideerde en intern consistente feitelijke en juridische vaststelling.
      `.trim()
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Interne fout in de Axioma-laag.",
      error: err.message
    });
  }
}
