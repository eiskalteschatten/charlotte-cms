import { Toast } from '../lib/toast';

class MyProfile {
  updateMyProfileForm = document.getElementById('updateMyProfileForm')
  saveMyProfileButton = document.getElementById('saveMyProfileButton')

  constructor() {
    this.updateMyProfileForm?.addEventListener('submit', e => {
      e.preventDefault();
      this.saveMyProfile();
    });
  }

  async saveMyProfile() {
    const toast = new Toast();

    const isValid = updateMyProfileForm.checkValidity();
    updateMyProfileForm.reportValidity();

    if (!isValid) {
      toast.show('Please fill out all required fields.', 'error');
      return;
    }

    // Check for Safari
    if (this.saveMyProfileButton.showLoader) {
      this.saveMyProfileButton.showLoader();
    }

    try {
      const response = await fetch('/account/profile/update', {
        method: 'put',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          bio: document.getElementById('bio').value,
          website: document.getElementById('website').value,
          twitter: document.getElementById('twitter').value,
          instagram: document.getElementById('instagram').value,
          facebook: document.getElementById('facebook').value,
          mastodon: document.getElementById('mastodon').value,
          bluesky: document.getElementById('bluesky').value,
        })
      });

      if (response?.ok) {
        toast.show('Your profile has been successfully updated.', 'success');
      }
      else {
        const json = await response.json();

        if ('error' in json) {
          toast.show(json.error, 'error');
        }
        else {
          toast.show('Failed to update your profile. Please try again.', 'error');
        }
      }
    }
    catch (error) {
      toast.show(error.message, 'error');
    }
    finally {
      // Check for Safari
      if (this.saveMyProfileButton.hideLoader) {
        this.saveMyProfileButton.hideLoader();
      }
    }
  }
}

new MyProfile();
