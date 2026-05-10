/* ── STARS ── */
(() => {
  const c = document.getElementById("stars");
  for (let i = 0; i < 45; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const sz = 1 + Math.random() * 2.2;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--td:${(1.1 + Math.random() * 2.4).toFixed(2)}s;--to:${(0.3 + Math.random() * 0.7).toFixed(2)};animation-delay:${(Math.random() * 3).toFixed(2)}s`;
    c.appendChild(s);
  }
})();

/* ── EQ BARS ── */
(() => {
  const eq = document.getElementById("eq");
  [5, 13, 19, 11, 17, 7, 15, 21, 9, 13, 19, 5].forEach((h, i) => {
    const s = document.createElement("span");
    s.style.cssText = `--es:${(0.28 + Math.random() * 0.5).toFixed(2)}s;--eh:${h}px;animation-delay:${(i * 0.06).toFixed(2)}s`;
    eq.appendChild(s);
  });
})();

/* ── LIGHTS ── */
const BC = [
  "#ff4466",
  "#ffcc00",
  "#44ddff",
  "#99ff44",
  "#ff88cc",
  "#ff8800",
  "#aa66ff",
  "#00ddaa",
];
function mkS(tag, cls, a) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (cls) el.setAttribute("class", cls);
  Object.entries(a).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
function buildLights() {
  const svg = document.getElementById("lights-svg");
  const W = window.innerWidth;
  svg.setAttribute("viewBox", `0 0 ${W} 80`);
  svg.innerHTML = "";
  const n = Math.floor(W / 58) + 2,
    sp = W / (n - 1),
    sy = 16;
  let d = `M0,${sy}`;
  for (let i = 0; i < n - 1; i++)
    d += ` Q${i * sp + sp / 2},${sy + 12} ${(i + 1) * sp},${sy}`;
  svg.appendChild(
    mkS("path", "", {
      d,
      fill: "none",
      stroke: "#7a4e2a",
      "stroke-width": "2",
    }),
  );
  for (let i = 0; i < n; i++) {
    const x = i * sp,
      c = BC[i % BC.length];
    const g = mkS("g", "bulb-g", {
      style: `--c:${c}`,
      "animation-delay": (i * 0.13).toFixed(2) + "s",
    });
    g.appendChild(
      mkS("line", "", {
        x1: x,
        y1: sy,
        x2: x,
        y2: sy + 9,
        stroke: "#7a4e2a",
        "stroke-width": "2",
      }),
    );
    g.appendChild(
      mkS("rect", "", {
        x: x - 4,
        y: sy + 9,
        width: 8,
        height: 5,
        rx: 2,
        fill: "#5a3618",
      }),
    );
    g.appendChild(
      mkS("ellipse", "", {
        cx: x,
        cy: sy + 24,
        rx: 8,
        ry: 12,
        fill: c,
        opacity: 0.9,
      }),
    );
    g.appendChild(
      mkS("ellipse", "", {
        cx: x,
        cy: sy + 24,
        rx: 14,
        ry: 18,
        fill: c,
        opacity: 0.14,
      }),
    );
    g.appendChild(
      mkS("ellipse", "", {
        cx: x - 2,
        cy: sy + 18,
        rx: 2.5,
        ry: 4,
        fill: "white",
        opacity: 0.4,
      }),
    );
    svg.appendChild(g);
  }
}

/* ── STEP ENGINE ── */
let cur = 0;
function step(n) {
  if (n !== cur + 1) return;
  const bCur = document.getElementById("b" + n);
  bCur.style.transition = "opacity .25s,transform .25s";
  bCur.style.opacity = "0";
  bCur.style.transform = "scale(.8)";
  setTimeout(() => (bCur.style.display = "none"), 260);
  cur = n;
  ACTIONS[n]();
}
function showNext(n,delay=900){
  if(n>9)return;
  setTimeout(() => {
    const b = document.getElementById("b" + n);
    b.style.display = "block";
    requestAnimationFrame(() => b.classList.add("show"));
  }, delay);
}
/* ── AUDIO CONTROLS ── */
function toggleAudio(){
  const audio = document.getElementById('birthday-audio');
  const btn   = document.getElementById('play-pause-btn');
  if(audio.paused){
    audio.play();
    btn.textContent = '⏸';
  } else {
    audio.pause();
    btn.textContent = '▶';
  }
}
function stopAllAudio(){
  document.getElementById('birthday-audio').pause();
  if(window._flute){
    window._flute.pause();
    window._flute.currentTime=0;
    window._flute=null;
  }
}
window.addEventListener('pagehide', stopAllAudio);
window.addEventListener('visibilitychange',()=>{
  if(document.hidden) stopAllAudio();
});

// update progress bar and time as audio plays
document.getElementById('birthday-audio').addEventListener('timeupdate', ()=>{
  const audio    = document.getElementById('birthday-audio');
  const fill     = document.getElementById('progress-fill');
  const thumb    = document.getElementById('progress-thumb');
  const timeDisp = document.getElementById('time-display');
  if(!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  fill.style.width  = pct + '%';
  thumb.style.left  = pct + '%';
  // format time  m:ss
  const m = Math.floor(audio.currentTime / 60);
  const s = Math.floor(audio.currentTime % 60).toString().padStart(2,'0');
  timeDisp.textContent = m + ':' + s;
});

// tap on progress bar to seek
document.getElementById('progress-bar').addEventListener('click', (e)=>{
  const audio = document.getElementById('birthday-audio');
  const rect  = e.currentTarget.getBoundingClientRect();
  const pct   = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});
function spawnSpeakers() {
  setTimeout(() => {
    document.getElementById("speaker-left").classList.add("slide-in");
    document.getElementById("speaker-right").classList.add("slide-in");
  }, 400);
}
/* ── ACTIONS ── */
const ACTIONS = {
  1() {
    document.body.classList.add("lit");
    buildLights();
    document.getElementById("lights-wrap").classList.add("on");
    sparkles(10);
    showNext(2, 1400);
  },

  2() {
    const cat = document.getElementById("cat");
    cat.classList.remove("wo");
    cat.classList.add("wi");
    setTimeout(() => {
      spawnSideBalloons(10);
      sparkles(25);
      cat.classList.remove("wi");
      //void cat.offsetWidth;
      cat.classList.add("jump");
      setTimeout(() => {
        document.getElementById("hero").classList.add("on");
        sparkles(8);
        showNext(3, 1600);
      }, 2600);
    }, 2100);
  },

  3() {
    const audio = document.getElementById("birthday-audio");
    spawnSpeakers();
    audio.play().catch((err) => {
      console.log("Autoplay blocked:", err);
    });
    document.getElementById("player").classList.add("show");
    musicNotes(18);
    sparkles(5);
    showNext(4, 900);
  },

  4() {
    document.getElementById("cake").classList.add("show");
    sparkles(9);
    showNext(5, 1000);
  },

  5() {
    ["fl1", "fl2", "fl3"].forEach((id, i) => {
      setTimeout(() => {
        document.getElementById(id).classList.add("lit");
        flashScreen();
      }, i * 360);
    });
    sparkles(7);
    showNext(6, 1200);
  },

  6() {
    document.body.classList.add("party");
    burstPoppers();
    confetti(110);
    spawnSideBalloons(4);
    showNext(7, 1100);
  },

  /* ════════════════════════════════
     MAKE A WISH — full sequence
     ════════════════════════════════ */
  7() {
    const env = document.getElementById("envelope");
    const overlay = document.getElementById("letter-overlay");

    /* 1 ── blow candles out one by one, right → left */
    const candleIds = ["fl3", "fl2", "fl1"];
    // x positions as fraction of cake width (SVG cx / viewBox width)
    const cxFracs = [0.628, 0.493, 0.358];

    candleIds.forEach((id, i) => {
      setTimeout(() => {
        document.getElementById(id).classList.remove("lit");
        /* spawn smoke wisp at each candle */
        const cake = document.getElementById("cake");
        const cr = cake.getBoundingClientRect();
        const s = document.createElement("div");
        s.className = "smoke";
        s.style.left = cr.left + cr.width * cxFracs[i] - 4 + "px";
        s.style.top = cr.top + cr.height * 0.14 + "px";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 2300);
      }, i * 480);
    });

    /* 2 ── dim the screen after all candles out */
    setTimeout(() => {
      document.getElementById("wish-dim").classList.add("on");
    }, 1700);

    /* 3 ── shooting star streaks across */
    setTimeout(() => {
      const ss = document.getElementById("sstar");
      ss.classList.add("go");
      setTimeout(() => ss.classList.remove("go"), 1700);
    }, 2500);

    /* 4 ── envelope pops in */
    setTimeout(() => {
      overlay.style.pointerEvents = "all";
      env.classList.add("pop");

      /* 5 ── flap opens + letter slides up */
      setTimeout(() => {
        env.classList.add("open");
      }, 750);
    }, 3800);

    /* 6 ── tapping the overlay closes everything, then shows b8 */
    overlay.addEventListener(
      "click",
      () => {
        /* close letter */
        env.classList.remove("open");
        setTimeout(() => {
          env.classList.remove("pop");
          overlay.style.pointerEvents = "none";
          document.getElementById("wish-dim").classList.remove("on");
        }, 600);
        /* reveal Spotify button */
      showNext(8,1000);
    },{once:true});
  },

  /* ── KRISHNA FEATHER SEQUENCE ── */
  8(){
    const curtain = document.getElementById('krishna-curtain');
    const feather = document.getElementById('krishna-feather');
    const wrap    = document.getElementById('krishna-text-wrap');

    // ✍️ YOUR GOLDEN TEXT LINES — edit freely
    const lines = [
      'हरे कृष्ण हरे कृष्ण',
      'कृष्ण कृष्ण हरे हरे',
      '~ ~ ~',
      'May Lord Krishna\'s flute',
      'always play in your heart,',
      'Simran.',
      '~ ~ ~',
      'Happy Birthday 🌸'
    ];

    const container = document.getElementById('krishna-lines');
    container.innerHTML = '';
    lines.forEach(txt=>{
      const s=document.createElement('span');
      s.className='kline';s.textContent=txt;
      container.appendChild(s);
    });
    const hint=document.createElement('span');
    hint.id='krishna-close';hint.textContent='tap anywhere to continue →';
    container.appendChild(hint);

    setTimeout(()=>{ feather.classList.add('fall'); },100);
    setTimeout(()=>{ curtain.classList.add('down'); },500);
    setTimeout(()=>{
      feather.classList.remove('fall');
      feather.classList.add('float');
    },2400);
   setTimeout(()=>{
  window._flute=new Audio('flute.mp3');
  window._flute.volume=0.75;
  // pause background music before flute plays
  const bg=document.getElementById('birthday-audio');
  bg.pause();
  window._flute.play().catch(()=>{});
},2600);
    setTimeout(()=>{
      wrap.classList.add('show');
      const allLines=container.querySelectorAll('.kline');
      allLines.forEach((el,i)=>{
        setTimeout(()=>el.classList.add('on'),i*480);
      });
      setTimeout(()=>hint.classList.add('on'),
        allLines.length*480+600);
    },3200);
wrap.addEventListener('click',()=>{
  // stop flute, resume background music
  if(window._flute){
    window._flute.pause();
    window._flute.currentTime=0;
    window._flute=null;
  }
  const bg=document.getElementById('birthday-audio');
  bg.play().catch(()=>{});

  wrap.classList.remove('show');
  feather.classList.remove('float','fall');
  feather.style.transition='top .8s ease,opacity .8s ease';
  feather.style.top='-280px';feather.style.opacity='0';
  curtain.classList.remove('down');curtain.classList.add('up');
  setTimeout(()=>{
    feather.style.top='-280px';
    feather.style.opacity='1';
    feather.style.transition='';
  },1000);
  showNext(9,800);
},{once:true});
  },

  9(){
    const audio=document.getElementById('birthday-audio');
    document.getElementById('spotify-panel').classList.add('show');
    // stop background music when spotify opens
    audio.pause();
    // also stop flute just in case it's still going
    if(window._flute){
      window._flute.pause();
      window._flute.currentTime=0;
      window._flute=null;
    }
    document.getElementById('spotify-close').addEventListener('click',()=>{
      audio.play().catch(()=>{});
    },{once:true});
  }
};


/* ── HELPERS ── */
function sparkles(n) {
  const em = ["✨", "⭐", "🌟", "💫"];
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const s = document.createElement("div");
      s.className = "spk";
      s.textContent = em[i % em.length];
      s.style.left = 4 + Math.random() * 92 + "%";
      s.style.top = 6 + Math.random() * 75 + "%";
      document.body.appendChild(s);
      requestAnimationFrame(() => s.classList.add("pop"));
      setTimeout(() => s.remove(), 2000);
    }, i * 150);
  }
}

function flashScreen() {
  document.body.style.transition = "background .07s";
  document.body.style.background = "#fff9e0";
  setTimeout(() => {
    document.body.style.transition = "background .45s";
    document.body.style.background = "";
    setTimeout(
      () => (document.body.style.transition = "background 1.3s ease"),
      550,
    );
  }, 75);
}

function spawnSideBalloons(count) {
  const bc = [
    ["#ff6b9d", "#ff3d78"],
    ["#7dc8ff", "#3aaeff"],
    ["#ffe066", "#ffcc00"],
    ["#b97aff", "#9b59f8"],
    ["#66ff99", "#33cc66"],
    ["#ff9966", "#ff7733"],
    ["#ff99cc", "#ff66aa"],
    ["#aaffee", "#44ddbb"],
  ];
  const sideXs = [3, 10, 18, 28, 38, 50, 62, 72, 82, 90, 96];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const [f, dk] = bc[i % bc.length],
        sz = 44 + Math.random() * 22;
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.left = sideXs[i % sideXs.length] + "%";
      const d = (2.5 + Math.random() * 1.5).toFixed(2),
        dl = (Math.random() * 0.4).toFixed(2);
      b.style.setProperty("--d", d + "s");
      b.style.setProperty("--dl", dl + "s");
      b.innerHTML = `<svg width="${sz}" height="${sz * 1.35}" viewBox="0 0 60 82" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="30" rx="26" ry="28" fill="${f}"/>
        <ellipse cx="22" cy="20" rx="7" ry="10" fill="${f}" opacity=".42"/>
        <ellipse cx="20" cy="18" rx="4" ry="6" fill="white" opacity=".35"/>
        <polygon points="30,58 26,64 34,64" fill="${dk}"/>
        <path d="M30 64 Q28 71 32 77" fill="none" stroke="${dk}" stroke-width="1.5"/>
      </svg>`;
      document.getElementById('balloon-container').appendChild(b);
      requestAnimationFrame(() => b.classList.add("up"));
    }, i * 130);
  }
}

function musicNotes(n) {
  const ns = ["♩", "♪", "♫", "♬", "🎵", "🎶"];
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const m = document.createElement("div");
      m.className = "mnote";
      m.textContent = ns[i % ns.length];
      m.style.left = 10 + Math.random() * 80 + "%";
      m.style.bottom = 55 + Math.random() * 28 + "%";
      const d = (2 + Math.random() * 2).toFixed(2),
        dl = (Math.random() * 0.6).toFixed(2);
      m.style.setProperty("--d", d + "s");
      m.style.setProperty("--dl", dl + "s");
      m.style.setProperty("--r", (Math.random() * 60 - 30).toFixed(0) + "deg");
      document.body.appendChild(m);
      requestAnimationFrame(() => m.classList.add("fly"));
      setTimeout(() => m.remove(), (+d + +dl + 0.5) * 1000);
    }, i * 100);
  }
}

function confetti(total) {
  const cc = [
    "#ff4466",
    "#ffcc00",
    "#44ddff",
    "#99ff44",
    "#ff88cc",
    "#ff8800",
    "#aa66ff",
    "#ff6655",
    "#00ddaa",
    "#ff99ff",
  ];
  for (let i = 0; i < total; i++) {
    const c = document.createElement("div");
    c.className = "cft";
    c.style.left = 4 + Math.random() * 92 + "%";
    c.style.background = cc[i % cc.length];
    const rib = Math.random() > 0.5;
    c.style.width = rib ? "4px" : 7 + Math.random() * 9 + "px";
    c.style.height = rib
      ? 14 + Math.random() * 20 + "px"
      : 5 + Math.random() * 9 + "px";
    c.style.borderRadius = rib ? "2px" : ["2px", "50%", "0"][i % 3];
    const d = (1.8 + Math.random() * 2.6).toFixed(2),
      dl = (Math.random() * 1.4).toFixed(2);
    c.style.setProperty("--d", d + "s");
    c.style.setProperty("--dl", dl + "s");
    c.style.setProperty(
      "--tx",
      ((Math.random() - 0.5) * 280).toFixed(0) + "px",
    );
    c.style.setProperty("--r", Math.floor(Math.random() * 720 - 360) + "deg");
    document.body.appendChild(c);
    requestAnimationFrame(() => c.classList.add("go"));
    setTimeout(() => c.remove(), (+d + +dl + 0.5) * 1000);
  }
}
function burstPoppers(){
  // popper sound effect using Web Audio API — no file needed
  function popSound(){
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++){
      data[i] = (Math.random()*2-1) * Math.pow(1 - i/data.length, 3);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.connect(gain);gain.connect(ctx.destination);
    src.start();
  }

  [['25%','65%','#ff4466'],['50%','70%','#ffcc00'],['75%','65%','#44ddff'],
   ['38%','60%','#ff88cc'],['62%','60%','#aa66ff']].forEach(([x,y,col],i)=>{
    setTimeout(()=>{
      popSound();
      // burst ring
      const r=document.createElement('div');r.className='bring';
      r.style.cssText=`left:${x};top:${y};width:50px;height:50px;border:4px solid ${col};margin:-25px 0 0 -25px;--dl:0s`;
      document.body.appendChild(r);setTimeout(()=>r.remove(),900);
      // mini firework at each popper location
      const bx=parseFloat(x)/100*window.innerWidth;
      const by=parseFloat(y)/100*window.innerHeight;
      for(let d=0;d<12;d++){
        const dot=document.createElement('div');dot.className='fwd';
        const a=(d/12)*Math.PI*2, dist=40+Math.random()*40;
        dot.style.cssText=`left:${bx}px;top:${by}px;width:7px;height:7px;background:${col};
          --tx:${(Math.cos(a)*dist).toFixed(0)}px;
          --ty:${(Math.sin(a)*dist).toFixed(0)}px;
          --d:${(.4+Math.random()*.3).toFixed(2)}s;--dl:0s`;
        document.body.appendChild(dot);
        setTimeout(()=>dot.remove(),800);
      }
    },i*200);
  });
}

window.addEventListener("resize", () => {
  if (document.getElementById("lights-wrap").classList.contains("on"))
    buildLights();
});
