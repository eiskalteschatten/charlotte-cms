window.onload = () => {
  const trackingItems = document.querySelectorAll('.js-track-click-event');
  trackingItems.forEach(item => item.addEventListener('mousedown', () => trackClickEvent(item)));
};

function trackClickEvent(element, action, name) {
  const _action = action || element.dataset.trackingAction;
  const _name = name ? name : element.dataset.trackingName ? element.dataset.trackingName : element.innerText.trim();

  if (typeof _paq !== 'undefined') {
    _paq.push(['trackEvent', _action, _name]);
  }
}
