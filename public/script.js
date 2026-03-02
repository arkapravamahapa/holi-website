// --- 0. AI CONFIGURATION (GEMINI 1.5 FLASH) ---
// PASTE YOUR KEY HERE
const GEMINI_API_KEY = "AIzaSyAxJabhhl4Ems6UcfWQG810cXvK_3ZsoXQ"; 

// --- 1. ADAPTIVE PERFORMANCE SCALING & GLOBALS ---
const hardwareCores = navigator.hardwareConcurrency || 4;
let performanceMultiplier = hardwareCores > 4 ? 1.5 : (hardwareCores < 4 ? 0.6 : 1.0);
let splatDepth = 0; // Essential for Google-style realistic paint stacking
let lastMicSplash = 0; // Prevents the microphone from lagging the browser

// --- 2. PROCEDURAL SPATIAL AUDIO (SAFE MODE) ---
let synthAudioContext = null;
function initSynth() {
    try {
        if (!synthAudioContext) synthAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (synthAudioContext.state === 'suspended') synthAudioContext.resume();
    } catch(e) { console.warn("Audio Context blocked by browser."); }
}

function playSpatialSplash(screenX) {
    if (!synthAudioContext) return;
    try {
        const xRatio = (screenX / window.innerWidth) * 2 - 1;
        const bufferSize = synthAudioContext.sampleRate * 0.4;
        const buffer = synthAudioContext.createBuffer(1, bufferSize, synthAudioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1; 
        
        const noiseSource = synthAudioContext.createBufferSource(); noiseSource.buffer = buffer;
        const filter = synthAudioContext.createBiquadFilter(); filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, synthAudioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, synthAudioContext.currentTime + 0.5);
        
        const gainNode = synthAudioContext.createGain();
        gainNode.gain.setValueAtTime(0.2, synthAudioContext.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.01, synthAudioContext.currentTime + 0.4);
        
        if (synthAudioContext.createStereoPanner) {
            const panner = synthAudioContext.createStereoPanner(); panner.pan.value = xRatio; 
            noiseSource.connect(filter); filter.connect(gainNode); gainNode.connect(panner); panner.connect(synthAudioContext.destination);
        } else {
            noiseSource.connect(filter); filter.connect(gainNode); gainNode.connect(synthAudioContext.destination);
        }
        noiseSource.start();
    } catch(e) { console.warn("Spatial audio skipped."); }
}

// --- 3. MULTILINGUAL DICTIONARY ---
// --- 3. MULTILINGUAL DICTIONARY ---
const translations = {
    en: {
        introMsg: "Welcome to the magical 3D Festival of Colors! ✨", 
        enterBtn: "Let's Play! 🎨", 
        mainTitle: "Happy Holi! 💖", 
        heroInst: "Tap the screen, or turn on Mic Mode and sing! 🎶<br><br>↓ Discover the Magic ↓", 
        micText: "Mic Mode 🎤", 
        partyText: "Party Time! ✨", 
        cleanText: "Wash Canvas 💧", 
        captureText: "Save Artwork 📸", 
        musicText: "Play Music 🎵", 
        aboutTitle: "A Universal Celebration of Love 💕",
        aboutP1: "Step into a world filled with joy, laughter, and endless colors! 🌈",
        aboutP2: "Holi is India's most vibrant festival, celebrating the blooming of spring and the triumph of love. 🌸",
        card1Title: "🔥 Holika Dahan (The Magical Eve)", 
        card1Desc: "The festival begins under the stars. We light warm bonfires to chase away the gloom, making way for a bright, fresh start! ✨",
        card2Title: "🎨 Rangwali Holi (The Splash of Colors!)", 
        card2Desc: "When the sun rises, the real fun begins! We playfully toss 'gulal' (soft color powder) at each other, spreading smiles and joy everywhere. 😊",
        galleryTitle: "Our Happy Gallery 🖼️", 
        galleryDesc: "Sweet glimpses of our beautiful, colorful chaos.", 
        moodLabel: "Pick Your Holi Vibe 💖",
        simTitle: "Dreamy Holi Simulator 🚀", 
        simDesc: "Where will the colors take you next? Pick a spot to dream up a fun future celebration!"
    },
    es: {
        introMsg: "¡Bienvenidos al mágico Festival de Colores en 3D! ✨", 
        enterBtn: "¡A Jugar! 🎨", 
        mainTitle: "¡Feliz Holi! 💖",
        heroInst: "¡Toca la pantalla o activa el Micrófono y canta! 🎶<br><br>↓ Descubre la Magia ↓", 
        micText: "Micrófono 🎤",
        partyText: "¡Hora de Fiesta! ✨", 
        cleanText: "Limpiar 💧", 
        captureText: "Guardar Arte 📸", 
        musicText: "Música 🎵", 
        aboutTitle: "Una Celebración de Amor 💕",
        aboutP1: "¡Entra en un mundo lleno de alegría, risas y colores infinitos! 🌈", 
        aboutP2: "Holi es el festival más vibrante de la India, celebrando el florecer de la primavera. 🌸",
        card1Title: "🔥 Holika Dahan (La Víspera Mágica)", 
        card1Desc: "El festival comienza bajo las estrellas. Encendemos cálidas hogueras para alejar la tristeza y darle la bienvenida a un nuevo comienzo. ✨",
        card2Title: "🎨 Rangwali Holi (¡Salpicadura de Colores!)", 
        card2Desc: "¡Al amanecer empieza la diversión! Nos lanzamos 'gulal' (polvos de colores) repartiendo sonrisas y alegría por todas partes. 😊",
        galleryTitle: "Nuestra Galería Feliz 🖼️", 
        galleryDesc: "Dulces vistazos de nuestro hermoso caos colorido.", 
        moodLabel: "Elige tu Vibra Holi 💖",
        simTitle: "Simulador de Ensueño 🚀", 
        simDesc: "¿A dónde te llevarán los colores? ¡Elige un lugar para imaginar una celebración futura muy divertida!"
    },
    zh: {
        introMsg: "歡迎來到神奇的 3D 色彩盛宴！✨", 
        enterBtn: "開始玩耍！🎨", 
        mainTitle: "侯麗節快樂！💖",
        heroInst: "點擊螢幕，或開啟麥克風唱歌吧！🎶<br><br>↓ 探索魔法 ↓", 
        micText: "麥克風 🎤",
        partyText: "派對時間！✨", 
        cleanText: "清理畫面 💧", 
        captureText: "保存藝術 📸", 
        musicText: "播放音樂 🎵", 
        aboutTitle: "充滿愛的全球慶典 💕",
        aboutP1: "走進一個充滿歡樂、笑聲和無盡色彩的世界！🌈", 
        aboutP2: "侯麗節是印度最充滿活力的節日，慶祝春天的綻放與愛的勝利。🌸",
        card1Title: "🔥 侯麗卡燃燒 (神奇的前夕)", 
        card1Desc: "節日在星空下開始。我們點燃溫暖的篝火，趕走陰霾，迎接美好的新開始！✨",
        card2Title: "🎨 色彩節 (色彩飛濺！)", 
        card2Desc: "當太陽升起，真正的樂趣就開始了！我們互相投擲'gulal'（柔軟的彩色粉末），將微笑和歡樂傳播到每個角落。😊",
        galleryTitle: "我們的快樂畫廊 🖼️", 
        galleryDesc: "我們美麗又多彩的混亂的甜蜜瞬間。", 
        moodLabel: "選擇你的侯麗節氛圍 💖",
        simTitle: "夢幻模擬器 🚀", 
        simDesc: "色彩接下來會帶你去哪裡？選一個地方，想像一場有趣的未來慶典吧！"
    }
};

const langSelect = document.getElementById('langSelect');
let userLang = navigator.language || navigator.userLanguage; userLang = userLang.substring(0, 2); 
if (!translations[userLang]) userLang = "en"; langSelect.value = userLang;

function updateLanguage(lang) {
    const dict = translations[lang] || translations['en'];
    document.querySelectorAll('[id]').forEach(el => {
        if(dict[el.id]) { el.classList.remove('morph'); void el.offsetWidth; el.classList.add('morph'); setTimeout(() => el.innerHTML = dict[el.id], 250); }
    });
}
updateLanguage(userLang);
langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

// --- 4. CONTEXT AWARENESS (GEO + WEATHER) ---
let localCity = "your location"; let userCountry = "Unknown";
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))));
}

fetch('https://get.geojs.io/v1/ip/geo.json').then(response => response.json()).then(data => {
    localCity = data.city || data.country || "Earth"; userCountry = data.country || "Unknown";
    document.getElementById('geoMessage').innerText = `Colors sent ${calculateDistance(20.5937, 78.9629, data.latitude, data.longitude).toLocaleString()} miles from India to ${localCity}.`;
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current_weather=true`);
}).then(res => res.json()).then(weatherData => {
    const code = weatherData.current_weather.weathercode; const hour = new Date().getHours();
    const greetingEl = document.getElementById('contextGreeting');
    let isNight = (hour >= 19 || hour <= 5);
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) greetingEl.innerText = "Let these colors brighten your rainy day.";
    else if (code >= 71 && code <= 77 || code >= 85 && code <= 86) greetingEl.innerText = "Bringing the warmth of spring to the snow.";
    else if (isNight) { greetingEl.innerText = "Even in darkness, color finds you."; document.querySelector('[data-theme="cosmic"]').click(); } 
    else if (hour >= 6 && hour <= 11) greetingEl.innerText = "May your day begin with color.";
    else greetingEl.innerText = "Wishing you a beautiful and colorful day.";
}).catch(err => console.log("Context API blocked or failed.", err));

// --- 5. FUTURE HOLI SIMULATOR ---
const simScenarios = {
    cyberpunk: ["Simulating 2077... Neon gulal illuminates the smog. Drones drop glowing turquoise powder across the hyper-city balconies.", "The urban skyline reflects electric pinks and bright cyan. You are celebrating Holi on a glass skybridge high above the traffic."],
    beach: ["Simulating coastal calm... A warm ocean breeze carries saffron and pink powder across the white sand.", "The sun is setting over the waves. The water reflects a sky filled with joyful, floating colors and the sound of distant drums."],
    mountain: ["Simulating high altitude... Crisp, freezing air meets vibrant warmth. Bright green and pink powder settles on the pristine white snow.", "At the summit, colors are thrown into the wind, carrying wishes across the Himalayan valleys."]
};

document.querySelectorAll('.sim-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const env = e.target.getAttribute('data-env');
        const randomText = simScenarios[env][Math.floor(Math.random() * simScenarios[env].length)];
        
        const simOutput = document.getElementById('simOutput');
        simOutput.classList.remove('morph'); void simOutput.offsetWidth; simOutput.classList.add('morph');
        setTimeout(() => simOutput.innerHTML = `<strong>[SYSTEM OVERRIDE]</strong><br>${randomText}`, 250);

        try { if(navigator.vibrate) navigator.vibrate([30, 50, 30]); } catch(err){}

        if (env === 'cyberpunk') { document.querySelector('[data-theme="neon"]').click(); scene.fog.color.setHex(0x0a001a); scene.fog.density = 0.002; } 
        else if (env === 'beach') { document.querySelector('[data-theme="romantic"]').click(); scene.fog.color.setHex(0xffe4b5); scene.fog.density = 0.0015; } 
        else if (env === 'mountain') { document.querySelector('[data-theme="spiritual"]').click(); scene.fog.color.setHex(0xffffff); scene.fog.density = 0.0025; document.body.style.backgroundColor = '#dbe9f4'; }
        
        for(let i=0; i<5; i++) { setTimeout(() => spawn3DSplash(Math.random() * window.innerWidth, Math.random() * window.innerHeight), i * 150); }
    });
});

// --- 6. THEMES & GOOGLE-STYLE THREE.JS ENGINE ---
let colorMemoryTracker = {}; let mostUsedColorHex = "None";
const themes = {
    neon: { colors: [0xFF0000, 0xFF4500, 0xFF8C00, 0xFFD700, 0xFFFF00], gravity: -0.3, speedMult: 0.5, sizeMult: 1.0, blend: THREE.AdditiveBlending, bg: '#0a001a', fog: 0.002, name: "Neon Glow" },
    romantic: { colors: [0xFFB7B2, 0xFFDAC1, 0xE2F0CB, 0xB5EAD7, 0xC7CEEA, 0xFF9AA2], gravity: -0.05, speedMult: 0.4, sizeMult: 1.5, blend: THREE.NormalBlending, bg: '#1a0f14', fog: 0.002, name: "Romantic Pastel" },
    cosmic: { colors: [0x0B3D91, 0x1E1A3D, 0x4B0082, 0x8A2BE2, 0x00FFFF, 0xFFFFFF], gravity: 0.0, speedMult: 0.2, sizeMult: 0.8, blend: THREE.AdditiveBlending, bg: '#000000', fog: 0.0005, name: "Cosmic Space" },
    spiritual: { colors: [0x2E8B57, 0x3CB371, 0x8FBC8F, 0xF5F5DC, 0xFFE4C4, 0xD2B48C], gravity: -0.2, speedMult: 0.6, sizeMult: 1.2, blend: THREE.NormalBlending, bg: '#0f140f', fog: 0.0015, name: "Earthy Spiritual" },
    stillness: { colors: [0x555555, 0x777777, 0x444444], gravity: 0.0, speedMult: 0.05, sizeMult: 0.5, blend: THREE.AdditiveBlending, bg: '#020202', fog: 0.003, name: "Stillness" },
    sunrise: { colors: [0xFFB7B2, 0xFFDAC1, 0xFFD700], gravity: -0.02, speedMult: 0.2, sizeMult: 1.8, blend: THREE.NormalBlending, bg: '#1a0f05', fog: 0.001, name: "Sunrise" }
};

let currentTheme = 'neon';
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active')); e.target.classList.add('active');
        currentTheme = e.target.getAttribute('data-theme');
        document.body.style.backgroundColor = themes[currentTheme].bg; scene.fog.density = themes[currentTheme].fog; scene.fog.color.setHex(0x050505); 
    });
});

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050505, themes.neon.fog);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.z = 400;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function createPowderTexture() {
    const ctxCanvas = document.createElement('canvas');
    ctxCanvas.width = 256; 
    ctxCanvas.height = 256;
    const ctx = ctxCanvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(128, 128, 40, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        const radius = 5 + Math.random() * 15;
        const x = 128 + Math.cos(angle) * dist;
        const y = 128 + Math.sin(angle) * dist;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.moveTo(128, 128);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    const gradient = ctx.createRadialGradient(110, 110, 5, 128, 128, 100);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'destination-out'; 
    
    return new THREE.CanvasTexture(ctxCanvas);
}

const powderTexture = createPowderTexture(); 
const particles = [];
let physicsState = "normal";

function spawn3DSplash(screenX, screenY, forceColor = null, silent = false) {
    if (!silent) {
        try {
            if(navigator.vibrate) navigator.vibrate(15);
            initSynth(); playSpatialSplash(screenX);
        } catch(e) {}
    }

    const vec = new THREE.Vector3(); const pos = new THREE.Vector3();
    vec.set((screenX / window.innerWidth) * 2 - 1, -(screenY / window.innerHeight) * 2 + 1, 0.5);
    vec.unproject(camera); vec.sub(camera.position).normalize();
    
    const distance = -camera.position.z / vec.z; 
    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    // Realistic Layering
    splatDepth += 0.05;
    pos.z = splatDepth; 

    const themeData = themes[currentTheme];
    const hexColor = forceColor !== null ? forceColor : themeData.colors[Math.floor(Math.random() * themeData.colors.length)];
    
    colorMemoryTracker[hexColor] = (colorMemoryTracker[hexColor] || 0) + 1;
    mostUsedColorHex = Object.keys(colorMemoryTracker).reduce((a, b) => colorMemoryTracker[a] > colorMemoryTracker[b] ? a : b);

    const material = new THREE.SpriteMaterial({ 
        map: powderTexture, color: hexColor, transparent: true, opacity: 1.0, depthTest: true 
    });

    const shadowMaterial = new THREE.SpriteMaterial({ 
        map: powderTexture, color: 0x000000, transparent: true, opacity: 0.3 
    });
    
    for (let i = 0; i < 5; i++) {
        const offX = (Math.random() - 0.5) * 50;
        const offY = (Math.random() - 0.5) * 50;
        const rot = Math.random() * Math.PI; 
        const size = (Math.random() * 100 + 60) * themeData.sizeMult;

        const shadow = new THREE.Sprite(shadowMaterial.clone());
        shadow.position.set(pos.x + offX + 4, pos.y + offY - 4, pos.z - 0.01);
        shadow.material.rotation = rot;
        shadow.scale.set(size, size, 1);
        shadow.userData = { type: 'splat', life: 10.0, targetScale: size, currentScale: 0.1 };

        const sprite = new THREE.Sprite(material.clone()); 
        sprite.position.set(pos.x + offX, pos.y + offY, pos.z);
        sprite.material.rotation = rot;
        sprite.scale.set(0.1, 0.1, 1);
        sprite.userData = { 
            type: 'splat', targetScale: size, currentScale: 0.1,
            velocity: new THREE.Vector3(0, 0, 0), friction: 0, gravity: 0, life: 10.0 
        };

        scene.add(shadow); particles.push(shadow);
        scene.add(sprite); particles.push(sprite);
    }

    const numParticles = 40 * performanceMultiplier;
    for (let i = 0; i < numParticles; i++) {
        const sprite = new THREE.Sprite(material.clone()); sprite.position.copy(pos);
        const size = (Math.random() * 20 + 10) * themeData.sizeMult; sprite.scale.set(size, size, 1);
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 15 + 5) * themeData.speedMult;
        const zSpeed = ((Math.random() - 0.5) * 10) * themeData.speedMult; 
        
        sprite.userData = { 
            type: 'dust', velocity: new THREE.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, zSpeed), 
            friction: 0.85, gravity: themeData.gravity * 0.4, life: 1.5, baseScale: size 
        };
        scene.add(sprite); particles.push(sprite);
    }
}


const clickLayer = document.getElementById('click-layer');
clickLayer.addEventListener('click', (e) => {
    if(storyAwaitingInteraction) { resumeStoryFromInteraction(); }
    spawn3DSplash(e.clientX, e.clientY);
});
clickLayer.addEventListener('touchstart', (e) => {
    if(storyAwaitingInteraction) { resumeStoryFromInteraction(); }
    spawn3DSplash(e.touches[0].clientX, e.touches[0].clientY);
});

// --- 7. "THE COLORS WITHIN" - GUIDED JOURNEY ---
const storyOverlay = document.getElementById('story-overlay');
const storyText = document.getElementById('story-text');
const breathCircle = document.getElementById('breathing-circle');
const endButtons = document.getElementById('guided-end-buttons');
const music = document.getElementById('bg-music');
let isGuidedMode = false; let storyAwaitingInteraction = false; let timelineTimeouts = [];

function changeThemeSilently(themeKey) {
    currentTheme = themeKey; document.body.style.backgroundColor = themes[themeKey].bg; scene.fog.density = themes[themeKey].fog;
}
function showText(text, duration = 3000) {
    storyText.style.opacity = '0';
    setTimeout(() => {
        storyText.innerText = text; storyText.style.opacity = '1';
        if(duration > 0) setTimeout(() => { storyText.style.opacity = '0'; }, duration);
    }, 1000);
}

document.getElementById('startGuideBtn').addEventListener('click', () => {
    isGuidedMode = true;
    try { initSynth(); if(music.paused) music.play(); music.volume = 0.2; } catch(e){}
    
    document.querySelectorAll('.fadeable-ui').forEach(el => el.style.opacity = '0');
    storyOverlay.style.display = 'flex'; storyOverlay.style.background = 'transparent'; 
    setTimeout(() => storyOverlay.style.opacity = '1', 100);

    changeThemeSilently('stillness');
    spawn3DSplash(window.innerWidth * 0.5, window.innerHeight * 0.8);

    timelineTimeouts.push(setTimeout(() => showText("Before color...", 4000), 1000));
    timelineTimeouts.push(setTimeout(() => showText("there is quiet.", 4000), 6000));
    timelineTimeouts.push(setTimeout(() => showText("In many parts of the world, life moves fast.", 5000), 12000));
    timelineTimeouts.push(setTimeout(() => showText("But for a moment, let everything slow.", 5000), 19000));
    
    timelineTimeouts.push(setTimeout(() => {
        showText("Take one breath with the screen.", 6000);
        breathCircle.style.opacity = '1'; breathCircle.classList.add('breathe-anim');
    }, 26000));

    timelineTimeouts.push(setTimeout(() => {
        breathCircle.style.opacity = '0'; changeThemeSilently('sunrise');
        spawn3DSplash(window.innerWidth * 0.5, window.innerHeight * 0.7);
        music.volume = 0.5; showText("The festival begins with a fire, burning away the past...", 4000);
    }, 35000));

    timelineTimeouts.push(setTimeout(() => { changeThemeSilently('romantic'); showText("But the next morning, the real magic begins.", 4000); }, 41000));

    timelineTimeouts.push(setTimeout(() => {
        changeThemeSilently('neon'); spawn3DSplash(window.innerWidth * 0.5, window.innerHeight * 0.5);
        showText("The streets erupt in a beautiful chaos of vibrant 'gulal'.", 5000);
    }, 47000));

    timelineTimeouts.push(setTimeout(() => {
        spawn3DSplash(window.innerWidth * 0.3, window.innerHeight * 0.4); spawn3DSplash(window.innerWidth * 0.7, window.innerHeight * 0.6);
        showText("We throw colors to forgive, to love, and to welcome the spring.", 5000);
    }, 54000));

    timelineTimeouts.push(setTimeout(() => { showText("But tonight, the meaning is yours.", 5000); }, 61000));
    
    timelineTimeouts.push(setTimeout(() => {
        storyOverlay.style.pointerEvents = 'none'; showText("Tap. Speak. Or simply move.", 0); storyAwaitingInteraction = true;
    }, 68000));
});

function resumeStoryFromInteraction() {
    storyAwaitingInteraction = false; storyText.style.opacity = '0';
    changeThemeSilently('neon'); music.volume = 1.0; 

    setTimeout(() => showText("This is your moment.", 4000), 1000);
    setTimeout(() => showText("Not perfect.", 3000), 6000);
    setTimeout(() => showText("Not controlled.", 3000), 11000);
    setTimeout(() => showText("Just alive.", 5000), 16000);

    setTimeout(() => { physicsState = "slowing"; showText("Somewhere in the world, someone else is watching color bloom too.", 6000); }, 24000);
    setTimeout(() => showText("Different sky.", 3000), 32000);
    setTimeout(() => showText("Different language.", 3000), 37000);
    setTimeout(() => showText("Same human heart.", 5000), 42000);

    setTimeout(() => { physicsState = "gathering"; music.volume = 0.4; showText("This moment will not repeat.", 5000); }, 50000);
    setTimeout(() => showText("These colors will never move in this exact way again.", 6000), 57000);
    setTimeout(() => showText("And yet...", 4000), 65000);

    setTimeout(() => {
        showText("The world is brighter because you touched it.", 0);
        storyOverlay.style.background = 'rgba(0,0,0,0.6)';
        storyOverlay.style.pointerEvents = 'all'; 
        setTimeout(() => { endButtons.classList.add('show'); }, 3000);
    }, 71000);
}

document.getElementById('storyRestartBtn').addEventListener('click', () => {
    endButtons.classList.remove('show'); storyText.style.opacity = '0'; storyOverlay.style.opacity = '0';
    setTimeout(() => storyOverlay.style.display = 'none', 1000);
    document.querySelectorAll('.fadeable-ui').forEach(el => el.style.opacity = '1');
    isGuidedMode = false; physicsState = "normal"; changeThemeSilently('neon');
    
    particles.forEach(p => { scene.remove(p); p.material.dispose(); }); particles.length = 0; splatDepth = 0;
});

// --- WASH THE CANVAS ---
document.getElementById('cleanToggle').addEventListener('click', () => {
    try { if(navigator.vibrate) navigator.vibrate(20); } catch(e){} 
    particles.forEach(p => { 
        scene.remove(p); 
        p.material.dispose(); 
    });
    particles.length = 0; 
    splatDepth = 0; // Reset the stack so we don't hit the camera!
});

document.getElementById('storyDownloadBtn').addEventListener('click', () => { document.getElementById('captureToggle').click(); });

// --- 8. SMART AI FESTIVAL GUIDE (BACKEND FETCH) ---
const chatFab = document.getElementById('aiChatFab');
const chatWindow = document.getElementById('aiChatWindow');
const closeChat = document.getElementById('closeAiChat');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatBody = document.getElementById('aiChatBody');

chatFab.addEventListener('click', () => { chatWindow.classList.add('open'); chatFab.style.display = 'none'; });
closeChat.addEventListener('click', () => { chatWindow.classList.remove('open'); setTimeout(() => chatFab.style.display = 'block', 300); });

function getApproxColorName(hexStr) {
    const map = {"16711807": "Hot Pink", "58879": "Cyan", "16724736": "Orange", "16766720": "Gold", "11141375": "Purple", "3329300": "Lime Green"};
    return map[hexStr] || "a vibrant color";
}

async function callGeminiAPI(userMessage) {
    const favColor = getApproxColorName(mostUsedColorHex);
    const themeName = themes[currentTheme].name;

    const systemPrompt = `You are a highly emotionally intelligent, friendly, and culturally accurate Indian guide explaining the Holi festival. 
    The user is visiting your digital website from: ${userCountry}. Adapt your explanation to be relatable to someone from that region.
    The user's current favorite WebGL theme is "${themeName}" and they have been throwing a lot of ${favColor} powder. Casually mention or compliment their color/theme choice to feel personalized.
    Detect their sentiment: if they sound sad, be warm and uplifting. If they are excited, match their energy.
    Keep your response short, poetic, and under 3 sentences. Do not use markdown formatting.`;

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, contextPrompt: systemPrompt })
        });
        const data = await response.json();
        if(data.error) throw new Error(data.error);
        return data.reply;
    } catch (error) {
        console.error("AI Error:", error);
        return "I'm sorry, the connection to the festival spirits is a bit weak right now. Try asking again!";
    }
}

aiSendBtn.addEventListener('click', async () => {
    const text = aiInput.value.trim();
    if(!text) return;
    
    aiChatBody.innerHTML += `<div class="user-msg">${text}</div>`;
    aiInput.value = '';
    
    const typingId = 'typing-' + Date.now();
    aiChatBody.innerHTML += `<div class="ai-msg" id="${typingId}">Thinking... ✨</div>`;
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    const aiResponse = await callGeminiAPI(text);
    
    document.getElementById(typingId).innerText = aiResponse;
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
});
aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') aiSendBtn.click(); });

// --- 9. UTILS & EVENT LISTENERS ---
let audioContext, analyser, dataArray;
let isMicActive = false;

document.getElementById('micToggle').addEventListener('click', async () => {
    if (!isMicActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser); analyser.fftSize = 256; dataArray = new Uint8Array(analyser.frequencyBinCount);
            isMicActive = true; document.getElementById('micToggle').classList.add('active'); document.getElementById('micText').innerText = "Listening...";
        } catch (err) { alert("Microphone access is required for Voice Reactive Mode."); }
    } else {
        audioContext.suspend(); isMicActive = false; document.getElementById('micToggle').classList.remove('active'); document.getElementById('micText').innerText = translations[langSelect.value].micText;
    }
});

let isPlaying = false;
document.getElementById('musicToggle').addEventListener('click', () => {
    if (isPlaying) { music.pause(); document.getElementById('musicText').innerText = translations[langSelect.value].musicText; } 
    else { music.play(); document.getElementById('musicText').innerText = "Pause Music"; }
    isPlaying = !isPlaying;
});

// WAKE UP ENGINE
document.getElementById('enterBtn').addEventListener('click', () => {
    document.getElementById('intro-screen').style.opacity = '0';
    setTimeout(() => { document.getElementById('intro-screen').style.display = 'none'; }, 1500);
    try { initSynth(); } catch(e) {}
});

document.getElementById('partyToggle').addEventListener('click', () => {
    let count = 0;
    try { if(navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]); } catch(e){} 
    const partyInterval = setInterval(() => {
        spawn3DSplash(Math.random() * window.innerWidth, Math.random() * (window.innerHeight * 0.8));
        count++; if(count > 15) clearInterval(partyInterval);
    }, 100);
});

document.getElementById('captureToggle').addEventListener('click', () => {
    renderer.render(scene, camera);
    const glDataURL = canvas.toDataURL('image/png');
    const compCanvas = document.createElement('canvas'); compCanvas.width = canvas.width; compCanvas.height = canvas.height;
    const ctx = compCanvas.getContext('2d');
    ctx.fillStyle = themes[currentTheme].bg; ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10;
        ctx.font = 'bold 30px Quicksand'; ctx.fillText(`A Universal Festival of Colors`, 30, compCanvas.height - 110);
        ctx.font = '20px Quicksand'; ctx.fillStyle = '#00E5FF'; ctx.fillText(`Celebrated globally in: ${localCity}`, 30, compCanvas.height - 75);
        ctx.font = 'italic 16px Quicksand'; ctx.fillStyle = '#FFD700'; ctx.fillText(`Timestamp: ${new Date().toLocaleString()}`, 30, compCanvas.height - 45);
        const link = document.createElement('a'); link.download = `Holi_Artwork_${localCity.replace(/\s+/g, '_')}.png`;
        link.href = compCanvas.toDataURL('image/png'); link.click();
    };
    img.src = glDataURL;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- 10. MAIN RENDER LOOP ---
let cameraAngle = 0;
function animate() {
    requestAnimationFrame(animate);
    let audioImpact = 0;
    
    if (isMicActive && analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0; for(let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        let average = sum / dataArray.length;
        
        let now = Date.now();
        // Cooldown timer to prevent lag loops!
        if (average > 80 && Math.random() > 0.5 && (now - lastMicSplash > 150)) {
            spawn3DSplash(Math.random() * window.innerWidth, Math.random() * window.innerHeight, null, true);
            lastMicSplash = now;
        }
        audioImpact = average / 255; 
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; const data = p.userData;
        
        if (data.type === 'splat') {
            data.currentScale += (data.targetScale - data.currentScale) * 0.2;
            p.scale.set(data.currentScale, data.currentScale, 1);
            data.life -= 0.001; 
        } else {
            if (physicsState === "slowing") { data.friction = 0.85; data.gravity *= 0.98; } 
            else if (physicsState === "gathering") {
                const direction = new THREE.Vector3(0,0,0).sub(p.position).normalize();
                data.velocity.add(direction.multiplyScalar(0.2)); data.friction = 0.95; data.gravity = 0; data.life -= 0.002;
            } else { data.gravity = themes[currentTheme].gravity * 0.4; } 

            p.position.add(data.velocity); data.velocity.multiplyScalar(data.friction); data.velocity.y += data.gravity; 
            if (physicsState !== "gathering") data.life -= 0.003; 
        }
        
        p.material.opacity = Math.min(data.life, 1.0);

        if (audioImpact > 0.1 && physicsState === "normal" && data.type !== 'splat') {
            const dynamicScale = data.baseScale + (audioImpact * 35); p.scale.set(dynamicScale, dynamicScale, 1);
            p.position.x += (Math.random() - 0.5) * (audioImpact * 12); p.position.y += (Math.random() - 0.5) * (audioImpact * 12);
        } else if (data.type !== 'splat') { 
            p.scale.set(data.baseScale, data.baseScale, 1); 
        }

        if (data.life <= 0) { scene.remove(p); p.material.dispose(); particles.splice(i, 1); }
    }
    
    if (isGuidedMode) {
        cameraAngle += 0.002; 
        camera.position.x = Math.sin(cameraAngle) * 300;
        camera.position.z = Math.cos(cameraAngle) * 300 + 100;
        camera.lookAt(scene.position);
    } else {
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.z += (400 - camera.position.z) * 0.05;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}
animate();