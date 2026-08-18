/* =========================================================
   0. Ano no rodapé
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   1. Menu mobile
========================================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('[data-link]').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   2. Link ativo no menu conforme a seção visível
========================================================= */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav__link[data-link]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(sec => navObserver.observe(sec));

/* =========================================================
   3. Revelar elementos ao rolar (scroll reveal)
========================================================= */
const revealTargets = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

/* =========================================================
   4. Chips de habilidades: entrada escalonada + status final
========================================================= */
const chiplists = document.querySelectorAll('[data-chiplist]');
const skillsStatus = document.getElementById('skillsStatus');
let totalChips = 0;
let chipsRevealed = 0;

chiplists.forEach(list => { totalChips += list.children.length; });

const chipObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const chips = entry.target.querySelectorAll('.chip');
      chips.forEach((chip, i) => {
        setTimeout(() => {
          chip.classList.add('is-visible');
          chipsRevealed++;
        }, i * 80);
      });
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

chiplists.forEach(list => chipObserver.observe(list));

/* =========================================================
   5. Terminal de boot com efeito de digitação
========================================================= */
const bootBody = document.getElementById('bootBody');

const bootLines = [
  { text: '&gt; autenticando usuário pedro.reis...', muted: false },
  { text: '&gt; status: disponível para novos desafios em cybersecurity_', muted: false },
];

function typeLine(container, html, speed = 18) {
  return new Promise(resolve => {
    // separa tags HTML do texto visível para digitar apenas o texto
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const fullText = temp.textContent;

    const line = document.createElement('div');
    line.className = 'terminal__line';
    container.appendChild(line);

    let i = 0;
    const interval = setInterval(() => {
      line.textContent = fullText.slice(0, i + 1);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runBoot() {
  if (!bootBody) return;
  for (const line of bootLines) {
    await typeLine(bootBody, line.text);
  }
  const cursor = document.createElement('span');
  cursor.className = 'terminal__cursor';
  bootBody.appendChild(cursor);
}

// só inicia quando a hero estiver visível, para não gastar ciclos escondido
const heroObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runBoot();
      obs.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

/* =========================================================
   6. Canvas de fundo: rede de nós conectados
========================================================= */
const canvas = document.getElementById('netCanvas');

if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  const NODE_COUNT_BASE = 70;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    const count = Math.min(NODE_COUNT_BASE, Math.floor((width * height) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  const accent = '33, 230, 161';
  const maxDist = 140;

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / maxDist) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = `rgba(${accent}, 0.8)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
}

/* =========================================================
   7. Botão "voltar ao topo"
========================================================= */
const toTopBtn = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  toTopBtn.classList.toggle('is-visible', window.scrollY > 480);
});

toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   8. Validação do formulário de contato + envio via mailto
========================================================= */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId).closest('.field');
  const errorEl = document.getElementById(`err-${fieldId}`);
  if (message) {
    field.classList.add('has-error');
    errorEl.textContent = message;
  } else {
    field.classList.remove('has-error');
    errorEl.textContent = '';
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  let valid = true;

  if (name.length < 2) {
    setFieldError('fname', 'Informe seu nome.');
    valid = false;
  } else {
    setFieldError('fname', '');
  }

  if (!isValidEmail(email)) {
    setFieldError('femail', 'Informe um e-mail válido.');
    valid = false;
  } else {
    setFieldError('femail', '');
  }

  if (message.length < 5) {
    setFieldError('fmsg', 'Escreva uma mensagem um pouco maior.');
    valid = false;
  } else {
    setFieldError('fmsg', '');
  }

  if (!valid) {
    formStatus.textContent = '';
    return;
  }

  const subject = encodeURIComponent(`Contato via portfólio — ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:pedro.carvalhoreis2006@gmail.com?subject=${subject}&body=${body}`;

  formStatus.textContent = '> abrindo seu cliente de e-mail...';
  form.reset();
});
