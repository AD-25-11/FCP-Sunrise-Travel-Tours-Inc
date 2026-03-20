const continents = {
  'Asia': ['Japan','China','Philippines','Singapore','Thailand','Hong Kong','South Korea','Vietnam','Indonesia','Malaysia'],
  'Europe': ['France','Italy','Spain','Germany','United Kingdom','Switzerland','Greece','Netherlands'],
  'Africa': ['Kenya','South Africa','Morocco','Egypt','Tanzania','Botswana'],
  'North America': ['United States','Canada','Mexico','Costa Rica','Jamaica'],
  'South America': ['Peru','Brazil','Argentina','Chile','Colombia'],
  'Australia / Oceania': ['Australia','New Zealand','Fiji','Papua New Guinea','Samoa'],
  'Antarctica': ['Antarctica']
};
const continentPage = {
  'Asia': 'asia.html', 'Europe': 'europe.html', 'Africa': 'africa.html', 'North America': 'north-america.html',
  'South America': 'south-america.html', 'Australia / Oceania': 'australia-oceania.html', 'Antarctica': 'antarctica-continent.html'
};
const countrySlugMap = { 'United States':'united-states','United Kingdom':'united-kingdom','South Korea':'south-korea','Hong Kong':'hong-kong','New Zealand':'new-zealand','Costa Rica':'costa-rica','Papua New Guinea':'papua-new-guinea','South Africa':'south-africa' };
const countryLandmarks = {
  'Japan': 'Tokyo',
  'China': 'Great Wall',
  'Philippines': 'Boracay',
  'Thailand': 'Bangkok',
  'Singapore': 'Marina Bay',
  'South Korea': 'Seoul',
  'Vietnam': 'Ha Long Bay',
  'Indonesia': 'Bali',
  'Malaysia': 'Petronas Towers',
  'India': 'Taj Mahal',
  'United Arab Emirates': 'Burj Khalifa',
  'Turkey': 'Istanbul',
  'Qatar': 'Doha',
  'Saudi Arabia': 'Mecca',
  'Nepal': 'Mount Everest',
  'Sri Lanka': 'Sigiriya',
  'Maldives': 'Maldives',
  'Kazakhstan': 'Almaty',
  'Pakistan': 'K2',
  'Bangladesh': 'Sundarbans',
  'Jordan': 'Petra',
  'Israel': 'Jerusalem',
  'Lebanon': 'Beirut',
  'Oman': 'Muscat',
  'Kuwait': 'Kuwait City',
  'France': 'Eiffel Tower',
  'Italy': 'Colosseum',
  'Spain': 'Sagrada Familia',
  'Germany': 'Brandenburg Gate',
  'United Kingdom': 'Big Ben',
  'Switzerland': 'Matterhorn',
  'Netherlands': 'Windmills',
  'Greece': 'Acropolis',
  'Portugal': 'Belém Tower',
  'Austria': 'Schonbrunn Palace',
  'Belgium': 'Atomium',
  'Croatia': 'Plitvice Lakes',
  'Norway': 'Fjords',
  'Sweden': 'Stockholm',
  'Denmark': 'Little Mermaid',
  'Finland': 'Northern Lights',
  'Ireland': 'Dublin Castle',
  'Poland': 'Wawel Castle',
  'Czech Republic': 'Prague Castle',
  'Hungary': 'Parliament Building',
  'United States': 'Statue of Liberty',
  'Canada': 'CN Tower',
  'Mexico': 'Chichen Itza',
  'Costa Rica': 'Monteverde',
  'Jamaica': 'Montego Bay',
  'Panama': 'Panama Canal',
  'Bahamas': 'Nassau',
  'Cuba': 'Havana',
  'Dominican Republic': 'Punta Cana',
  'Guatemala': 'Tikal',
  'Honduras': 'Roatan',
  'El Salvador': 'Suchitoto',
  'Nicaragua': 'Granada',
  'Brazil': 'Christ the Redeemer',
  'Argentina': 'Buenos Aires',
  'Peru': 'Machu Picchu',
  'Chile': 'Easter Island',
  'Colombia': 'Cartagena',
  'Ecuador': 'Galapagos',
  'Bolivia': 'Salar de Uyuni',
  'Uruguay': 'Montevideo',
  'Paraguay': 'Asuncion',
  'Venezuela': 'Angel Falls',
  'Egypt': 'Pyramids',
  'Morocco': 'Bahia Palace',
  'Kenya': 'Serengeti',
  'South Africa': 'Table Mountain',
  'Tanzania': 'Mount Kilimanjaro',
  'Botswana': 'Okavango Delta',
  'Rwanda': 'Gorillas',
  'Uganda': 'Victoria Falls',
  'Ethiopia': 'Axum',
  'Ghana': 'Cape Coast Castle',
  'Nigeria': 'Lagos',
  'Madagascar': 'Baobab',
  'Namibia': 'Dune 45',
  'Zimbabwe': 'Victoria Falls',
  'Australia': 'Sydney Opera House',
  'New Zealand': 'Auckland',
  'Fiji': 'Fiji',
  'Papua New Guinea': 'Kokoda Track',
  'Samoa': 'Samoa',
  'Tonga': 'Tonga',
  'Vanuatu': 'Vanuatu',
  'Solomon Islands': 'Solomon Islands',
  'Palau': 'Palau',
  'Micronesia': 'Micronesia',
  'Antarctica': 'Iceberg'
};

function initImageFallbacks(){
  document.querySelectorAll('.country-card img, .spot-card img').forEach((img) => {
    const loadFallback = () => {
      const country = img.alt;
      const landmark = countryLandmarks[country] || 'landmark';
      img.src = `https://source.unsplash.com/1200x800/?${landmark},${country},travel`;
    };

    img.addEventListener('error', loadFallback);
  });
}

function initVideoFallbacks(){
  document.querySelectorAll('video').forEach((video) => {
    video.addEventListener('error', () => {
      video.closest('.promo-video-frame, .hero')?.classList.add('media-fallback');
    });
  });
}

function initPageAnimations(){
  const animatedItems = document.querySelectorAll('[data-animate]');
  const typingItems = document.querySelectorAll('[data-typing]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    animatedItems.forEach((item) => item.classList.add('is-visible'));
    typingItems.forEach((item) => {
      item.textContent = item.dataset.typing || '';
      item.classList.add('is-typed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px'
  });

  animatedItems.forEach((item) => {
    if (item.closest('.hero')) {
      requestAnimationFrame(() => item.classList.add('is-visible'));
      return;
    }
    revealObserver.observe(item);
  });

  const typeText = (element) => {
    const fullText = element.dataset.typing || '';
    const speed = Number(element.dataset.typingSpeed || 26);
    let index = 0;

    const tick = () => {
      element.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length) {
        window.setTimeout(tick, speed);
      } else {
        element.classList.add('is-typed');
      }
    };

    tick();
  };

  const typingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      typeText(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.45
  });

  typingItems.forEach((item) => typingObserver.observe(item));
}

function slugify(v){ return countrySlugMap[v] || v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function countryUrl(c){ return `${slugify(c)}.html`; }

function initMusic(){
  const audio = document.getElementById('theme-song');
  const btn = document.getElementById('music-toggle');
  if(!audio || !btn) return;
  const kick = () => audio.play().catch(() => {});
  window.addEventListener('load', kick);
  document.addEventListener('click', kick, { once:true });
  btn.onclick = () => {
    if(audio.paused){
      audio.play();
      btn.textContent = '🎵';
    } else {
      audio.pause();
      btn.textContent = '🔇';
    }
  };
}

function continentFromFeature(f){
  const p = f.properties || {};
  const c = (p.CONTINENT || p.continent || p.REGION_UN || '').toLowerCase();
  if(c.includes('asia')) return 'Asia';
  if(c.includes('europe')) return 'Europe';
  if(c.includes('africa')) return 'Africa';
  if(c.includes('north america')) return 'North America';
  if(c.includes('south america')) return 'South America';
  if(c.includes('oceania') || c.includes('australia')) return 'Australia / Oceania';
  if(c.includes('antarctica')) return 'Antarctica';
  const n = p.ADMIN || p.NAME || p.name || '';
  for(const [k,v] of Object.entries(continents)){ if(v.includes(n)) return k; }
  return 'Other';
}

async function initGlobe(){
  const el = document.getElementById('globeViz');
  if(!el) return;
  const status = document.getElementById('globeStatus');
  const globe = Globe()(el)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .showAtmosphere(false)
    .width(el.clientWidth).height(el.clientHeight);
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = .3;

  const routes = [
    [14.5995,120.9842,35.6762,139.6503],[14.5995,120.9842,1.3521,103.8198],[14.5995,120.9842,22.3193,114.1694],
    [14.5995,120.9842,25.2048,55.2708],[14.5995,120.9842,48.8566,2.3522],[14.5995,120.9842,34.0522,-118.2437]
  ].map((r,i)=>({startLat:r[0],startLng:r[1],endLat:r[2],endLng:r[3],color:['#ffd76a','#27d7c5'],dash:2200+i*140}));
  globe.arcsData(routes).arcColor('color').arcDashLength(.45).arcDashGap(.35).arcDashInitialGap(() => Math.random()).arcDashAnimateTime('dash').arcAltitude(.22).arcStroke(.7);

  const continentMarkers = [
    {continent:'Asia',lat:34.0479,lng:100.6197},{continent:'Europe',lat:54.5260,lng:15.2551},{continent:'Africa',lat:8.7832,lng:34.5085},
    {continent:'North America',lat:54.5260,lng:-105.2551},{continent:'South America',lat:-8.7832,lng:-55.4915},
    {continent:'Australia / Oceania',lat:-25.2744,lng:133.7751},{continent:'Antarctica',lat:-82.8628,lng:135}
  ];

  globe.pointsData(continentMarkers)
    .pointLat('lat').pointLng('lng').pointRadius(2.2).pointAltitude(.09)
    .pointColor(() => '#ffd76a')
    .pointLabel((d) => `Open ${d.continent}`)
    .onPointClick((d) => { if(continentPage[d.continent]) window.location.href = continentPage[d.continent]; });

  try{
    if(status) status.textContent = 'Globe ready: click points or arcs.';
  }catch(e){
    if(status) status.textContent = 'Unable to load world boundaries from network in this environment.';
    console.error(e);
  }
  window.addEventListener('resize', () => globe.width(el.clientWidth).height(el.clientHeight));
}

initMusic();
initGlobe();
initImageFallbacks();
initVideoFallbacks();
initPageAnimations();
