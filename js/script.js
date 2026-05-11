/* ================================================================
   PORTFÓLIO PESSOAL - Guilherme Vicente Justino
   Disciplina: Fundamentos da Programação Web - UNINTER
   RU: 5469817
   Arquivo: js/script.js
================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Funcionalidades presentes em TODAS as páginas ──────────
  initHamburger();       // Menu mobile (hambúrguer)
  initNavbarScroll();    // Sombra no navbar ao rolar
  initScrollProgress();  // Barra de progresso de leitura
  initScrollAnimations();// Animações de entrada por scroll
  setCurrentYear();      // Ano automático no rodapé

  // ── Funcionalidades específicas de cada página ─────────────
  if (document.getElementById('contactForm'))  initContactForm();

});

/* ================================================================
MENU HAMBÚRGUER (navegação em dispositivos móveis)
================================================================ */
function initHamburger() {
  var btn  = document.getElementById('hamburger');
  var menu = document.getElementById('navMenu');

  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen)); // acessibilidade
  });

  var links = menu.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* SOMBRA DO NAVBAR AO ROLAR A PÁGINA */
function initNavbarScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    // toggle: adiciona ou remove a classe conforme a posição
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* BARRA DE PROGRESSO DE SCROLL */
function initScrollProgress() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var percent    = (docHeight > 0) ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  });
}

/* ANIMAÇÕES DE SCROLL */
function initScrollAnimations() {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // ativa a animação
          observer.unobserve(entry.target);      // anima somente uma vez
        }
      });
    },
    { threshold: 0.12 } // aciona quando 12% do elemento está visível
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* FORMULÁRIO DE CONTATO*/
function initContactForm() {
  var form          = document.getElementById('contactForm');
  var modalOverlay  = document.getElementById('modalSuccess');
  var modalClose    = document.getElementById('modalClose');

  if (!form) return;

 
  var inputs = form.querySelectorAll('.form-control');
  inputs.forEach(function (input) {

    input.addEventListener('blur', function () {
      validateField(input);
    });

    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        setFieldError(input, false, '');
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // impede o envio real (simulação)

    var nome     = document.getElementById('nome');
    var email    = document.getElementById('email');
    var mensagem = document.getElementById('mensagem');

    var nomeOk     = validateField(nome);
    var emailOk    = validateField(email);
    var mensagemOk = validateField(mensagem);

    if (nomeOk && emailOk && mensagemOk) {
      form.reset();            // limpa todos os campos do formulário
      showModal(modalOverlay); // exibe a mensagem de confirmação
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', function () {
      hideModal(modalOverlay);
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        hideModal(modalOverlay);
      }
    });
  }
}

function validateField(input) {
  var value   = input.value.trim();
  var isValid = true;
  var message = '';

  if (input.id === 'nome') {
    // Nome deve ter ao menos 3 caracteres
    isValid = value.length >= 3;
    message = 'Por favor, informe seu nome completo (mín. 3 caracteres).';
  }

  if (input.id === 'email') {
    // Regex para validar formato básico de e-mail (usuario@dominio.extensao)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
    message = 'Informe um e-mail válido (ex: usuario@dominio.com).';
  }

  if (input.id === 'mensagem') {
    // Mensagem deve ter ao menos 10 caracteres
    isValid = value.length >= 10;
    message = 'A mensagem deve ter pelo menos 10 caracteres.';
  }

  setFieldError(input, !isValid, isValid ? '' : message);
  return isValid;
}

function setFieldError(input, hasError, message) {
  var errorEl = document.getElementById(input.id + 'Error');

  if (hasError) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  } else {
    input.classList.remove('error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }
}

/* Exibe o modal de sucesso */
function showModal(overlay) {
  if (overlay) overlay.classList.add('open');
}

function hideModal(overlay) {
  if (overlay) overlay.classList.remove('open');
}

/* ANO ATUAL NO RODAPÉ*/
function setCurrentYear() {
  var el = document.getElementById('anoAtual');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}
