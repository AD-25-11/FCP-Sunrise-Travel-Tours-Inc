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

function slugify(v){ return countrySlugMap[v] || v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function countryUrl(c){ return `${slugify(c)}.html`; }

function initMusic(){
  const audio=document.getElementById('theme-song');
  const btn=document.getElementById('music-toggle');
  if(!audio||!btn) return;
  // Use the correct filename for the theme song and ensure it loads properly.
  audio.src = 'audio/FCP%20Sunrise%20Theme.mp3';
  // Configure autoplay behavior: start muted (allowed), then unmute on first user interaction.
  audio.autoplay=true;
  audio.muted=true;
  audio.preload='auto';
  audio.loop=true;
  audio.currentTime=0;
  btn.textContent='🔇';
  btn.title='Click to unmute the theme song (required by some browsers)';

  // Attempt to play immediately (muted so browser allows it)
  audio.play().catch(()=>{});

  // Unlock audio on first user interaction (unmute + play)
  const unlock=()=>{
    audio.muted=false;
    if(audio.paused) audio.play().catch(()=>{});
    btn.textContent='🎵';
    btn.title='Click to mute the theme song';
    document.removeEventListener('click',unlock);
  };
  document.addEventListener('click',unlock,{once:true});

  btn.onclick=()=>{
    if(audio.paused){
      audio.play().catch(()=>{});
      btn.textContent='🎵';
    } else {
      audio.pause();
      btn.textContent='🔇';
    }
  };
}

function continentFromFeature(f){
  const p=f.properties||{};
  const c=(p.CONTINENT||p.continent||p.REGION_UN||'').toLowerCase();
  if(c.includes('asia')) return 'Asia';
  if(c.includes('europe')) return 'Europe';
  if(c.includes('africa')) return 'Africa';
  if(c.includes('north america')) return 'North America';
  if(c.includes('south america')) return 'South America';
  if(c.includes('oceania')||c.includes('australia')) return 'Australia / Oceania';
  if(c.includes('antarctica')) return 'Antarctica';
  const n=p.ADMIN||p.NAME||p.name||'';
  for(const [k,v] of Object.entries(continents)){ if(v.includes(n)) return k; }
  return 'Other';
}

async function initGlobe(){
  const el=document.getElementById('globeViz');
  if(!el) return;
  const status=document.getElementById('globeStatus');
  if(status) status.textContent='Checking Globe library...';
  if(typeof window.Globe === 'undefined'){
    if(status) status.textContent='Globe library not loaded. Using fallback.';
    // Fallback: create a static globe image with links
    el.innerHTML = `
      <div style="text-align:center; padding:2rem;">
        <img src="https://source.unsplash.com/800x600/?globe,earth,travel" alt="World Globe" style="max-width:100%; border-radius:12px;">
        <p>Interactive globe not available. Explore destinations below:</p>
        <div style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; margin-top:1rem;">
          <a href="asia.html" class="btn btn-primary">Asia</a>
          <a href="europe.html" class="btn btn-primary">Europe</a>
          <a href="africa.html" class="btn btn-primary">Africa</a>
          <a href="north-america.html" class="btn btn-primary">North America</a>
          <a href="south-america.html" class="btn btn-primary">South America</a>
          <a href="australia-oceania.html" class="btn btn-primary">Australia/Oceania</a>
          <a href="antarctica-continent.html" class="btn btn-primary">Antarctica</a>
        </div>
      </div>
    `;
    return;
  }
  if(status) status.textContent='Globe library loaded, initializing...';
  try {
    if(status) status.textContent='Creating globe...';
    const globe = window.Globe()(el)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true).atmosphereColor('#66cfff').atmosphereAltitude(.16)
      .width(el.clientWidth || 800).height(el.clientHeight || 600);
    if(status) status.textContent='Globe created, setting controls...';
    globe.controls().autoRotate=true;
    globe.controls().autoRotateSpeed=.3;

    if(status) status.textContent='Adding routes...';
    const routes=[
      [14.5995,120.9842,35.6762,139.6503],[14.5995,120.9842,1.3521,103.8198],[14.5995,120.9842,22.3193,114.1694],
      [14.5995,120.9842,25.2048,55.2708],[14.5995,120.9842,48.8566,2.3522],[14.5995,120.9842,34.0522,-118.2437]
    ].map((r,i)=>({startLat:r[0],startLng:r[1],endLat:r[2],endLng:r[3],color:['#ffdf00','#ffd158'],dash:2200+i*140}));
    globe.arcsData(routes).arcColor('color').arcDashLength(.45).arcDashGap(.35).arcDashInitialGap(()=>Math.random()).arcDashAnimateTime('dash').arcAltitude(.22).arcStroke(.7);

    if(status) status.textContent='Adding points...';
    const markers=[
      {name:'Great Wall of China',country:'China',lat:40.4319,lng:116.5704},
      {name:'Mount Fuji',country:'Japan',lat:35.3606,lng:138.7274},
      {name:'Eiffel Tower',country:'France',lat:48.8584,lng:2.2945},
      {name:'Statue of Liberty',country:'United States',lat:40.6892,lng:-74.0445},
      {name:'Sydney Opera House',country:'Australia',lat:-33.8568,lng:151.2153},
      {name:'Boracay Island',country:'Philippines',lat:11.9674,lng:121.9248},
      {name:'Palawan',country:'Philippines',lat:9.8349,lng:118.7384}
    ];
    const continentMarkers=[
      {name:'Asia',continent:'Asia',lat:34.0479,lng:100.6197},
      {name:'Europe',continent:'Europe',lat:54.5260,lng:15.2551},
      {name:'Africa',continent:'Africa',lat:8.7832,lng:34.5085},
      {name:'North America',continent:'North America',lat:54.5260,lng:-105.2551},
      {name:'South America',continent:'South America',lat:-8.7832,lng:-55.4915},
      {name:'Australia / Oceania',continent:'Australia / Oceania',lat:-25.2744,lng:133.7751},
      {name:'Antarctica',continent:'Antarctica',lat:-82.8628,lng:135.0000}
    ];
    globe.pointsData([...markers, ...continentMarkers])
      .pointLat('lat').pointLng('lng')
      .pointRadius(d=>d.continent?2:1)
      .pointAltitude(.1)
      .pointColor(d=>d.continent?'#ffdf00':'#27dcff')
      .pointLabel(d=>d.continent?`Explore ${d.name}`:`${d.name}<br>${d.country}`)
      .onPointClick(d=>{
        if(d.continent && continentPage[d.continent]) window.location.href=continentPage[d.continent];
        else if(d.country) window.location.href=countryUrl(d.country);
      });

    let hovered=null;
    // Removed polygon loading to improve performance and reduce lagging
    if(status) status.textContent='Globe ready: click on points to explore destinations and continents.';
    window.addEventListener('resize',()=>globe.width(el.clientWidth).height(el.clientHeight));
  } catch(e) {
    if(status) status.textContent='Error initializing globe: ' + e.message;
    // Fallback to static
    el.innerHTML = `
      <div style="text-align:center; padding:2rem;">
        <img src="https://source.unsplash.com/800x600/?globe,earth,travel" alt="World Globe" style="max-width:100%; border-radius:12px;">
        <p>Interactive globe failed to load. Explore destinations below:</p>
        <div style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; margin-top:1rem;">
          <a href="asia.html" class="btn btn-primary">Asia</a>
          <a href="europe.html" class="btn btn-primary">Europe</a>
          <a href="africa.html" class="btn btn-primary">Africa</a>
          <a href="north-america.html" class="btn btn-primary">North America</a>
          <a href="south-america.html" class="btn btn-primary">South America</a>
          <a href="australia-oceania.html" class="btn btn-primary">Australia/Oceania</a>
          <a href="antarctica-continent.html" class="btn btn-primary">Antarctica</a>
        </div>
      </div>
    `;
  }
}

window.addEventListener('load', () => {
  initMusic();
  initGlobe();
});