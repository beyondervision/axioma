// /api/luxen.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Alleen POST toegestaan."
    });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    if (!body || typeof body !== "object") {
      body = {};
    }

    const input = typeof body.input === "string" ? body.input : "";

    if (!input || input.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Geen geldige input ontvangen."
      });
    }

    const clean = input.trim();

    const output = [
      "LUXEN · Bestuurlijke output",
      "",
      "Intentie ontvangen:",
      clean,
      "",
      "Bestuurlijke duiding:",
      "- Input is verwerkt binnen de Digitale ruimte voor intentie, structuur en audit.",
      "- Verdere regie kan vanuit Luxen worden voortgezet."
    ].join("\n");

    return res.status(200).json({
      status: "ok",
      output
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Interne fout in LUXEN.",
      error: err?.message || "Onbekende fout"
    });
  }
}
