/* ================================================================
   PORTFÓLIO PESSOAL - Guilherme Vicente Justino
   Disciplina: Fundamentos da Programação Web - UNINTER
   RU: 5469817
   Arquivo: js/script.js
   Descrição: Todas as interações do portfólio em JavaScript puro
              (sem frameworks ou bibliotecas externas)
================================================================ */

/* ----------------------------------------------------------------
   Aguarda o DOM estar completamente carregado antes de executar
   qualquer código, garantindo que os elementos existam
---------------------------------------------------------------- */
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
   2. MENU HAMBÚRGUER (navegação em dispositivos móveis)
   - Exibe/oculta o menu ao clicar no ícone
   - Fecha o menu ao clicar em qualquer link
   - Atualiza atributo aria-expanded para acessibilidade
================================================================ */
function initHamburger() {
  var btn  = document.getElementById('hamburger');
  var menu = document.getElementById('navMenu');

  if (!btn || !menu) return;

  // Abre/fecha o menu ao clicar no hambúrguer
  btn.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen)); // acessibilidade
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  var links = menu.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ================================================================
   3. SOMBRA DO NAVBAR AO ROLAR A PÁGINA
   Adiciona a classe 'scrolled' ao navbar quando o usuário
   rola mais de 10px, intensificando a sombra (via CSS)
================================================================ */
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

/* ================================================================
   4. BARRA DE PROGRESSO DE SCROLL
   Atualiza a largura da barra proporcionalmente ao quanto
   da página foi rolado (0% = topo, 100% = fim da página)
================================================================ */
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

/* ================================================================
   5. ANIMAÇÕES DE SCROLL (IntersectionObserver)
   Observa os elementos com classe 'fade-in' e adiciona
   a classe 'visible' quando eles entram na área visível da tela.
   A transição CSS cuida da animação visual.
================================================================ */
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

/* ================================================================
   6. FORMULÁRIO DE CONTATO (contato.html)
   - Validação em tempo real (ao sair do campo e ao digitar)
   - Validação completa ao submeter
   - Limpeza dos campos após envio bem-sucedido
   - Exibição de modal de confirmação
================================================================ */
function initContactForm() {
  var form          = document.getElementById('contactForm');
  var modalOverlay  = document.getElementById('modalSuccess');
  var modalClose    = document.getElementById('modalClose');

  if (!form) return;

  // ── Validação ao sair do campo (blur) ─────────────────────
  var inputs = form.querySelectorAll('.form-control');
  inputs.forEach(function (input) {
    // Valida ao sair do campo
    input.addEventListener('blur', function () {
      validateField(input);
    });
    // Remove o erro visual enquanto o usuário digita
    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        setFieldError(input, false, '');
      }
    });
  });

  // ── Validação e envio ao submeter o formulário ─────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // impede o envio real (simulação)

    var nome     = document.getElementById('nome');
    var email    = document.getElementById('email');
    var mensagem = document.getElementById('mensagem');

    // Valida todos os campos e armazena os resultados
    var nomeOk     = validateField(nome);
    var emailOk    = validateField(email);
    var mensagemOk = validateField(mensagem);

    // Só prossegue se todos os campos forem válidos
    if (nomeOk && emailOk && mensagemOk) {
      form.reset();            // limpa todos os campos do formulário
      showModal(modalOverlay); // exibe a mensagem de confirmação
    }
  });

  // ── Fechar modal ao clicar no botão ───────────────────────
  if (modalClose) {
    modalClose.addEventListener('click', function () {
      hideModal(modalOverlay);
    });
  }

  // ── Fechar modal ao clicar fora da caixa ──────────────────
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        hideModal(modalOverlay);
      }
    });
  }
}

/* ----------------------------------------------------------------
   Valida um campo individual e exibe/oculta a mensagem de erro
   Retorna true se válido, false se inválido
---------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
   Aplica ou remove o estado de erro visual em um campo
   hasError: true = exibe erro | false = remove erro
---------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
   Exibe o modal de sucesso (adiciona classe 'open')
---------------------------------------------------------------- */
function showModal(overlay) {
  if (overlay) overlay.classList.add('open');
}

/* ----------------------------------------------------------------
   Oculta o modal de sucesso (remove classe 'open')
---------------------------------------------------------------- */
function hideModal(overlay) {
  if (overlay) overlay.classList.remove('open');
}

/* ================================================================
   8. ANO ATUAL NO RODAPÉ
   Atualiza automaticamente o ano de copyright no elemento
   com id="anoAtual", presente em todas as páginas
================================================================ */
function setCurrentYear() {
  var el = document.getElementById('anoAtual');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}
