const FORM_ID = '253234849989376';
const API_KEY = process.env.JOTFORM_API_KEY;

// Endpoint europeo Jotform
const JOTFORM_URL = `https://eu-api.jotform.com/form/${FORM_ID}/submissions?apiKey=${API_KEY}`;

// QID dei campi principali (dal riepilogo Jotform)
const QID = {
  nomeCompleto: 2,
  email: 3,
  ente: 5,
  data: 14,
  ambiente: 13,
  osservazioni: 7,
  mappa: 16,
  consenso: 11
};

// QID per le 10 specie
const SPECIES_QIDS = [
  // Specie 1
  { nome: 17,  numero: 19,  sesso: 20,  codici: 21,  note: 22,  cavita: 78,  numeroCavita: 79,  civico: 77 },
  // Specie 2
  { nome: 81,  numero: 82,  sesso: 83,  codici: 84,  note: 85,  cavita: 86,  numeroCavita: 87,  civico: 88 },
  // Specie 3  (ipotesi: sesso = 92, codici = 93)
  { nome: 90,  numero: 91,  sesso: 92,  codici: 93,  note: 94,  cavita: 95,  numeroCavita: 96,  civico: 97 },
  // Specie 4
  { nome: 99,  numero: 100, sesso: 101, codici: 102, note: 103, cavita: 104, numeroCavita: 105, civico: 106 },
  // Specie 5
  { nome: 108, numero: 109, sesso: 110, codici: 111, note: 112, cavita: 113, numeroCavita: 114, civico: 115 },
  // Specie 6
  { nome: 117, numero: 118, sesso: 119, codici: 120, note: 121, cavita: 122, numeroCavita: 123, civico: 124 },
  // Specie 7
  { nome: 126, numero: 127, sesso: 128, codici: 129, note: 130, cavita: 131, numeroCavita: 132, civico: 133 },
  // Specie 8
  { nome: 135, numero: 136, sesso: 137, codici: 138, note: 139, cavita: 140, numeroCavita: 141, civico: 142 },
  // Specie 9
  { nome: 144, numero: 145, sesso: 146, codici: 147, note: 148, cavita: 149, numeroCavita: 150, civico: 151 },
  // Specie 10
  { nome: 153, numero: 154, sesso: 155, codici: 156, note: 157, cavita: 158, numeroCavita: 159, civico: 160 }
];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const {
      email = '',
      tipo = '',
      dataAvvistamento = '',
      nome = '',
      ente = '',
      ambiente = [],
      specie = '',
      speciesArray = [],
      ulterioriOsservazioni = '',
      consenso = '',
      geoloc = '',
      fileBase64 = '',
      fileName = '',
      fileType = ''
    } = data;

    // Nome e cognome separati (campo Jotform "Nome e Cognome")
    let firstName = '';
    let lastName = '';
    if (nome && typeof nome === 'string') {
      const parts = nome.trim().split(/\s+/);
      firstName = parts.shift() || '';
      lastName = parts.join(' ');
    }

    // Data in formato Jotform (YYYY-MM-DD -> year, month, day)
    let year = '', month = '', day = '';
    if (dataAvvistamento) {
      const p = dataAvvistamento.split('-');
      if (p.length === 3) {
        year = p[0];
        month = p[1];
        day = p[2];
      }
    }

    const params = new URLSearchParams();

    // Nome completo
    params.append(`submission[${QID.nomeCompleto}][first]`, firstName);
    params.append(`submission[${QID.nomeCompleto}][last]`, lastName);

    // Email, ente
    if (email) params.append(`submission[${QID.email}]`, email);
    if (ente) params.append(`submission[${QID.ente}]`, ente);

    // Data
    if (year && month && day) {
      params.append(`submission[${QID.data}][year]`, year);
      params.append(`submission[${QID.data}][month]`, month);
      params.append(`submission[${QID.data}][day]`, day);
    }

    // Ambiente circostante (lista -> stringa)
    const ambienteStr = Array.isArray(ambiente) ? ambiente.join(', ') : (ambiente || '');
    if (ambienteStr) {
      params.append(`submission[${QID.ambiente}]`, ambienteStr);
    }

    // Osservazioni generali
    if (ulterioriOsservazioni) {
      params.append(`submission[${QID.osservazioni}]`, ulterioriOsservazioni);
    }

    // Mappa / coordinate (stringa "lat, lng")
    if (geoloc) {
      params.append(`submission[${QID.mappa}]`, geoloc);
    }

    // Consenso
    if (consenso) {
      params.append(`submission[${QID.consenso}]`, consenso);
    }

    // Specie (fino a 10)
    const species = Array.isArray(speciesArray) ? speciesArray.slice(0, 10) : [];
    species.forEach((sp, index) => {
      const q = SPECIES_QIDS[index];
      if (!q || !sp) return;

      const {
        nomeSpecie = '',
        numeroSpecie = '',
        sessoSpecie = '',
        atlanteUccelli = [],
        cavita = '',
        numeroCavitaAvvistate = '',
        numeroCivico = '',
        note = ''
      } = sp;

      if (nomeSpecie) params.append(`submission[${q.nome}]`, nomeSpecie);
      if (numeroSpecie) params.append(`submission[${q.numero}]`, numeroSpecie);
      if (sessoSpecie) params.append(`submission[${q.sesso}]`, sessoSpecie);

      // Codici Atlante: li inviamo come stringa "1, 3a, 10 ..."
      if (Array.isArray(atlanteUccelli) && atlanteUccelli.length) {
        const atlanteStr = atlanteUccelli.join(', ');
        params.append(`submission[${q.codici}]`, atlanteStr);
      }

      if (note) params.append(`submission[${q.note}]`, note);
      if (cavita) params.append(`submission[${q.cavita}]`, cavita);
      if (numeroCavitaAvvistate) {
        params.append(`submission[${q.numeroCavita}]`, numeroCavitaAvvistate);
      }
      if (numeroCivico) params.append(`submission[${q.civico}]`, numeroCivico);
    });

    // NB: al momento NON alleghiamo il file a Jotform via API
    // (Jotform richiede un URL pubblico o multipart/form-data).
    // Possiamo eventualmente usare un campo testo dedicato per i metadati del file.
    // Esempio: params.append(`submission[999]`, `File: ${fileName} (${fileType})`);

    const res = await fetch(JOTFORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const out = await res.json();

    if (out.responseCode !== 200) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'jotform_error', details: out })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, jotform: out })
    };

  } catch (err) {
    console.error('Errore server Netlify/Jotform:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'server_error', details: String(err) })
    };
  }
};
