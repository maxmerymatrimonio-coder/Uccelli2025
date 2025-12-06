(function(){

  // ========= GOOGLE MAPS + GEOLOCALIZZAZIONE =========
  let map;
  let marker;

  // Chiamata da Google Maps API (callback=initMap nell'HTML)
  window.initMap = function() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || !window.google || !google.maps) return;

    // Centro di default: Milano
    const defaultPos = { lat: 45.4642, lng: 9.19 };

    map = new google.maps.Map(mapDiv, {
      center: defaultPos,
      zoom: 12
    });

    marker = new google.maps.Marker({
      position: defaultPos,
      map: map,
      draggable: true
    });

    // Rende mappa e marker accessibili globalmente (per lettura EXIF, ecc.)
    window.map = map;
    window.marker = marker;

    const latInput = document.getElementById('latitudine');
    const lngInput = document.getElementById('longitudine');

    if (latInput && lngInput) {
      latInput.value = defaultPos.lat.toFixed(6);
      lngInput.value = defaultPos.lng.toFixed(6);
    }

    marker.addListener('dragend', (e) => {
      const pos = e.latLng;
      const lat = pos.lat();
      const lng = pos.lng();
      if (latInput && lngInput) {
        latInput.value = lat.toFixed(6);
        lngInput.value = lng.toFixed(6);
      }
    });

    chiediGeolocalizzazione();
  };

  function chiediGeolocalizzazione() {
    if (!navigator.geolocation || !map || !marker) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const nuovaPos = { lat, lng };

        map.setCenter(nuovaPos);
        map.setZoom(15);
        marker.setPosition(nuovaPos);

        const latInput = document.getElementById('latitudine');
        const lngInput = document.getElementById('longitudine');
        if (latInput && lngInput) {
          latInput.value = lat.toFixed(6);
          lngInput.value = lng.toFixed(6);
        }
      },
      (err) => {
        console.warn('Errore geolocalizzazione:', err);
        // se l'utente rifiuta rimaniamo sulla posizione di default
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  // ========= QUI SOTTO C'È TUTTO IL TUO SCRIPT ORIGINALE =========

  
// Gestione blocchi specie per versione ricercatori:
// mostra sempre i campi specie e nasconde eventuale pannello colori.
const species = document.getElementById('speciesFields');
const colorPanel = document.getElementById('colorPanel');
if (species) {
  species.style.display = 'block';
}
if (colorPanel) {
  colorPanel.style.display = 'none';
}

  // Other species text
  const selectSpecie = document.getElementById('nomeSpecie');
  const otherWrap = document.getElementById('otherSpeciesField');
  if(selectSpecie){
    selectSpecie.addEventListener('change',()=>{
    });
  }

  // Color selection
  const grid = document.getElementById('colorGrid');
  const hidden = document.getElementById('colorePredominante');
  if(grid){
    grid.addEventListener('click', (e)=>{
      const btn = e.target.closest('.color-btn');
      if(!btn) return;
      grid.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      hidden.value = btn.getAttribute('data-color') || '';
    });
  }

  // Consent -> enable submit
  const form = document.getElementById('butterfly-form');
  const submitBtn = document.getElementById('submitButton');
  const consentWarning = document.getElementById('consentWarning');
  form.addEventListener('change', ()=>{
    const consent = (form.querySelector('input[name="q266_ilSottoscritto"]:checked')||{}).value;
    if(consent === 'Acconsento'){
      submitBtn.disabled = false;
      consentWarning.style.display = 'none';
    } else {
      submitBtn.disabled = true;
      consentWarning.style.display = 'block';
    }
  });
  // Initialize submit disabled
  submitBtn.disabled = true;
  
  // Sincronizza coordinate con il campo geolocalizzazione di Jotform
  const latInputJF = document.getElementById('latitudine');
  const lngInputJF = document.getElementById('longitudine');
  const jotformGeoInput = document.getElementById('jotformGeoloc');
  if (latInputJF && lngInputJF && jotformGeoInput && form) {
    const syncGeoToJotform = () => {
      const lat = latInputJF.value;
      const lng = lngInputJF.value;
      if (lat && lng) {
        jotformGeoInput.value = lat + ', ' + lng;
      } else {
        jotformGeoInput.value = '';
      }
    };
    latInputJF.addEventListener('change', syncGeoToJotform);
    lngInputJF.addEventListener('change', syncGeoToJotform);
    form.addEventListener('submit', syncGeoToJotform);
    syncGeoToJotform();
  }

// ===== Selezione colore ali e scheda Occhio di pavone =====
  const colorButtons = document.querySelectorAll('.color-btn');
  const hiddenColorInput = document.getElementById('colorePredominante');

  const schedaSpecieRow = document.getElementById('schedaSpecieRow');
  const schedaSpecie = schedaSpecieRow ? schedaSpecieRow.querySelector('.species-card') : null;
  const nomeComuneSpecie = document.getElementById('nomeComuneSpecie');
  const nomeScientificoSpecie = document.getElementById('nomeScientificoSpecie');
  const fotoSpecieAperta = document.getElementById('fotoSpecieAperta');
  const fotoSpecieChiusa = document.getElementById('fotoSpecieChiusa');
  const testoAmbienteSpecie = document.getElementById('testoAmbienteSpecie');

  let currentSpecieValue = '';

  function resetMultiSpeciesView(){
    const pierisContainer = document.getElementById('pierisContainer');
    if(pierisContainer){
      pierisContainer.innerHTML = '';
    }
    const gialloNeroContainer = document.getElementById('gialloNeroContainer');
    if(gialloNeroContainer){
      gialloNeroContainer.innerHTML = '';
    }
    const arancioneMarroneContainer = document.getElementById('arancioneMarroneContainer');
    if(arancioneMarroneContainer){
      arancioneMarroneContainer.innerHTML = '';
    }
    const arancioNeroContainer = document.getElementById('arancioNeroContainer');
    if(arancioNeroContainer){
      arancioNeroContainer.innerHTML = '';
    }
    const arancioMarroneBiancoContainer = document.getElementById('arancioMarroneBiancoContainer');
    if(arancioMarroneBiancoContainer){
      arancioMarroneBiancoContainer.innerHTML = '';
    }
    const marroneBiancoContainer = document.getElementById('marroneBiancoContainer');
    if(marroneBiancoContainer){
      marroneBiancoContainer.innerHTML = '';
    }
    if(schedaSpecie){
      schedaSpecie.style.display = 'block';
    }
  }



function mostraOcchioDiPavone(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Occhio di Pavone';
    nomeComuneSpecie.textContent = 'Occhio di pavone ';
    nomeScientificoSpecie.textContent = '(Aglais io)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Occhio di pavone - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Occhio di pavone - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'È una farfalla che si incontra spesso in giardini, parchi e bordi di sentiero, dove gli adulti visitano i fiori per nutrirsi. ' +
        'Le larve vivono soprattutto su ortica in zone aperte, ai margini di boschi, siepi e aree agricole.';
    }
    schedaSpecieRow.style.display = 'block';
  }
  function mostraIcaro(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Icaro';
    nomeComuneSpecie.textContent = 'Icaro ';
    nomeScientificoSpecie.textContent = '(Polyommatus icarus)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Icaro - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Icaro - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent = 'Diffusa in prati aperti, campi e margini erbosi. I maschi sono di un azzurro brillante, le femmine più brunastre. Le larve si nutrono di leguminose spontanee come trifoglio e ginestrino.';
    }
    schedaSpecieRow.style.display = 'block';
  }

  function mostraCarcharodusAlceae(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Carcharodus alceae';
    nomeComuneSpecie.textContent = 'Skipper della malva ';
    nomeScientificoSpecie.textContent = '(Carcharodus alceae)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Carcharodus alceae - ali aperte';
    }
    if(fotoSpecieChiusa){
      // al momento non è disponibile una foto ad ali chiuse: riutilizziamo la stessa
      fotoSpecieChiusa.alt = 'Carcharodus alceae - ali chiuse';
      if(fotoSpecieChiusa){ fotoSpecieChiusa.style.display='none'; if(fotoSpecieChiusa.parentElement){ fotoSpecieChiusa.parentElement.style.display='none'; }}
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'Piccola farfalla bruno-marrone legata ad ambienti aperti e soleggiati, ' +
        'come prati aridi, bordi di sentiero e margini di campi. ' +
        'Le larve si nutrono soprattutto di malva e altre piante erbacee affini.';
    }
    schedaSpecieRow.style.display = 'block';
  }






  function mostraPierisBrassicae(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Pieris brassicae';
    nomeComuneSpecie.textContent = 'Cavolaia maggiore ';
    nomeScientificoSpecie.textContent = '(Pieris brassicae)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Pieris brassicae - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Pieris brassicae - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'Specie molto comune in ambienti agricoli, orti, giardini e margini di strada, ' +
        'le cui larve si nutrono di piante crucifere coltivate e spontanee.';
    }
    schedaSpecieRow.style.display = 'block';
  }

  function mostraPierisNapi(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Pieris napi';
    nomeComuneSpecie.textContent = 'Cavolaia verdastra ';
    nomeScientificoSpecie.textContent = '(Pieris napi)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Pieris napi - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Pieris napi - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent = 'Presente in prati freschi, bordi di bosco e zone umide. Riconoscibile per le venature verdastre sulle ali chiuse. Le larve vivono su diverse crucifere spontanee.';
    }
    schedaSpecieRow.style.display = 'block';
  }

  function mostraPierisRapae(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Pieris rapae';
    nomeComuneSpecie.textContent = 'Cavolaia minore ';
    nomeScientificoSpecie.textContent = '(Pieris rapae)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Pieris rapae - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Pieris rapae - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent = 'Specie molto comune in ambienti urbani e rurali. Visita spesso i fiori nei giardini e vicino alle abitazioni. Le larve si alimentano di Brassicaceae, inclusi numerosi ortaggi.';
    }
    schedaSpecieRow.style.display = 'block';
  }
  function mostraPierisGroup(){
    if(!schedaSpecieRow) return;
    schedaSpecieRow.style.display = 'block';
    if(schedaSpecie){
      schedaSpecie.style.display = 'none';
    }

    let container = document.getElementById('pierisContainer');
    if(!container){
      container = document.createElement('div');
      container.id = 'pierisContainer';
      container.className = 'pieris-cards';
      schedaSpecieRow.appendChild(container);
    }
    container.innerHTML = `
      <div class="species-card">
        <div class="help">
          <strong>Cavolaia maggiore</strong>
          <span style="font-style:italic">(Pieris brassicae)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Pieris brassicae - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Pieris brassicae - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Frequente in orti, giardini e campi coltivati.
              Le larve si nutrono avidamente di cavoli e altre crucifere.
              È una farfalla molto mobile, capace di formare grandi popolazioni.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Pieris brassicae')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Cavolaia verdastra</strong>
          <span style="font-style:italic">(Pieris napi)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Pieris napi - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Pieris napi - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Presente in prati freschi, boschi radi e zone umide.
              Si riconosce per le venature verdastre sulle ali chiuse.
              Le larve vivono su numerose crucifere spontanee.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Pieris napi')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Cavolaia minore</strong>
          <span style="font-style:italic">(Pieris rapae)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Pieris rapae - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Pieris rapae - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Specie molto comune in ambienti urbani e agricoli.
              Visita spesso i fiori nei giardini e nei parchi.
              Le larve si nutrono di diverse Brassicaceae coltivate.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Pieris rapae')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>
    `;
  }

function mostraArancioMarroneBiancoGroup(){
  if(!schedaSpecieRow) return;
  schedaSpecieRow.style.display = 'block';
  if(schedaSpecie){
    schedaSpecie.style.display = 'none';
  }
  let container = document.getElementById('arancioMarroneBiancoContainer');
  if(!container){
    container = document.createElement('div');
    container.id = 'arancioMarroneBiancoContainer';
    container.className = 'pieris-cards';
    schedaSpecieRow.appendChild(container);
  }
  container.innerHTML = `
    <div class="species-card">
      <div class="help">
        <strong>Carcharodus alceae</strong>
        <span style="font-style:italic">(Carcharodus alceae)</span>
      </div>
      <div class="species-body">
        <div class="species-images">
          <div class="img-block">
            <img  alt="Carcharodus alceae - ali aperte">
            <div class="caption">Ali aperte</div>
          </div>
          <div class="img-block" style="visibility:hidden">
            <img  alt="">
            <div class="caption">Ali chiuse</div>
          </div>
        </div>
        <div class="species-text">
          <p class="help">
            Piccola farfalla bruno-marmorizzata, tipica di prati aridi,
            bordi di sentiero e aree ruderali. Gli adulti si posano spesso
            con le ali semiaperte. Le larve vivono principalmente su
            <em>Malva</em> e altre malvacee spontanee.
          </p>
          <button type="button" class="btn species-select-btn"
                  onclick="scegliSpecie('Carcharodus alceae')">
            Seleziona specie
          </button>
        </div>
      </div>
    </div>
  `;
}


function mostraMarroneBiancoGroup(){
    if(!schedaSpecieRow) return;
    schedaSpecieRow.style.display = 'block';
    if(schedaSpecie){
      schedaSpecie.style.display = 'none';
    }

    let container = document.getElementById('marroneBiancoContainer');
    if(!container){
      container = document.createElement('div');
      container.id = 'marroneBiancoContainer';
      container.className = 'pieris-cards';
      schedaSpecieRow.appendChild(container);
    }

    container.innerHTML = `
      <div class="species-card">
        <div class="help">
          <strong>Licenide dei gerani</strong>
          <span style="font-style:italic">(Cacyreus marshalli)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Licenide dei gerani - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Licenide dei gerani - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Piccola farfalla marrone con disegni chiari sulle ali.
              Le larve scavano gallerie nei fusti e nei boccioli dei gerani e pelargoni coltivati.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Licenide dei Gerani')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Pyrgus malvoides</strong>
          <span style="font-style:italic">(Pyrgus malvoides)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Pyrgus malvoides - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Pyrgus malvoides - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Skipper bruno scuro con macchie bianche ben definite.
              Frequenta radure, prati aridi e margini di sentiero soleggiati.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Pyrgus malvoides')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>
    `;
}

function mostraGialloNeroGroup(){
    if(!schedaSpecieRow) return;
    schedaSpecieRow.style.display = 'block';
    if(schedaSpecie){
      schedaSpecie.style.display = 'none';
    }

    let container = document.getElementById('gialloNeroContainer');
    if(!container){
      container = document.createElement('div');
      container.id = 'gialloNeroContainer';
      container.className = 'pieris-cards';
      schedaSpecieRow.appendChild(container);
    }

    container.innerHTML = `
      <div class="species-card">
        <div class="help">
          <strong>Podalirio</strong>
          <span style="font-style:italic">(Iphiclides podalirius)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Podalirio - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Podalirio - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Tipica di zone collinari, frutteti e ambienti caldi.
              Riconoscibile dalle lunghe codine e dalle bande scure sulle ali.
              Le larve vivono su prugnolo, peri e altre rosaceae.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Podalirio')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Macaone</strong>
          <span style="font-style:italic">(Papilio machaon)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Macaone - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Macaone - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Farfalla vistosa e diffusa nei prati aperti e soleggiati.
              Le larve verdi con anelli neri vivono su finocchio e carota.
              Gli adulti visitano grandi fiori ricchi di nettare.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Macaone')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Crocea</strong>
          <span style="font-style:italic">(Colias crocea)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Colias crocea - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Colias crocea - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Specie migratrice molto mobile, comune in campi e pascoli.
              Le ali aranciate con bordo scuro sono ben visibili in volo.
              Le larve si nutrono di diverse leguminose spontanee.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Crocea')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>
    `;
  }

function mostraArancioNeroGroup(){
  if(!schedaSpecieRow) return;
  schedaSpecieRow.style.display = 'block';
  if(schedaSpecie){
    schedaSpecie.style.display = 'none';
  }
  let container = document.getElementById('arancioNeroContainer');
  if(!container){
    container = document.createElement('div');
    container.id = 'arancioNeroContainer';
    container.className = 'pieris-cards';
    schedaSpecieRow.appendChild(container);
  }
  container.innerHTML = `
    <div class="species-card">
      <div class="help">
        <strong>Latonia</strong>
        <span style="font-style:italic">(Issoria lathonia)</span>
      </div>
      <div class="species-body">
        <div class="species-images">
          <div class="img-block">
            <img  alt="Latonia - ali aperte">
            <div class="caption">Ali aperte</div>
          </div>
          <div class="img-block">
            <img  alt="Latonia - ali chiuse">
            <div class="caption">Ali chiuse</div>
          </div>
        </div>
        <div class="species-text">
          <p class="help">
            Farfalla arancio con macchie nere, comune in prati fioriti e campi incolti.
            Gli adulti volano rapidamente e visitano spesso i fiori a fine estate.
            Le larve si nutrono di viole e altre piante erbacee.
          </p>
          <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Latonia')">
            Seleziona specie
          </button>
        </div>
      </div>
    </div>
  `;
}

function mostraArancioneMarroneGroup(){
    if(!schedaSpecieRow) return;
    schedaSpecieRow.style.display = 'block';
    if(schedaSpecie){
      schedaSpecie.style.display = 'none';
    }

    let container = document.getElementById('arancioneMarroneContainer');
    if(!container){
      container = document.createElement('div');
      container.id = 'arancioneMarroneContainer';
      container.className = 'pieris-cards';
      schedaSpecieRow.appendChild(container);
    }

    container.innerHTML = `
      <div class="species-card">
        <div class="help">
          <strong>Virgola</strong>
          <span style="font-style:italic">(Polygonia c-album)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Virgola - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Virgola - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Specie comune in radure, margini di bosco e siepi.
              Le ali dentellate e il disegno arancio-marrone la rendono inconfondibile.
              Le larve si sviluppano su olmo, ortica e ribes.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Virgola')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Megera</strong>
          <span style="font-style:italic">(Lasiommata megera)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Lasiommata megera - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Lasiommata megera - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Frequente in zone erbose, scarpate stradali e aree rocciose.
              Ama posarsi al suolo o su pietre al sole con le ali aperte.
              Le larve si nutrono di diverse graminacee spontanee.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Lasiommata megera')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Rame comune</strong>
          <span style="font-style:italic">(Lycaena phlaeas)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Lycaena phlaeas - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Lycaena phlaeas - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Piccola farfalla arancio-rame, comune in prati e bordi di sentiero.
              Gli adulti volano bassi tra le erbe in ambienti aperti e soleggiati.
              Le larve si nutrono di romici e altre poligonacee.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Lycena phaleas')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>

      <div class="species-card">
        <div class="help">
          <strong>Farfalla dei prati</strong>
          <span style="font-style:italic">(Coenonympha pamphilus)</span>
        </div>
        <div class="species-body">
          <div class="species-images">
            <div class="img-block">
              <img  alt="Coenonympha pamphilus - ali aperte">
              <div class="caption">Ali aperte</div>
            </div>
            <div class="img-block">
              <img  alt="Coenonympha pamphilus - ali chiuse">
              <div class="caption">Ali chiuse</div>
            </div>
          </div>
          <div class="species-text">
            <p class="help">
              Molto frequente in prati, pascoli e margini erbosi.
              Vola bassa tra le erbe e spesso tiene le ali chiuse a riposo.
              Le larve si nutrono di vari tipi di graminacee.
            </p>
            <button type="button" class="btn species-select-btn" onclick="scegliSpecie('Coenonympha pamphilius')">
              Seleziona specie
            </button>
          </div>
        </div>
      </div>
    `;
  }








  function mostraPontiaEdusa(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Pieris edusa';
    nomeComuneSpecie.textContent = 'Edusa ';
    nomeScientificoSpecie.textContent = '(Pieris edusa)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Pieris edusa - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Pieris edusa - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent = 'Frequente in ambienti aridi, prati aperti e terreni incolti. Le ali chiuse mostrano un caratteristico disegno marmorizzato verdastro. Le larve si nutrono di piante crucifere spontanee.';
    }
    schedaSpecieRow.style.display = 'block';
  }

  function mostraGonepteryxRhamni(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Gonepteryx rhamni';
    nomeComuneSpecie.textContent = 'Cedronella ';
    nomeScientificoSpecie.textContent = '(Gonepteryx rhamni)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Gonepteryx rhamni - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Gonepteryx rhamni - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'Specie tipica di ambienti aperti, margini di bosco e siepi, facilmente riconoscibile ' +
        'per le ali giallo-verdi con contorno a forma di foglia.';
    }
    schedaSpecieRow.style.display = 'block';
  }


  function mostraVanessaAtalanta(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Vanessa atalanta';
    nomeComuneSpecie.textContent = 'Atalanta';
    nomeScientificoSpecie.textContent = '(Vanessa atalanta)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Vanessa atalanta - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Vanessa atalanta - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'Farfalla migratrice molto comune che frequenta giardini, parchi, radure e margini boschivi. ' +
        'Le larve si nutrono soprattutto di ortiche in luoghi freschi e umidi. ' +
        'Gli adulti visitano spesso i fiori ricchi di nettare dalla primavera all\'autunno.';
    }
    schedaSpecieRow.style.display = 'block';
  }

function nascondiSchedaSpecie(){
    if(!schedaSpecieRow) return;
    schedaSpecieRow.style.display = 'none';
    resetMultiSpeciesView();
  }

  if(colorButtons && colorButtons.length){
    colorButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const colore = btn.getAttribute('data-color');
        if(hiddenColorInput){
          hiddenColorInput.value = colore;
        }
        // evidenzia selezionato
        colorButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if(typeof resetMultiSpeciesView === 'function'){
          resetMultiSpeciesView();
        }

        if(colore === 'ROSSO/MARRONE'){
          mostraOcchioDiPavone();
        } else if(colore === 'MARRONE/NERO'){
          mostraCarcharodusAlceae();
        } else if(colore === 'NERO'){ mostraOcchioDiPavone(); } else if(colore === 'NERO/ARANCIO/BIANCO'){
          mostraVanessaAtalanta();
        } else if(colore === 'AZZURRO'){
          mostraIcaro();
        } else if(colore === 'BIANCO/NERO'){
          mostraPierisGroup();
        } else if(colore === 'GIALLO'){
          mostraGonepteryxRhamni();
        } else if(colore === 'GIALLO/NERO'){
          mostraGialloNeroGroup();
        } else if(colore === 'ARANCIO/NERO'){
          mostraArancioNeroGroup();
        } else if(colore === 'ARANCIONE/MARRONE'){
          mostraArancioneMarroneGroup();
        } else if(colore === 'MARRONE/BIANCO'){
          mostraMarroneBiancoGroup();
        } else if(colore === 'ARANCIO/MARRONE/BIANCO'){
          mostraVanessaDelCardo();
        } else if(colore === 'BIANCO/NERO/VERDE'){
          mostraPontiaEdusa();
        } else {
          nascondiSchedaSpecie();
        }
      });
    });
  }


  // ===== Lightbox per immagini Occhio di pavone =====
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');

  function openLightbox(src, alt){
    if(!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
  }

  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('active');
  }

  if(lightbox){
    lightbox.addEventListener('click', closeLightbox);
  }

  if(fotoSpecieAperta){
    fotoSpecieAperta.addEventListener('click', ()=>{
    });
  }
  if(fotoSpecieChiusa){
    fotoSpecieChiusa.addEventListener('click', ()=>{
    });
  }

  // ===== Pulsante "Seleziona specie" per scheda singola =====
  const selezionaSpecieBtn = document.querySelector('.species-select-btn');
  if (selezionaSpecieBtn && selectSpecie) {
    selezionaSpecieBtn.addEventListener('click', () => {
      if (!currentSpecieValue) return;

      const conosciSi = document.querySelector('input[name="conosciSpecieLocal"][value="si"]');
      if (conosciSi) {
        conosciSi.checked = true;
        if (typeof updateBlocks === 'function') {
          updateBlocks();
        }
      }

      selectSpecie.value = currentSpecieValue;

      if (schedaSpecieRow) {
        schedaSpecieRow.style.display = 'none';
      }
    });
  }

  // Funzione globale per la selezione dalle schede multiple (es. Pieris)
  window.scegliSpecie = function(specName){
    if(!selectSpecie) return;
    const conosciSi = document.querySelector('input[name="conosciSpecieLocal"][value="si"]');
    if(conosciSi){
      conosciSi.checked = true;
      if(typeof updateBlocks === 'function'){
        updateBlocks();
      }
    }
    selectSpecie.value = specName;
    if(schedaSpecieRow){
      schedaSpecieRow.style.display = 'none';
    }
  };




function mostraVanessaDelCardo(){
    if(!schedaSpecieRow) return;
    resetMultiSpeciesView();
    currentSpecieValue = 'Vanessa del cardo';
    nomeComuneSpecie.textContent = 'Vanessa del cardo ';
    nomeScientificoSpecie.textContent = '(Vanessa cardui)';
    if(fotoSpecieAperta){
      fotoSpecieAperta.alt = 'Vanessa del cardo - ali aperte';
    }
    if(fotoSpecieChiusa){
      fotoSpecieChiusa.alt = 'Vanessa del cardo - ali chiuse';
    }
    if(testoAmbienteSpecie){
      testoAmbienteSpecie.textContent =
        'Specie migratrice molto comune in prati fioriti, giardini, coltivi e aree urbane. ' +
        'Gli adulti visitano spesso i fiori ricchi di nettare e possono essere osservati in volo per lunghi periodi. ' +
        'Le larve si nutrono soprattutto di cardi, ortiche e altre piante erbacee spontanee.';
    }
    schedaSpecieRow.style.display='block';
}


// Gestione campo multiplo Nome specie + Numero individui + Sesso, con box "Specie 1", "Specie 2", ...
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('speciesFieldsContainer');
  const addBtn = document.getElementById('addSpeciesRow');
  if (!container || !addBtn) return;
  const template = container.querySelector('.species-box');
  if (!template) return;

  addBtn.addEventListener('click', function () {
    const clone = template.cloneNode(true);

    // Calcola nuovo indice per il titolo "Specie X"
    const existingBoxes = container.querySelectorAll('.species-box');
    const newIndex = existingBoxes.length + 1;
    const header = clone.querySelector('.species-box-header');
    if (header) {
      const titleEl = header.querySelector('.species-title');
      if (titleEl) {
        titleEl.textContent = 'Specie ' + newIndex;
      } else {
        header.textContent = 'Specie ' + newIndex;
      }
    }
    clone.dataset.index = newIndex;

    // reset di tutti i campi select e input nel nuovo box
    const selects = clone.querySelectorAll('select');
    selects.forEach(function (sel) {
      sel.selectedIndex = 0;
    });
    const inputs = clone.querySelectorAll('input[type="text"], input[type="number"]');
    inputs.forEach(function (input) {
      input.value = '';
    });

    // reset codici Atlante per la nuova specie
    const codiciHidden = clone.querySelector('.codici-atlante-value');
    if (codiciHidden) codiciHidden.value = '';

    const codiciSummary = clone.querySelector('.codici-atlante-selected');
    if (codiciSummary) codiciSummary.textContent = 'Nessun codice selezionato';

    container.appendChild(clone);
  });
});


// ====== GESTIONE CODICI ATLANTE PER SPECIE ======
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('codiciAtlanteModal');
  const container = document.getElementById('speciesFieldsContainer');
  const closeBtn = document.getElementById('codiciAtlanteClose');
  if (!modal || !container) return;

  const checkboxes = modal.querySelectorAll('.codici-list input[type="checkbox"]');
  const noteTextarea = modal.querySelector('.codici-note');
  let currentSpeciesBox = null;

  function openCodiciModalFor(box) {
    currentSpeciesBox = box;

    // azzera selezione
    checkboxes.forEach(function (cb) {
      cb.checked = false;
    });

    // ripristina eventuali codici già salvati
    const hidden = box.querySelector('.codici-atlante-value');
    if (hidden && hidden.value) {
      const selected = hidden.value
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s.length > 0; });

      checkboxes.forEach(function (cb) {
        if (selected.indexOf(cb.value) !== -1) {
          cb.checked = true;
        }
      });
    }


    // ripristina eventuali note già salvate
    if (noteTextarea) {
      var noteHidden = box.querySelector('.codici-atlante-note-value');
      noteTextarea.value = noteHidden && noteHidden.value ? noteHidden.value : '';
    }
    modal.classList.add('open');
  }

  function saveAndCloseCodiciModal() {
    if (currentSpeciesBox) {
      const selectedValues = Array.prototype.slice.call(checkboxes)
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return cb.value; });

      const hidden = currentSpeciesBox.querySelector('.codici-atlante-value');
      if (hidden) {
        hidden.value = selectedValues.join(', ');
      }

      
      // salva eventuali note nel campo nascosto per questa specie
      if (noteTextarea) {
        var noteHidden = currentSpeciesBox.querySelector('.codici-atlante-note-value');
        if (noteHidden) {
          noteHidden.value = noteTextarea.value.trim();
        }
      }
const summary = currentSpeciesBox.querySelector('.codici-atlante-selected');
      if (summary) {
        summary.textContent = selectedValues.length
          ? 'Codici selezionati: ' + selectedValues.join(', ')
          : 'Nessun codice selezionato';
      }
    }

    modal.classList.remove('open');
    currentSpeciesBox = null;
  }

  // Delego il click sul bottone "CODICI ATLANTE" (funziona anche sulle specie clonate)
  container.addEventListener('click', function (ev) {
    const btn = ev.target.closest('.btn-codici-atlante');
    if (!btn) return;
    const box = btn.closest('.species-box');
    if (box) {
      openCodiciModalFor(box);
    }
  });

  // X chiude e SALVA
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      saveAndCloseCodiciModal();
    });
  }

  // Click sullo sfondo scuro: chiude e salva
  modal.addEventListener('click', function (ev) {
    if (ev.target === modal) {
      saveAndCloseCodiciModal();
    }
  });

  // ESC: chiude e salva
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && modal.classList.contains('open')) {
      saveAndCloseCodiciModal();
    }
  });
});
})();



// ===============================================
// LIGHTBOX + ANTEPRIMA FOTO (A2) - upload utente
// ===============================================

// Array globale dei File selezionati e indice corrente nel lightbox
let selectedImagesA2 = [];
let currentLightboxIndex = 0;

// Riferimenti comuni agli elementi dell'interfaccia
const imageInputA2 = document.getElementById("butterflyImage");
const previewBoxA2 = document.getElementById("imagePreviewBox");
const previewContainerA2 = document.getElementById("previewContainer");
const dataAvvistamentoA2 = document.getElementById("dataAvvistamento");
const geolocInputA2 = document.getElementById("latitudine");
const geolocDisplayA2 = document.getElementById("longitudine");
const lightboxEl = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const AUDIO_ICON_URL = "audio-book.jpg";

function showExifWarning() {
  const box = document.getElementById("exifWarningBox");
  if (box) {
    box.classList.add("visible");
  } else {
    // Fallback di sicurezza se il box non esiste in pagina
    alert(
      "⚠️ Metadati EXIF non disponibili\n\n" +
      "La foto non contiene data o posizione GPS: controlla data e posizione.\n\n" +
      "Per ottenere foto con geotag:\n" +
      "📱 iPhone: Impostazioni → Privacy → Localizzazione → Fotocamera → Attiva 'Durante l’uso dell’app'\n" +
      "🤖 Android: Fotocamera → Impostazioni → Attiva 'Localizzazione / Tag GPS'"
    );
  }
}

function hideExifWarning() {
  const box = document.getElementById("exifWarningBox");
  if (box) {
    box.classList.remove("visible");
  }
}


// NUOVA FUNZIONE: Converte il file HEIC/HEIF in Blob JPEG
async function convertFile(file) {
  // Controlla il tipo MIME o l'estensione del file
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    (file.name && file.name.toLowerCase().endsWith(".heic")) ||
    (file.name && file.name.toLowerCase().endsWith(".heif"))
  ) {
    console.log(`Tentativo di conversione del file HEIC/HEIF: ${file.name}`);
    // 'heic2any' è disponibile globalmente grazie allo script aggiunto in index.html
    if (typeof heic2any === "undefined") {
      console.error("Libreria heic2any non caricata.");
      alert("Errore: la libreria di conversione HEIC non è disponibile.");
      return null;
    }
    try {
      // Converte il Blob HEIC in Blob JPEG
      const jpegBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      // heic2any restituisce un Blob o un array di Blob
      const convertedBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;

      // Crea un nuovo oggetto File con il Blob convertito e l'estensione .jpg
      const newFileName = (file.name || "immagine").replace(/\.heic|\.heif/i, "") + ".jpg";

      // Ritorna il nuovo File oggetto, compatibile per la preview e l'upload
      return new File([convertedBlob], newFileName, {
        type: "image/jpeg",
        lastModified: file.lastModified,
      });
    } catch (e) {
      console.error("Errore durante la conversione HEIC:", e);
      alert(`Impossibile convertire il file ${file.name} (formato HEIC/HEIF). Caricare una foto JPG/PNG.`);
      return null;
    }
  }
  return file; // Ritorna il file originale se non è HEIC
}



// Gestione selezione immagini
if (imageInputA2) {
  imageInputA2.addEventListener("change", async () => {
    const files = Array.from(imageInputA2.files || []);

    // Svuota stato precedente
    selectedImagesA2 = [];
    previewContainerA2.innerHTML = "";

    if (!files.length) {
      if (previewBoxA2) previewBoxA2.style.display = "none";
      syncFileInputA2();
      return;
    }

    if (previewBoxA2) previewBoxA2.style.display = "block";

    const firstFile = files[0];

    // Lettura EXIF solo sul primo file (data + GPS)
    if (firstFile && firstFile.type) {
      const fileName = (firstFile.name || "").toLowerCase();
      const fileType = (firstFile.type || "").toLowerCase();
      const isImage = fileType.startsWith("image/");
      const isHeic = fileType.includes("heic") || fileName.endsWith(".heic") || fileName.endsWith(".heif");

      if (isImage && typeof exifr !== "undefined" && !isHeic) {
        exifr
          .parse(firstFile)
          .then((meta) => {
            if (!meta) {
              showExifWarning();
              return;
            }

            let dateFound = false;
            let gpsFound = false;

            // Data di avvistamento da EXIF
            if (meta.DateTimeOriginal instanceof Date && dataAvvistamentoA2) {
              const d = meta.DateTimeOriginal;
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              dataAvvistamentoA2.value = `${yyyy}-${mm}-${dd}`;
              dateFound = true;
            }

            // Coordinate GPS da EXIF
            if (typeof meta.latitude === "number" && typeof meta.longitude === "number") {
              const lat = meta.latitude;
              const lng = meta.longitude;

              // Aggiorna mappa e marker se disponibili
              if (window.map && window.marker) {
                const coords = { lat, lng };
                window.map.setCenter(coords);
                window.map.setZoom(15);
                window.marker.setPosition(coords);
              }

              // Aggiorna i campi nascosti / di testo
              if (geolocInputA2 && geolocDisplayA2) {
                geolocInputA2.value = lat.toFixed(6);
                geolocDisplayA2.value = lng.toFixed(6);
              }

              console.log(
                `Posizione aggiornata dai dati EXIF: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`
              );
              gpsFound = true;
            }

            // Se non abbiamo trovato data o GPS, avvisa l'utente
            if (!dateFound || !gpsFound) {
              showExifWarning();
            }
          })
          .catch((err) => {
            console.warn("Errore durante la lettura EXIF:", err);
            showExifWarning();
          });
      } else {
        // Non è un formato immagine supportato, è HEIC/HEIF oppure la libreria EXIF non è disponibile
        showExifWarning();
      }
    }

    // Popola l'array con massimo 5 immagini, convertendo HEIC/HEIF se necessario
    for (const file of files) {
      if (selectedImagesA2.length >= 5) break;
      const fileToUse = await convertFile(file);
      if (fileToUse) {
        selectedImagesA2.push(fileToUse);
      }
    }


    renderPreviewsA2();
  });
}

// Render delle miniature con X di cancellazione


function renderPreviewsA2() {
  // Svuota il contenitore delle anteprime
  previewContainerA2.innerHTML = "";

  // Nessun file selezionato: nascondi completamente il box
  if (!selectedImagesA2.length) {
    if (previewBoxA2) previewBoxA2.style.display = "none";
    syncFileInputA2();
    return;
  }

  // Verifica se esiste almeno una FOTO o un VIDEO da mostrare
  const hasVisualMedia = selectedImagesA2.some((file) => {
    const typeLower = (file.type || "").toLowerCase();
    const nameLower = (file.name || "").toLowerCase();
    const isImage = typeLower.startsWith("image/");
    const isVideo = typeLower.startsWith("video/");
    return (
      isImage ||
      isVideo ||
      /\.(jpe?g|png|gif|webp|mp4|mov|avi|mkv|webm)$/i.test(nameLower)
    );
  });

  // Se ci sono solo AUDIO (o nessun media visualizzabile), nascondi il box
  if (!hasVisualMedia) {
    if (previewBoxA2) previewBoxA2.style.display = "none";
    syncFileInputA2();
    return;
  }

  // A questo punto c'è almeno una foto o un video → mostra il box
  if (previewBoxA2) previewBoxA2.style.display = "block";

  selectedImagesA2.forEach((file, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnail-wrapper";

    const fileNameLower = (file.name || "").toLowerCase();
    const fileTypeLower = (file.type || "").toLowerCase();

    const isHeic =
      fileTypeLower.includes("heic") ||
      fileNameLower.endsWith(".heic") ||
      fileNameLower.endsWith(".heif");

    const isImage = fileTypeLower.startsWith("image/");
    const isVideo = fileTypeLower.startsWith("video/");
    const isAudio = fileTypeLower.startsWith("audio/");

    const url = URL.createObjectURL(file);

    if (isImage) {
      // FOTO: anteprima cliccabile con lightbox
      const img = document.createElement("img");
      img.src = url;
      img.className = "image-thumbnail";
      img.addEventListener("click", () => openLightbox(index));

      // Fallback se il browser non riesce a mostrare il formato
      img.onerror = () => {
        wrapper.innerHTML = "";
        const placeholder = document.createElement("div");
        placeholder.className = "file-placeholder";
        if (isHeic) {
          placeholder.innerHTML =
            "<strong>File HEIC/HEIF</strong><br><span style='font-weight:400;'>Caricato (anteprima non disponibile)</span>";
        } else {
          placeholder.textContent = "Anteprima non disponibile";
        }
        wrapper.appendChild(placeholder);
      };

      wrapper.appendChild(img);
    } else if (isVideo) {
      // VIDEO: mini-player senza lightbox
      const video = document.createElement("video");
      video.src = url;
      video.className = "video-thumbnail";
      video.controls = true;
      video.muted = true;
      video.playsInline = true;
      wrapper.appendChild(video);
    } else if (isAudio) {
      // AUDIO: nessuna anteprima qui → ci pensa il riquadro BirdNET
      return; // non aggiunge wrapper al container
    } else {
      // ALTRI TIPI: solo etichetta con nome file
      const placeholder = document.createElement("div");
      placeholder.className = "file-placeholder";
      placeholder.textContent = file.name || "File caricato";
      wrapper.appendChild(placeholder);
    }

    // Pulsante X per cancellare
    const del = document.createElement("div");
    del.className = "thumbnail-delete";
    del.textContent = "×";
    del.addEventListener("click", (ev) => {
      ev.stopPropagation(); // Evita apertura lightbox quando clicchi sulla X
      deleteImageA2(index);
    });

    wrapper.appendChild(del);
    previewContainerA2.appendChild(wrapper);
  });

  syncFileInputA2();
}
// Elimina immagine dall'array e rinfresca anteprima
function deleteImageA2(index) {
  if (index < 0 || index >= selectedImagesA2.length) return;
  selectedImagesA2.splice(index, 1);
  renderPreviewsA2();
  hideExifWarning();

  // Se non ci sono più file in anteprima, riportiamo data e posizione a "adesso"
  if (selectedImagesA2.length === 0) {
    // Data corrente (oggi)
    const dateField = document.getElementById('dataAvvistamento');
    if (dateField) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      dateField.value = `${yyyy}-${mm}-${dd}`;
    }

    // Posizione GPS attuale (se disponibile)
    if (typeof chiediGeolocalizzazione === 'function') {
      try {
        chiediGeolocalizzazione();
      } catch (err) {
        console.warn('Errore nel ripristino geolocalizzazione dopo cancellazione immagine:', err);
      }
    }
  }
}

// Mantiene l'input file sincronizzato con selectedImagesA2
function syncFileInputA2() {
  if (!imageInputA2) return;
  const dt = new DataTransfer();
  selectedImagesA2.forEach((file) => dt.items.add(file));
  imageInputA2.files = dt.files;
}

// ================== LIGHTBOX ==================


function updateLightboxImageA2() {
  if (!lightboxImg) return;
  const file = selectedImagesA2[currentLightboxIndex];
  if (!file) return;

  const fileTypeLower = (file.type || "").toLowerCase();
  const isImage = fileTypeLower.startsWith("image/");
  const isAudio = fileTypeLower.startsWith("audio/");

  let url = "";

  if (isImage) {
    url = URL.createObjectURL(file);
  } else if (isAudio) {
    // Per i file audio usiamo l'icona statica
    url = AUDIO_ICON_URL;
  } else {
    // Per altri tipi di file, evitiamo di forzare la preview
    url = AUDIO_ICON_URL;
  }

  lightboxImg.classList.remove("animate-out");
  void lightboxImg.offsetWidth; // forza reflow per riavviare l'animazione
  lightboxImg.classList.add("animate-in");
  lightboxImg.src = url;
}

// Funzione per aprire la lightbox (globale per HTML)
function openLightbox(index) {
  if (!lightboxEl || !lightboxImg) return;
  if (!selectedImagesA2.length) return;

  // Corregge indice eventualmente fuori range
  if (index < 0 || index >= selectedImagesA2.length) {
    index = 0;
  }
  currentLightboxIndex = index;

  updateLightboxImageA2();
  lightboxEl.style.display = "flex";
}

// Funzione per chiudere la lightbox (globale per HTML)
function closeLightbox() {
  if (!lightboxEl || !lightboxImg) return;

  lightboxImg.classList.remove("animate-in");
  lightboxImg.classList.add("animate-out");

  setTimeout(() => {
    lightboxEl.style.display = "none";
    lightboxImg.classList.remove("animate-out");
    lightboxImg.src = "";
  }, 180);
}

function nextImage() {
  if (!selectedImagesA2.length) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % selectedImagesA2.length;
  updateLightboxImageA2();
}

function prevImage() {
  if (!selectedImagesA2.length) return;
  currentLightboxIndex =
    (currentLightboxIndex - 1 + selectedImagesA2.length) % selectedImagesA2.length;
  updateLightboxImageA2();
}

// Esporta funzioni sullo scope globale per uso in HTML (onclick)
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;

// Chiusura tramite ESC e click sullo sfondo
document.addEventListener("DOMContentLoaded", () => {
  if (!lightboxEl) return;

  // ESC
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && lightboxEl.style.display === "flex") {
      closeLightbox();
    }
  });

  // Clic sul backdrop (non sull'immagine)
  lightboxEl.addEventListener("click", (ev) => {
    if (ev.target === lightboxEl) {
      closeLightbox();
    }
  });

  // Swipe su mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const threshold = 50; // pixel minimi per considerare uno swipe

  lightboxEl.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    },
    { passive: true }
  );

  lightboxEl.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > threshold) {
        if (diff < 0) {
          // Swipe verso sinistra → prossima immagine
          nextImage();
        } else {
          // Swipe verso destra → immagine precedente
          prevImage();
        }
      }
    },
    { passive: true }
  );
});
window.toggleInfo = function(id) {
  const box = document.getElementById(id);
  if (box) {
    box.classList.toggle('visible');
  }
};
/* ===============================================
   SALVATAGGIO DATI UTENTE (LocalStorage)
   Incollare alla fine di script.js
=============================================== */
document.addEventListener("DOMContentLoaded", function() {

  // Seleziona gli elementi dal modulo HTML
  const nomeInput = document.getElementById('nomeRilevatore');
  const enteInput = document.getElementById('enteTitolo');
  const emailInput = document.getElementById('email');
  const clearBtn = document.getElementById('clearSavedUserData');

  // Nomi delle "chiavi" di memoria (etichette per il browser)
  const KEY_NOME = 'butterfly_user_name';
  const KEY_ENTE = 'butterfly_user_ente';
  const KEY_EMAIL = 'butterfly_user_email';

  // 1. AL CARICAMENTO: Controlla se ci sono dati salvati e riempie i campi
  if (nomeInput && localStorage.getItem(KEY_NOME)) {
    nomeInput.value = localStorage.getItem(KEY_NOME);
  }
  if (enteInput && localStorage.getItem(KEY_ENTE)) {
    enteInput.value = localStorage.getItem(KEY_ENTE);
  }
  if (emailInput && localStorage.getItem(KEY_EMAIL)) {
    emailInput.value = localStorage.getItem(KEY_EMAIL);
  }

  // 2. QUANDO SCRIVI: Salva immediatamente i dati nella memoria del browser
  if (nomeInput) {
    nomeInput.addEventListener('input', function() {
      localStorage.setItem(KEY_NOME, nomeInput.value);
    });
  }
  if (enteInput) {
    enteInput.addEventListener('input', function() {
      localStorage.setItem(KEY_ENTE, enteInput.value);
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      localStorage.setItem(KEY_EMAIL, emailInput.value);
    });
  }

  // 3. PULSANTE "DIMENTICA DATI": Cancella la memoria e pulisce i campi
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      // Rimuove i dati dalla memoria
      localStorage.removeItem(KEY_NOME);
      localStorage.removeItem(KEY_ENTE);
      localStorage.removeItem(KEY_EMAIL);

      // Pulisce visivamente i campi
      if (nomeInput) nomeInput.value = '';
      if (enteInput) enteInput.value = '';
      if (emailInput) emailInput.value = '';

      // Avviso visivo
      alert('I tuoi dati (Nome, Ente ed E-mail) sono stati rimossi da questo dispositivo.');
    });
  }
});

// ===============================================
// INVIO MODULO VIA NETLIFY FUNCTION → JOTFORM (Pacchetto B)
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("butterfly-form");
  const fileInput = document.getElementById("butterflyImage");
  const submitBtn = document.getElementById("submitButton");

  if (!form || !fileInput) return;

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Impossibile leggere il file selezionato."));
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Controlli base
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Carica almeno una foto prima di inviare.");
      return;
    }

    const emailInput = document.getElementById("email");
    if (!emailInput || !emailInput.value) {
      alert("Inserisci un indirizzo email.");
      return;
    }

    const consensoChecked = form.querySelector('input[name="q266_ilSottoscritto"]:checked');
    if (!consensoChecked || consensoChecked.value !== "Acconsento") {
      alert("Per inviare il modulo devi selezionare 'Acconsento'.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Invio in corso…";
    }

    try {
      const firstFile = fileInput.files[0];
      const dataUrl = await readFileAsDataURL(firstFile);
      const base64 = dataUrl.split(",")[1];

      
      const speciesArray = (() => {
        const container = document.getElementById("speciesFieldsContainer");
        if (!container) return [];
        const boxes = Array.from(container.querySelectorAll(".species-box"));
        return boxes
          .map((box) => {
            const nomeSpecie = (box.querySelector('input[name="q110_nomeSpecie"]')?.value || "").trim();
            const numeroSpecie = box.querySelector('select[name="q23_numeroIndividui"]')?.value || "";
            const sessoSpecie = box.querySelector('select[name="q360_sessoSpecie"]')?.value || "";
            const codiciStr = box.querySelector(".codici-atlante-value")?.value || "";
            const atlanteUccelli = codiciStr
              ? codiciStr.split(",").map((c) => c.trim()).filter(Boolean)
              : [];
            const cavita = (box.querySelector('input[name="cavita[]"]:checked') || {}).value || "";
            const numeroCavita = box.querySelector('input[name="numeroCavita"]')?.value || "";
            const numeroCivico = box.querySelector('input[name="numeroCivico"]')?.value || "";
            const note = box.querySelector(".codici-atlante-note-value")?.value || "";
            if (
              !nomeSpecie &&
              !numeroSpecie &&
              !sessoSpecie &&
              !atlanteUccelli.length &&
              !cavita &&
              !numeroCavita &&
              !numeroCivico &&
              !note
            ) {
              return null;
            }
            return {
              nomeSpecie,
              numeroSpecie,
              sessoSpecie,
              atlanteUccelli,
              cavita,
              numeroCavitaAvvistate: numeroCavita,
              numeroCivico,
              note,
            };
          })
          .filter(Boolean)
          .slice(0, 10);
      })();

      const ambiente = (() => {
        const checks = Array.from(
          document.querySelectorAll('input[name="q25_ambienteCircostante[]"]:checked')
        );
        return checks.map((c) => c.value);
      })();

      const payload = {
        formID: "253234849989376",
        email: emailInput.value,
        tipo:
          (form.querySelector('input[name="q30_scriviUna[]"]:checked') || {}).value || "",
        dataAvvistamento: document.getElementById("dataAvvistamento")?.value || "",
        nome: document.getElementById("nomeRilevatore")?.value || "",
        ente: document.getElementById("enteTitolo")?.value || "",
        ambiente,
        // Riepilogo testuale di tutte le specie (utile in e-mail / Excel)
        specie: (() => {
          if (!speciesArray.length) return "";
          return speciesArray
            .map((sp, index) => {
              const parts = [];
              if (sp.nomeSpecie) parts.push(`Specie: ${sp.nomeSpecie}`);
              if (sp.numeroSpecie) parts.push(`Numero individui: ${sp.numeroSpecie}`);
              if (sp.sessoSpecie) parts.push(`Sesso: ${sp.sessoSpecie}`);
              if (sp.atlanteUccelli && sp.atlanteUccelli.length) {
                parts.push(`Codici Atlante: ${sp.atlanteUccelli.join(", ")}`);
              }
              if (sp.cavita) parts.push(`Cavità: ${sp.cavita}`);
              if (sp.numeroCavitaAvvistate) {
                parts.push(`Numero cavità: ${sp.numeroCavitaAvvistate}`);
              }
              if (sp.numeroCivico) parts.push(`Civico: ${sp.numeroCivico}`);
              if (sp.note) parts.push(`Note: ${sp.note}`);
              return `${index + 1}) ${parts.join(" | ")}`;
            })
            .join("\n");
        })(),
        speciesArray,
        ulterioriOsservazioni:
          document.getElementById("ulterioriOsservazioni")?.value || "",
        consenso: consensoChecked.value,
        geoloc: document.getElementById("jotformGeoloc")?.value || "",
        fileBase64: base64,
        fileName: firstFile.name,
        fileType: firstFile.type || "image/jpeg",
      };
      const res = await fetch("/.netlify/functions/submit-jotform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (res.ok) {
        alert("Dati inviati correttamente a Jotform.");
        form.reset();
        const previewBox = document.getElementById("imagePreviewBox");
        const previewContainer = document.getElementById("previewContainer");
        if (previewBox) previewBox.style.display = "none";
        if (previewContainer) previewContainer.innerHTML = "";

        // Torna automaticamente all'inizio del modulo farfalle
        const rect = form.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const targetY = rect.top + scrollTop;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      } else {
        console.error("Errore Jotform:", text);
        alert("Errore nell'invio a Jotform:\n" + text);
      }
    } catch (err) {
      console.error("Errore invio Netlify function:", err);
      alert("Errore imprevisto durante l'invio del modulo. Riprova più tardi.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Invia";
      }
    }
  });
});
function removeSpecies(btn) {
  const box = btn.closest('.species-box');
  const container = document.getElementById('speciesFieldsContainer');
  if (!box) return;
  const boxes = container.querySelectorAll('.species-box');
  if (boxes.length <= 1) return;
  box.remove();
  let index = 1;
  container.querySelectorAll('.species-box').forEach(b => {
    b.dataset.index = index;
    const title = b.querySelector('.species-title');
    if (title) title.textContent = "Specie " + index;
    index++;
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('butterflyImage');
  const birdnetBox = document.getElementById('birdnetBox');
  if (!fileInput || !birdnetBox) return;
  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files || []);
    const hasAudio = files.some(file =>
      file.type.startsWith('audio') ||
      /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name)
    );
    birdnetBox.style.display = hasAudio ? 'block' : 'none';
  });
});


// === AUTOCOMPILAZIONE DA EXIF PER DATA + GPS ===
function dmsToDecimal(dmsArray, ref) {
  if (!Array.isArray(dmsArray) || dmsArray.length < 3) return null;
  const [deg, min, sec] = dmsArray;
  let dec = deg + min/60 + sec/3600;
  if (ref === 'S' || ref === 'W') dec = -dec;
  return dec;
}
async function autofillFromExif(file) {
  if (!file) return;
  const isImageType = file.type && file.type.startsWith('image/');
  const isHeicByName = /\.(heic|heif)$/i.test(file.name || '');
  if (!isImageType && !isHeicByName) return;
  try {
    const exif = await exifr.parse(file, { gps: true });
    if (!exif) return;
    const dateField = document.getElementById('dataAvvistamento');
    if (dateField && !dateField.value) {
      const exifDate =
        exif.DateTimeOriginal ||
        exif.CreateDate ||
        exif.ModifyDate ||
        exif.DateCreated;
      if (exifDate instanceof Date) {
        const yyyy = exifDate.getFullYear();
        const mm = String(exifDate.getMonth()+1).padStart(2,'0');
        const dd = String(exifDate.getDate()).padStart(2,'0');
        dateField.value = `${yyyy}-${mm}-${dd}`;
      }
    }
    let lat = exif.latitude ?? exif.GPSLatitude;
    let lng = exif.longitude ?? exif.GPSLongitude;
    if (Array.isArray(lat)) lat = dmsToDecimal(lat, exif.GPSLatitudeRef);
    if (Array.isArray(lng)) lng = dmsToDecimal(lng, exif.GPSLongitudeRef);
    if (typeof lat === 'number' && typeof lng === 'number') {
      const latInput = document.getElementById('latitudine');
      const lngInput = document.getElementById('longitudine');
      if (latInput && lngInput) {
        latInput.value = lat.toString();
        lngInput.value = lng.toString();
      }
      if (window.google && window.google.maps &&
          window.map instanceof google.maps.Map &&
          window.marker instanceof google.maps.Marker) {
        const pos = { lat, lng };
        window.marker.setPosition(pos);
        window.map.setCenter(pos);
        window.map.setZoom(16);
      }
    }
  } catch (err) { console.error('Errore EXIF:', err); }
}

window.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('butterflyImage');
  if (!fileInput) return;
  fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const firstImage =
      files.find(f => f.type.startsWith('image/')) ||
      files.find(f => /\.(jpe?g|png|heic|heif)$/i.test(f.name || ''));
    if (firstImage) autofillFromExif(firstImage);
  });
});

// TODO: apply Codici selezionati bolding update

// Aggiungi l'ascoltatore per la cancellazione dell'anteprima
document.querySelectorAll('.thumbnail-delete').forEach(button => {
    button.addEventListener('click', (event) => {
        removeFilePreview(event.target);
    });
});

// Funzione per cancellare l'anteprima del file
function removeFilePreview(fileElement) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.removeChild(fileElement.parentElement);  // Rimuove l'elemento di anteprima

    // Ripristina i campi data e GPS
    document.getElementById('dataAvvistamento').value = '';  // Svuota il campo data
    document.getElementById('latitudine').value = '';  // Svuota il campo latitudine
    document.getElementById('longitudine').value = '';  // Svuota il campo longitudine

    // Nasconde l'avviso EXIF, se visibile
    document.getElementById('exifWarningBox').style.display = 'none';
}

// ===== MOSTRARE "Hai avvistato cavità?" PER RONDONI =====
document.addEventListener('DOMContentLoaded', function () {
  const speciesContainer = document.getElementById('speciesFieldsContainer');
  if (!speciesContainer) return;

  speciesContainer.addEventListener('input', function (e) {
    const nameInput = e.target.closest('input[name="q110_nomeSpecie"]');
    if (!nameInput) return;

    const box = nameInput.closest('.species-box');
    if (!box) return;

    const cavitaRow = box.querySelector('.cavita-row');
    if (!cavitaRow) return;

    const value = (nameInput.value || '').toLowerCase();

    const trigger = [
      'rondone maggiore',
      'rondone comune',
      'rondone pallido'
    ];

    const shouldShow = trigger.some(t => value.includes(t));

    if (shouldShow) {
      cavitaRow.style.display = 'block';
    } else {
      cavitaRow.style.display = 'none';
      cavitaRow.querySelectorAll('input[type="radio"]').forEach(r => {
        r.checked = false;
      });
    }
  });
});



// Monitor the change of the "Hai avvistato cavità?" question
document.addEventListener('DOMContentLoaded', function () {
  const speciesContainer = document.getElementById('speciesFieldsContainer');
  if (!speciesContainer) return;

  speciesContainer.addEventListener('change', function (e) {
    if (e.target.name === 'cavita[]') {
      const box = e.target.closest('.species-box');
      const cavitaDetailsRow = box.querySelector('.cavita-details-row');
      const civicoDetailsRow = box.querySelector('.civico-details-row');

      if (e.target.value === 'Si') {
        cavitaDetailsRow.style.display = 'block';
        civicoDetailsRow.style.display = 'block';
      } else {
        cavitaDetailsRow.style.display = 'none';
        civicoDetailsRow.style.display = 'none';
      }
    }
  });
});
