// Without JavaScript, all sections stay visible and the links act as anchors.
(() => {
  const navigationLinks = [...document.querySelectorAll('[data-view]')];
  const views = [...document.querySelectorAll('.view')];

  if (!views.length) return;

  function showView(focusHeading = false) {
    const requestedView = window.location.hash.slice(1);
    const activeView = views.find(view => view.id === requestedView) || views[0];

    views.forEach(view => {
      view.hidden = view !== activeView;
    });

    navigationLinks.forEach(link => {
      if (link.dataset.view === activeView.id) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (focusHeading) {
      activeView.querySelector('h2').focus({ preventScroll: true });
    }
  }

  navigationLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();

      if (window.location.hash !== link.hash) {
        history.pushState(null, '', link.hash);
      }

      showView(true);
    });
  });

  window.addEventListener('popstate', () => showView());
  window.addEventListener('hashchange', () => showView());
  showView();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
