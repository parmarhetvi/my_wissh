/* No edits needed here. Customize text in index.html, music path on the <audio> tag. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- glowing particles + stars (canvas) ---------- */
  var fx = $('#fx'), ctx = fx.getContext('2d'), W, H, dots = [];
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = fx.width = innerWidth * d; H = fx.height = innerHeight * d; fx.dpr = d;
  }
  function initDots() {
    dots = [];
    var n = innerWidth < 600 ? 45 : 80;
    for (var i = 0; i < n; i++) dots.push({
      x: Math.random(), y: Math.random(), r: rand(.6, 2.4), s: rand(.00008, .0003),
      t: Math.random() * 6, gold: Math.random() > .5
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(function (p) {
      p.t += .02; p.y -= p.s; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      ctx.globalAlpha = .25 + .55 * Math.abs(Math.sin(p.t));
      ctx.fillStyle = p.gold ? '#f3cf8e' : '#ffb3c6';
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * fx.dpr, 0, 6.283); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  size(); initDots();
  if (reduce) { dots.forEach(function (p) { p.s = 0; }); }
  draw();
  addEventListener('resize', function () { size(); initDots(); });

  /* ---------- floating hearts & petals ---------- */
  function floatHeart(box) {
    if (document.hidden || box.children.length > 6) return;
    var h = document.createElement('span');
    h.className = 'fh'; h.textContent = ['❤', '♥', '💗'][Math.floor(Math.random() * 3)];
    h.style.left = rand(0, 96) + '%'; h.style.fontSize = rand(14, 30) + 'px';
    h.style.animationDuration = rand(14, 22) + 's';
    h.style.setProperty('--dx', rand(-60, 60) + 'px'); h.style.setProperty('--r', rand(-40, 40) + 'deg');
    h.addEventListener('animationend', function () { h.remove(); });
    box.appendChild(h);
  }
  function petal() {
    var box = $('#petals');
    if (document.hidden || box.children.length > 5) return;
    var p = document.createElement('span');
    p.className = 'petal'; p.style.left = rand(0, 100) + '%';
    p.style.animationDuration = rand(18, 28) + 's';
    p.style.setProperty('--dx', rand(-120, 120) + 'px'); p.style.setProperty('--r', rand(180, 540) + 'deg');
    p.addEventListener('animationend', function () { p.remove(); });
    box.appendChild(p);
  }
  var introTimer = null, mainTimers = [];
  if (!reduce) introTimer = setInterval(function () { floatHeart($('#introHearts')); }, 2200);

  /* ---------- confetti ---------- */
  var cv = $('#confetti'), cx = cv.getContext('2d'), bits = [], running = false;
  function sizeC() { cv.width = innerWidth; cv.height = innerHeight; }
  sizeC(); addEventListener('resize', sizeC);
  function confetti(n, x, y) {
    if (reduce) return;
    var cols = ['#e0245e', '#f9d3dc', '#e9bd70', '#fff1f4', '#a50d3b'];
    for (var i = 0; i < n; i++) bits.push({
      x: x == null ? rand(0, cv.width) : x, y: y == null ? rand(-40, cv.height * .3) : y,
      vx: rand(-1.4, 1.4), vy: rand(1, y == null ? 4 : -9), w: rand(5, 10), h: rand(3, 6),
      a: rand(0, 6), va: rand(-.2, .2), c: cols[Math.floor(rand(0, cols.length))], life: 360
    });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter(function (b) { return b.life > 0 && b.y < cv.height + 20; });
    bits.forEach(function (b) {
      b.x += b.vx; b.y += b.vy; b.vy += .04; b.a += b.va; b.life--;
      cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a);
      cx.globalAlpha = Math.min(1, b.life / 60); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); cx.restore();
    });
    if (bits.length) requestAnimationFrame(tick); else { running = false; cx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ---------- heart burst (hug) ---------- */
  function burstHearts(el) {
    var r = el.getBoundingClientRect(), cxp = r.left + r.width / 2, cyp = r.top + r.height / 2;
    for (var i = 0; i < 12; i++) {
      var h = document.createElement('span'); h.className = 'burst';
      h.textContent = ['🤍', '❤', '💗', '♥'][i % 4];
      h.style.left = cxp + 'px'; h.style.top = cyp + 'px'; h.style.fontSize = rand(16, 34) + 'px';
      h.style.setProperty('--dx', rand(-180, 180) + 'px'); h.style.setProperty('--dy', rand(-240, 40) + 'px');
      h.style.setProperty('--r', rand(-60, 60) + 'deg');
      h.addEventListener('animationend', function (e) { e.target.remove(); });
      document.body.appendChild(h);
    }
  }

  /* ---------- open the surprise ---------- */
  var opened = false;
  $('#openBtn').addEventListener('click', function () {
    if (opened) return; opened = true; this.disabled = true;
    var intro = $('#intro'); intro.classList.add('opening');
    setTimeout(function () { confetti(26, innerWidth / 2, innerHeight / 2); }, 500);
    setTimeout(function () { intro.classList.add('leaving'); }, 900);
    setTimeout(function () {
      intro.hidden = true; clearInterval(introTimer);
      $('#main').hidden = false; document.body.classList.remove('locked');
      scrollTo(0, 0); observe();
      if (!reduce) {
        confetti(36);
        mainTimers.push(setInterval(function () { floatHeart($('#hearts')); }, 4000));
        mainTimers.push(setInterval(petal, 6000));
      }
      $('#mainHeading').focus({ preventScroll: true });
    }, 2000);
  });

  /* ---------- scroll reveal ---------- */
  function observe() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .15 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- gallery fallback if image missing ---------- */
  $$('.photo img').forEach(function (img) {
    var f = function () { img.parentNode.classList.add('noimg'); };
    img.addEventListener('error', f);
    if (img.complete && !img.naturalWidth) f();
  });

  /* ---------- cake wish ---------- */
  var cake = $('#cakeBox'), wishBtn = $('#wishBtn'), wishText = $('#wishText');
  wishBtn.addEventListener('click', function () {
    var out = cake.classList.toggle('out');
    wishBtn.setAttribute('aria-pressed', out);
    wishText.hidden = !out;
    wishBtn.textContent = out ? 'Light the candles again 🕯️' : 'Make a Wish 🎂';
    if (out) { var r = cake.getBoundingClientRect(); confetti(18, r.left + r.width / 2, r.top); }
  });

  /* ---------- final hug ---------- */
  $('#hugBtn').addEventListener('click', function () {
    burstHearts(this); $('#hugText').hidden = false; confetti(16, innerWidth / 2, innerHeight * .6);
  });

  /* ---------- music (never autoplays) ---------- */
  var audio = $('#bgm'), mbtn = $('#musicBtn'), mlabel = mbtn.querySelector('span');
  function setMusic(on) {
    mbtn.setAttribute('aria-pressed', on);
    mbtn.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
    mlabel.textContent = on ? 'Pause music' : 'Play music';
  }
  mbtn.addEventListener('click', function () {
    if (audio.paused) {
      var p = audio.play();
      if (p && p.then) p.then(function () { setMusic(true); }).catch(function () {
        mlabel.textContent = 'Add music file'; mbtn.setAttribute('aria-pressed', 'false');
      });
      else setMusic(true);
    } else { audio.pause(); setMusic(false); }
  });
  audio.addEventListener('error', function () { mlabel.textContent = 'Add music file'; });

  /* ---------- subtle cursor sparkles (desktop only) ---------- */
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    var last = 0;
    addEventListener('mousemove', function (e) {
      var now = Date.now(); if (now - last < 130) return; last = now;
      var s = document.createElement('i'); s.className = 'spark';
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.addEventListener('animationend', function () { s.remove(); });
      document.body.appendChild(s);
    });
  }
})();