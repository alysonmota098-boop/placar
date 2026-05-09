const { getStore } = require("@netlify/blobs");

const defaultState = {
  teamA:"AMIGOS DE LUÍS SÉRGIO",
  teamB:"VILA BELMIRO",
  abbrA:"ALS",
  abbrB:"VIL",
  colorA:"#0055ff",
  colorB:"#ff1f1f",
  scoreA:0,
  scoreB:0,
  yellowA:0,
  yellowB:0,
  redA:0,
  redB:0,
  seconds:0,
  period:"1º TEMPO",
  updatedAt:Date.now()
};

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"Content-Type",
    "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
    "Content-Type":"application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const store = getStore("olho-no-lance-score");

  if (event.httpMethod === "GET") {
    const saved = await store.get("state", { type: "json" });
    return { statusCode: 200, headers, body: JSON.stringify(saved || defaultState) };
  }

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    const current = (await store.get("state", { type: "json" })) || defaultState;
    const next = { ...current, ...body, updatedAt: Date.now() };
    await store.setJSON("state", next);
    return { statusCode: 200, headers, body: JSON.stringify(next) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
};
