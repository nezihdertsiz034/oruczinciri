/**
 * Şükür365 – Tek sayfalık site: mobil menü ve erişilebilirlik
 */

(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navLinks = document.querySelectorAll('.nav-mobile a, .nav a');

  if (!menuToggle || !navMobile) return;

  function openMenu() {
    navMobile.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Menüyü kapat');
  }

  function closeMenu() {
    navMobile.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menüyü aç');
  }

  function toggleMenu() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  }

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // ESC ile menüyü kapat
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMobile && !navMobile.hidden) {
      closeMenu();
    }
  });
})();
