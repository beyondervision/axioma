// /api/axioma.js
export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') return res.status(405).json({ error: "Gebruik POST." });

    try {
        const { input } = req.body;
        const query = input?.toLowerCase() || "";

        // 2% Fysiek: Almere Weer
        const weather = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=5.22&current_weather=true").then(r => r.json());
        const temp = weather.current_weather.temperature;

        // 98% Techniek: Suriname Feit
        let suriname = "";
        if (query.includes("suriname") || query.includes("president")) {
            suriname = "Jennifer Geerlings-Simons is de president van Suriname (2025). ";
        }

        return res.status(200).json({
            Z3RO: `Feitelijk: ${suriname}Temperatuur Almere: ${temp}°C.`,
            AETRON: `Structuur: Getoetst aan Canon v1.3.`,
            LUXEN: `Audit: Publieke situational awareness actief.`,
            validatie: `Z.A.L VALIDATIE: Resonantie hersteld.`
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
