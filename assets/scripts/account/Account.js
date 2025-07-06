import { Toast } from '../lib/toast';

class Account {
  updateAccountInfoForm = document.getElementById('updateAccountInfoForm')
  saveAccountInfoButton = document.getElementById('saveAccountInfoButton')
  savePasswordButton = document.getElementById('savePasswordButton')
  updateAccountPasswordForm = document.getElementById('updateAccountPasswordForm')

  constructor() {
    this.updateAccountInfoForm?.addEventListener('submit', e => {
      e.preventDefault();
      this.saveAccountInfo();
    });

    this.updateAccountPasswordForm?.addEventListener('submit', e => {
      e.preventDefault();
      this.savePassword();
    });
  }

  async saveAccountInfo() {
    const toast = new Toast();

    const isValid = updateAccountInfoForm.checkValidity();
    updateAccountInfoForm.reportValidity();

    if (!isValid) {
      toast.show('Please fill out all required fields.', 'error');
      return;
    }

    // Check for Safari
    if (this.saveAccountInfoButton.showLoader) {
      this.saveAccountInfoButton.showLoader();
    }

    try {
      const response = await fetch('/account/info/update', {
        method: 'put',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          email: document.getElementById('email').value,
        })
      });

      if (response?.ok) {
        toast.show('Your email address has been successfully updated.', 'success');
      }
      else {
        const json = await response.json();

        if ('error' in json) {
          toast.show(json.error, 'error');
        }
        else {
          toast.show('Failed to update your email address. Please try again.', 'error');
        }
      }
    }
    catch (error) {
      toast.show(error.message, 'error');
    }
    finally {
      // Check for Safari
      if (this.saveAccountInfoButton.hideLoader) {
        this.saveAccountInfoButton.hideLoader();
      }
    }
  }

  async savePassword() {
    const toast = new Toast();

    const isValid = updateAccountPasswordForm.checkValidity();
    updateAccountPasswordForm.reportValidity();

    if (!isValid) {
      toast.show('Please fill out all required fields.', 'error');
      return;
    }

    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
      toast.show('Your new and confirmed passwords don\'t match!', 'error');
      return;
    }

    // Check for Safari
    if (this.savePasswordButton.showLoader) {
      this.savePasswordButton.showLoader();
    }

    try {
      const response = await fetch('/account/password/update', {
        method: 'put',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          newPassword: document.getElementById('newPassword').value,
          currentPassword: document.getElementById('currentPassword').value,
        })
      });

      if (response?.ok) {
        toast.show('Your password has been successfully updated.', 'success');
      }
      else {
        const json = await response.json();

        if ('error' in json) {
          toast.show(json.error, 'error');
        }
        else {
          toast.show('Failed to update your password. Please try again.', 'error');
        }
      }
    }
    catch (error) {
      toast.show(error.message, 'error');
    }
    finally {
      // Check for Safari
      if (this.savePasswordButton.hideLoader) {
        this.savePasswordButton.hideLoader();
      }
    }
  }
}

new Account();
