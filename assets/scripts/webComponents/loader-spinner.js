class LoaderSpinner extends HTMLElement {
  connectedCallback() {
    const alwaysLight = this.getAttribute('always-light');
    const circleClasses = alwaysLight ? 'spinner-path always-light' : 'spinner-path';

    this.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="${circleClasses}" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    `;
  }
}

customElements.define('loader-spinner', LoaderSpinner);
