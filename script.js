(function () {
  'use strict';

  function preencherAno() {
    var ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
  }

  function iniciarAbas() {
    var abas = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    var rotulo = document.getElementById('aba-rotulo');

    function reiniciarAnimacao(painel) {
      var tela = painel.querySelector('.tela-entrada');
      if (!tela) return;
      tela.classList.remove('tela-entrada');
      void tela.offsetWidth;
      tela.classList.add('tela-entrada');
    }

    function selecionar(aba, focar) {
      abas.forEach(function (outra) {
        var ativa = outra === aba;
        var painel = document.getElementById(outra.getAttribute('aria-controls'));
        outra.classList.toggle('ativo', ativa);
        outra.setAttribute('aria-selected', ativa ? 'true' : 'false');
        outra.tabIndex = ativa ? 0 : -1;
        painel.hidden = !ativa;
        if (ativa) {
          if (rotulo) rotulo.textContent = painel.getAttribute('data-rotulo');
          reiniciarAnimacao(painel);
        }
      });
      if (focar) aba.focus();
    }

    abas.forEach(function (aba, i) {
      aba.addEventListener('click', function () {
        selecionar(aba, false);
      });

      aba.addEventListener('keydown', function (evento) {
        var destino = {
          ArrowRight: abas[(i + 1) % abas.length],
          ArrowLeft: abas[(i - 1 + abas.length) % abas.length],
          Home: abas[0],
          End: abas[abas.length - 1]
        }[evento.key];

        if (!destino) return;
        evento.preventDefault();
        selecionar(destino, true);
      });
    });
  }

  function iniciarMenuMobile() {
    var menu = document.querySelector('details.menu-mobile');
    if (!menu) return;

    function fechar() {
      menu.removeAttribute('open');
    }

    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape' || !menu.hasAttribute('open')) return;
      fechar();
      menu.querySelector('summary').focus();
    });

    document.addEventListener('click', function (evento) {
      if (menu.hasAttribute('open') && !menu.contains(evento.target)) fechar();
    });
  }

  function iniciarRevelarAoRolar() {
    var temTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (temTimeline || reduzirMovimento || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('revelar-js');

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.revelar').forEach(function (el) {
      observador.observe(el);
    });
  }

  preencherAno();
  iniciarAbas();
  iniciarMenuMobile();
  iniciarRevelarAoRolar();
})();
