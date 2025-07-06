class LoaderButton extends HTMLButtonElement {
  connectedCallback() {
    this.innerHTML += `
      <loader-spinner always-light="true"></loader-spinner>
    `;
  }

  showLoader() {
    this.disabled = true;
    this.classList.add('loading');

    const spinner = this.querySelector('loader-spinner');
    spinner?.classList.add('show');
  }

  hideLoader() {
    this.disabled = false;
    this.classList.remove('loading');

    const spinner = this.querySelector('loader-spinner');
    spinner?.classList.remove('show');
  }
}

customElements.define('loader-button', LoaderButton, { extends: 'button' });
