const FORM_ID = '253380853793063';
const API_KEY = process.env.JOTFORM_API_KEY;

// Endpoint API Jotform (EU)
const JOTFORM_URL = `https://eu-api.jotform.com/form/${FORM_ID}/submissions`;

const QID = {
  nome: 2,
  email: 3,
  ente: 5,
  data: 14,
  ambiente: 13,
  osservazioni: 7,
  mappa: 8,
  consenso: 11,
  contenitore: 10
};

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
      nome = '',
      cognome = '',
      ente = '',
      email = '',
      dataavvistamento = '',
      ambientecircostante = [],
      ulterioriosservazioni = '',
      mappa = '',
      consenso = '',
      numeroCavitaAvvistate = '',
      numeroCivico = '',
      speciesArray = [],
      fileInfo = null
    } = data;

    // Parsing della data (YYYY-MM-DD)
    let year = '', month = '', day = '';
    if (dataavvistamento) {
      const p = String(dataavvistamento).split('-');
      if (p.length === 3) {
        year = p[0];
        month = p[1];
        day = p[2];
      }
    }

    // Costruisco il contenitore JSON da mandare al campo "Elenco specie"
    const payloadContenitore = {
      numeroCavitaAvvistate,
      numeroCivico,
      species: speciesArray,
      file: fileInfo || undefined
    };

    const params = new URLSearchParams();

    // Nome e cognome (campo "Full Name" di Jotform)
    // submission[2][first], submission[2][last]
    params.append(`submission[${QID.nome}][first]`, nome);
    params.append(`submission[${QID.nome}][last]`, cognome);

    // Email
    params.append(`submission[${QID.email}]`, email);

    // Ente / ruolo
    params.append(`submission[${QID.ente}]`, ente);

    // Data (campo Date)
    if (year && month && day) {
      params.append(`submission[${QID.data}][year]`, year);
      params.append(`submission[${QID.data}][month]`, month);
      params.append(`submission[${QID.data}][day]`, day);
    }

    // Ambiente circostante: array → stringa
    const ambienteStr = Array.isArray(ambientecircostante)
      ? ambientecircostante.join(', ')
      : String(ambientecircostante || '');
    params.append(`submission[${QID.ambiente}]`, ambienteStr);

    // Osservazioni
    params.append(`submission[${QID.osservazioni}]`, ulterioriosservazioni);

    // Coordinate / mappa (salvate come stringa "lat, lng")
    params.append(`submission[${QID.mappa}]`, mappa);

    // Consenso (checkbox / radio)
    params.append(`submission[${QID.consenso}]`, consenso);

    // Campo lungo "Elenco specie JSON" con tutto il contenitore
    params.append(`submission[${QID.contenitore}]`, JSON.stringify(payloadContenitore));

    const url = `${JOTFORM_URL}?apiKey=${encodeURIComponent(API_KEY || '')}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const out = await res.json().catch(() => ({}));

    // Se Jotform non risponde con 200, consideriamo errore
    if (!out || out.responseCode !== 200) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'jotform_error',
          details: out || null
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        jotform: out
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'server_error',
        details: String(err)
      })
    };
  }
};
