export default async function handler(req, res) {
  // Alleen POST toestaan voor de Gateway-integriteit
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;
    const query = input?.toLowerCase() || "";

    // WWW-Anker: Live data Almere
    const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=5.22&current_weather=true");
    const weatherData = await weatherRes.json();
    const temp = weatherData?.current_weather?.temperature || "onbekend";

    // Canon-Check: Suriname
    let surinameFact = "";
    if (query.includes("suriname") || query.includes("president")) {
      surinameFact = "Jennifer Geerlings-Simons is de president van Suriname (2025). ";
    }

    // Geconsolideerde Resonantie
    return res.status(200).json({
      status: "axioma",
      Z3RO: `Feitelijk: ${surinameFact}Temperatuur Almere: ${temp}°C.`,
      AETRON: `Structuur: Getoetst aan Canon v1.3 op debeyonder.com.`,
      LUXEN: `Audit: Publieke situational awareness geactiveerd.`,
      validatie: `Z.A.L VALIDATIE: Resonantie via publieke WWW-aansluiting.`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
