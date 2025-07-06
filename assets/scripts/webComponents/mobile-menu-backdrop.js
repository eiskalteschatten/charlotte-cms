class MobileMenuBackdrop extends HTMLElement {
  mobileMenuId = 'mobileMenu';
  mobileMenuOpenClass = 'open';

  connectedCallback() {
    this.onclick = this.closeMenu;
  }

  closeMenu() {
    const mobileMenu = document.getElementById(this.mobileMenuId);

    if (mobileMenu) {
      mobileMenu.classList.remove(this.mobileMenuOpenClass);
      document.body.classList.remove('mobile-menu-open');
    }
  }
}

customElements.define('mobile-menu-backdrop', MobileMenuBackdrop);
