class ThemeSwitcherButton extends HTMLElement {
  activeClass = 'active';

  connectedCallback() {
    this.onclick = this.handleClick;

    const theme = document.documentElement.getAttribute('tf-theme');

    if (theme === this.getAttribute('data-theme')) {
      this.classList.add(this.activeClass);
    }
  }

  handleClick() {
    const theme = this.getAttribute('data-theme');
    document.documentElement.setAttribute('tf-theme', theme);
    localStorage.setItem('theme', theme);

    const buttons = document.querySelectorAll('theme-switcher-button');
    buttons.forEach((button) => button.classList.remove(this.activeClass));
    this.classList.add(this.activeClass);
  }
}

customElements.define('theme-switcher-button', ThemeSwitcherButton);
