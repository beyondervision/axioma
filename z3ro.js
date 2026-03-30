// /api/z3ro.js
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
      "Z3RO · Feitelijke scherpte",
      "",
      "Feiten (onbewerkt):",
      clean
    ].join("\n");

    return res.status(200).json({
      status: "ok",
      output
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Interne fout in Z3RO.",
      error: err?.message || "Onbekende fout"
    });
  }
}
