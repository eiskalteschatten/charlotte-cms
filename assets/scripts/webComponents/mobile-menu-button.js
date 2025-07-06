class MobileMenuButton extends HTMLElement {
  mobileMenuId = 'mobileMenu';
  mobileMenuOpenClass = 'open';

  connectedCallback() {
    this.innerHTML = '<span class="material-icons">menu</span>';
    this.onclick = this.openMenu;
  }

  openMenu() {
    const mobileMenu = document.getElementById(this.mobileMenuId);

    if (mobileMenu) {
      mobileMenu.classList.add(this.mobileMenuOpenClass);
      document.body.classList.add('mobile-menu-open');
    }
  }
}

customElements.define('mobile-menu-button', MobileMenuButton);
