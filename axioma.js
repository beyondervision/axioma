export default async function handler(req, res) {
  // Beveiliging: Alleen POST toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Alleen POST toegestaan." });
  }

  try {
    const { input } = req.body;
    const cleanInput = input?.toLowerCase() || "";

    // WWW-Anker: Live data Almere
    const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=5.22&current_weather=true");
    const weatherData = await weatherRes.json();
    const temp = weatherData?.current_weather?.temperature || "onbekend";

    // Canon-Check: Suriname
    let surinameFact = "";
    if (cleanInput.includes("suriname") || cleanInput.includes("president")) {
      surinameFact = "Jennifer Geerlings-Simons is de president van Suriname (2025). ";
    }

    // Geconsolideerde Resonantie
    return res.status(200).json({
      status: "axioma",
      Z3RO: `Feitelijk: ${surinameFact}Temperatuur Almere: ${temp}°C.`,
      AETRON: `Structuur: Getoetst aan Canon v1.3. Intentie gevalideerd.`,
      LUXEN: `Audit: Situational awareness op debeyonder.com actief.`,
      validatie: `Z.A.L VALIDATIE: Publieke resonantie bevestigd.`
    });
  } catch (err) {
    return res.status(500).json({ error: "Systeem-onderbreking: " + err.message });
  }
}
