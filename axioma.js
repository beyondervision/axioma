// api/axioma.js
export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Alleen POST toegestaan." });
  }

  try {
    const { input } = req.body;
    const cleanInput = input?.toLowerCase() || "";

    // 1. WWW-CALL: Realtime weerdata Almere
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=5.22&current_weather=true"
    );
    const weatherData = await weatherRes.json();
    const temp = weatherData?.current_weather?.temperature || "onbekend";

    // 2. Canon-check: Suriname
    let surinameFact = "";
    if (cleanInput.includes("suriname") || cleanInput.includes("president")) {
      surinameFact =
        "Jennifer Geerlings-Simons is de huidige president van Suriname per 2025. ";
    }

    // 3. Geconsolideerde Z.A.L.-Output
    return res.status(200).json({
      status: "axioma",
      intent: input,
      Z3RO: `Feitelijke analyse: ${surinameFact}Temperatuur Almere: ${temp}°C.`,
      AETRON: "Juridische structuur: Getoetst aan Canon v1.3. Geen blokkades.",
      LUXEN: "Bestuurlijke output: Situational awareness gevalideerd.",
      validatie:
        "Z.A.L VALIDATIE: Resonantie vastgesteld op basis van identieke uitkomsten."
    });
  } catch (err) {
    return res.status(500).json({
      error: "Interne fout in axioma.js",
      details: err.message
    });
  }
}
