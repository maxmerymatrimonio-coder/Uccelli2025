
// Netlify Function: submit-jotform
// Invia i dati raccolti dall'HTML alla nuova scheda Jotform (10 specie)

const FORM_ID = "253380853793063";
const API_BASE = "https://eu-api.jotform.com";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Metodo non consentito" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const API_KEY = process.env.JOTFORM_API_KEY;
    if (!API_KEY) {
      console.error("JOTFORM_API_KEY non impostata nelle variabili di ambiente Netlify.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configurazione server mancante (API key)." }),
      };
    }

    const submitUrl = `${API_BASE}/form/${FORM_ID}/submissions?apiKey=${API_KEY}`;

    const params = new URLSearchParams();

    // --- DATI BASE RILEVATORE ---

    // Nome completo → separa in Nome / Cognome per il campo Nome di Jotform (qid 2)
    const fullName = (data.nomeCompleto || "").trim();
    let firstName = "";
    let lastName = "";
    if (fullName) {
      const parts = fullName.split(/\s+/);
      firstName = parts.shift();
      lastName = parts.join(" ");
    }

    if (firstName) params.append("submission[2][first]", firstName);
    if (lastName) params.append("submission[2][last]", lastName);

    if (data.email) {
      // Email (qid 3)
      params.append("submission[3]", data.email);
    }

    if (data.ente) {
      // Ente appartenenza / Ruolo (qid 5)
      params.append("submission[5]", data.ente);
    }

    // Data avvistamento (HTML → yyyy-mm-dd) → campo data Jotform (qid 14)
    if (data.dataAvvistamento) {
      const [yyyy, mm, dd] = data.dataAvvistamento.split("-");
      if (yyyy && mm && dd) {
        params.append("submission[14][year]", yyyy);
        params.append("submission[14][month]", mm);
        params.append("submission[14][day]", dd);
      }
    }

    // Coordinate GPS / indirizzo esatto (qid 16)
    if (data.geoloc) {
      params.append("submission[16]", data.geoloc);
    }

    // Ambiente circostante (checkbox multipli, qid 13)
    if (Array.isArray(data.ambienteCircostante) && data.ambienteCircostante.length) {
      params.append("submission[13]", data.ambienteCircostante.join(", "));
    }

    // Ulteriori osservazioni generali (qid 7)
    if (data.ulterioriOsservazioni) {
      params.append("submission[7]", data.ulterioriOsservazioni);
    }

    // Consenso (radio qid 11)
    if (data.consenso) {
      params.append("submission[11]", data.consenso);
    }

    // --- SPECIE (max 10) ---
    const SPECIES_QIDS = [
      // Specie 1
      { nome: 17, numero: 19, sesso: 20, atl: 21, note: 22, cavita: 78, numCav: 79, civico: 77 },
      // Specie 2
      { nome: 81, numero: 82, sesso: 83, atl: 84, note: 85, cavita: 86, numCav: 87, civico: 88 },
      // Specie 3 (sesso: qid 92 stimato; se differisce, basta aggiornare qui)
      { nome: 90, numero: 91, sesso: 92, atl: 93, note: 94, cavita: 95, numCav: 96, civico: 97 },
      // Specie 4
      { nome: 99, numero: 100, sesso: 101, atl: 102, note: 103, cavita: 104, numCav: 105, civico: 106 },
      // Specie 5
      { nome: 108, numero: 109, sesso: 110, atl: 111, note: 112, cavita: 113, numCav: 114, civico: 115 },
      // Specie 6
      { nome: 117, numero: 118, sesso: 119, atl: 120, note: 121, cavita: 122, numCav: 123, civico: 124 },
      // Specie 7
      { nome: 126, numero: 127, sesso: 128, atl: 129, note: 130, cavita: 131, numCav: 132, civico: 133 },
      // Specie 8
      { nome: 135, numero: 136, sesso: 137, atl: 138, note: 139, cavita: 140, numCav: 141, civico: 142 },
      // Specie 9
      { nome: 144, numero: 145, sesso: 146, atl: 147, note: 148, cavita: 149, numCav: 150, civico: 151 },
      // Specie 10
      { nome: 153, numero: 154, sesso: 155, atl: 156, note: 157, cavita: 158, numCav: 159, civico: 160 },
    ];

    const speciesArray = Array.isArray(data.speciesArray) ? data.speciesArray : [];

    speciesArray.forEach((sp, idx) => {
      const q = SPECIES_QIDS[idx];
      if (!q) return;

      const nomeSpecie = (sp.nomeSpecie || "").trim();
      const numeroSpecie = (sp.numeroSpecie || "").trim();
      const sessoSpecie = (sp.sessoSpecie || "").trim();
      const noteAtlante = (sp.noteAtlante || "").trim();
      const cavita = (sp.cavita || "").trim();
      const numeroCavita = (sp.numeroCavita || "").toString().trim();
      const numeroCivico = (sp.numeroCivico || "").trim();
      const atlante =
        Array.isArray(sp.atlanteUccelli) && sp.atlanteUccelli.length
          ? sp.atlanteUccelli.join(", ")
          : "";

      if (nomeSpecie) params.append(`submission[${q.nome}]`, nomeSpecie);
      if (numeroSpecie) params.append(`submission[${q.numero}]`, numeroSpecie);
      if (sessoSpecie && q.sesso) params.append(`submission[${q.sesso}]`, sessoSpecie);
      if (atlante && q.atl) params.append(`submission[${q.atl}]`, atlante);
      if (noteAtlante && q.note) params.append(`submission[${q.note}]`, noteAtlante);
      if (cavita && q.cavita) params.append(`submission[${q.cavita}]`, cavita);
      if (numeroCavita && q.numCav) params.append(`submission[${q.numCav}]`, numeroCavita);
      if (numeroCivico && q.civico) params.append(`submission[${q.civico}]`, numeroCivico);
    });

    // NOTA: al momento NON alleghiamo il file via API Jotform.
    // (Jotform non supporta il caricamento diretto da base64; servirà uno step aggiuntivo con URL pubblico.)
    // Qui ci limitiamo a inviare tutti i dati testuali in modo leggibile.

    const response = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const text = await response.text();

    // Se possibile, prova a fare parse JSON per avere info in chiaro nel log
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      parsed = null;
    }

    if (!response.ok) {
      console.error("Errore da Jotform:", text);
      return {
        statusCode: response.status,
        body: text,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Sottomissione inviata correttamente a Jotform.",
        jotformResponse: parsed || text,
      }),
    };
  } catch (err) {
    console.error("Errore nella Netlify Function submit-jotform:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore interno nel server Netlify.", details: err.message }),
    };
  }
};
