export class Toast {
  closeTimeout;
  toast = document.getElementById('toast');
  toastContent = document.getElementById('toastContent');

  constructor() {
    const toastCloseButton = document.getElementById('toastCloseButton');
    toastCloseButton?.addEventListener('click', () => this.close());
  }

  show(message, type) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }

    this.resetClasses();
    this.toastContent.innerHTML = message;

    if (type) {
      this.toast.classList.add(type);
    }

    this.toast.classList.add('show');
    this.closeTimeout = setTimeout(() => this.close(), 5000);
  }

  close() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }

    this.toast.classList.remove('show');

    setTimeout(() => {
      this.toastContent.innerHTML = '';
      this.resetClasses();
    }, 1000);
  }

  resetClasses() {
    this.toast.classList.remove('success');
    this.toast.classList.remove('error');
  }
}
