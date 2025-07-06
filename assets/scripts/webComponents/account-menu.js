let closeTimeout = null;

function clearCloseTimeout() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
}

class AccountMenu extends HTMLElement {
  connectedCallback() {
    const accountMenuButton = document.getElementById('accountMenuButton');
    accountMenuButton?.addEventListener('mouseover', this.openAccountMenu);
    accountMenuButton?.addEventListener('mouseleave', this.closeAccountMenu);

    const component = document.querySelector('account-menu');
    component?.addEventListener('mouseover', clearCloseTimeout);
    component?.addEventListener('mouseleave', this.closeAccountMenu);
  }

  openAccountMenu() {
    clearCloseTimeout();

    const component = document.querySelector('account-menu');
    const accountMenuButton = document.getElementById('accountMenuButton');
    const accountMenuButtonRect = accountMenuButton?.getBoundingClientRect();

    const accountMenuLeft = accountMenuButtonRect.left - 210;
    const accountMenuTop = accountMenuButtonRect.bottom + 5;

    component?.style.setProperty('left', accountMenuLeft + 'px');
    component?.style.setProperty('top', accountMenuTop + 'px');
    component?.classList.add('open');
  }

  closeAccountMenu() {
    clearCloseTimeout();

    closeTimeout = setTimeout(() => {
      const component = document.querySelector('account-menu');
      component?.classList.remove('open');
    }, 200);
  }
}

customElements.define('account-menu', AccountMenu);
