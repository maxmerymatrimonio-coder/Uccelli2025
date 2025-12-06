const FORM_ID = '253380853793063';
const API_KEY = process.env.JOTFORM_API_KEY;

// ENDPOINT EUROPEO – OBBLIGATORIO
const JOTFORM_URL =
  `https://eu-api.jotform.com/form/${FORM_ID}/submissions?apiKey=${API_KEY}`;

const QID = {
  nome: 2,
  email: 3,
  ente: 5,
  data: 14,
  ambiente: 13,
  osservazioni: 7,
  mappa: 8,
  consenso: 11,
  contenitore: 10,
  upload: 15
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
      fileUrl = ''
    } = data;

    let year = '', month = '', day = '';
    if (dataavvistamento) {
      const p = dataavvistamento.split('-');
      if (p.length === 3) { year=p[0]; month=p[1]; day=p[2]; }
    }

    const payloadContenitore = {
      numeroCavitaAvvistate,
      numeroCivico,
      species: speciesArray
    };

    const params = new URLSearchParams();

    params.append(`submission[${QID.nome}][first]`, nome);
    params.append(`submission[${QID.nome}][last]`, cognome);

    params.append(`submission[${QID.email}]`, email);
    params.append(`submission[${QID.ente}]`, ente);

    if (year && month && day) {
      params.append(`submission[${QID.data}][year]`, year);
      params.append(`submission[${QID.data}][month]`, month);
      params.append(`submission[${QID.data}][day]`, day);
    }

    const ambienteStr = Array.isArray(ambientecircostante)
      ? ambientecircostante.join(', ')
      : ambientecircostante;
    params.append(`submission[${QID.ambiente}]`, ambienteStr);

    params.append(`submission[${QID.osservazioni}]`, ulterioriosservazioni);
    params.append(`submission[${QID.mappa}]`, mappa);
    params.append(`submission[${QID.consenso}]`, consenso);
    params.append(`submission[${QID.contenitore}]`, JSON.stringify(payloadContenitore));

    if (fileUrl) params.append(`submission[${QID.upload}]`, fileUrl);

    const res = await fetch(JOTFORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const out = await res.json();

    if (out.responseCode !== 200) {
      return { statusCode: 500, body: JSON.stringify({ error: 'jotform_error', details: out }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, jotform: out }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'server_error', details: String(err) }) };
  }
};
