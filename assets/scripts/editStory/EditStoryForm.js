import { Toast } from '../lib/toast';

class EditStoryForm {
  saveStoryButton = document.getElementById('saveStoryButton');
  deleteStoryButton = document.getElementById('deleteStoryButton');
  previewStoryButton = document.getElementById('previewStoryButton');
  storyStatus = document.getElementById('status');
  storyEditor = document.getElementById('storyEditor');
  tags = [];
  postIsEdited = false;
  minStoryWordCount = 750;

  constructor() {
    this.storyStatus?.addEventListener('change', e => {
      const submissionAgreement = document.getElementById('submissionAgreementWrapper');

      if (e.target.value === 'published') {
        submissionAgreement.classList.remove('d-none');
        this.saveStoryButton.textContent = 'Publish Story';
      }
      else {
        submissionAgreement.classList.add('d-none');
        this.saveStoryButton.textContent = 'Save as Draft';
      }

      this.setPostIsEdited(true);
    });

    this.storyEditor?.addEventListener('input', () => {
      this.updateWordCount();
    });

    this.updateWordCount();

    this.saveStoryButton?.addEventListener('click', e => {
      e.preventDefault();
      this.saveStory();
    });

    this.deleteStoryButton?.addEventListener('click', e => {
      e.preventDefault();
      this.confirmDeleteStory();
    });

    const tagInput = document.getElementById('tags');
    tagInput.addEventListener('input', e => {
      this.fuzzySearchTags(e.target.value);
      this.setPostIsEdited(true);
    });

    tagInput.addEventListener('blur', () => {
      setTimeout(() => this.closeTagsAutoSuggest(), 100);
    });

    this.fetchTags();

    document.querySelectorAll('.js-input').forEach(input => {
      input.addEventListener('input', () => {
        this.setPostIsEdited(true);
      });
    });

    document.querySelectorAll('.js-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.setPostIsEdited(true);
      });
    });

    window.addEventListener('beforeunload', e => {
      if (this.postIsEdited) {
        e.preventDefault();
      }
    });
  }

  setPostIsEdited(isEdited = true) {
    this.postIsEdited = isEdited;
  }

  async fetchTags() {
    const response = await fetch('/account/stories/edit/tags');
    this.tags = await response.json();
  }

  fuzzySearchTags(value) {
    const tagsAutoSuggest = document.getElementById('tagsAutoSuggest');
    tagsAutoSuggest.innerHTML = '';

    const lastCharIsComma = value.trim().slice(-1) === ',';

    if (lastCharIsComma) {
      this.closeTagsAutoSuggest();
      return;
    }

    const tagsInput = document.getElementById('tags');
    const tagsRect = tagsInput.getBoundingClientRect();

    tagsAutoSuggest.style.top = `${tagsRect.top + tagsRect.height + window.scrollY}px`;
    tagsAutoSuggest.classList.add('open');

    const createAutoSuggestElement = (content) => {
      const tagElement = document.createElement('div');
      tagElement.textContent = content;
      tagElement.classList.add('input-auto-suggest-link');

      tagElement.addEventListener('click', e => {
        tagsInput.value = tagsInput.value.replace(lastValue, e.target.textContent);
        this.closeTagsAutoSuggest();
      });

      tagsAutoSuggest.appendChild(tagElement);
    };

    const lastValue = value.split(',').pop().trim();
    const filteredTags = this.tags.filter(tag => tag.toLowerCase().includes(lastValue.toLowerCase()));

    if (filteredTags.length === 0) {
      createAutoSuggestElement(lastValue);
    }
    else {
      for (const tag of filteredTags) {
        createAutoSuggestElement(tag);
      }
    }
  }

  closeTagsAutoSuggest() {
    const tagsAutoSuggest = document.getElementById('tagsAutoSuggest');
    tagsAutoSuggest.innerHTML = '';
    tagsAutoSuggest.classList.remove('open');
  }

  async saveStory() {
    const formIsValid = this.validateForm();

    if (!formIsValid) {
      return;
    }

    // Check for Safari
    if (this.saveStoryButton.showLoader) {
      this.saveStoryButton.showLoader();
    }

    try {
      const status = this.storyStatus.value;
      const id = document.getElementById('id').value;

      const response = await fetch('/account/stories/save', {
        method: 'post',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          id,
          title: document.getElementById('title').value,
          shortDescription: document.getElementById('shortDescription').value,
          content: this.storyEditor.value,
          tags: document.getElementById('tags').value,
          categories: this.selectedCategories,
          noteToAdmin: document.getElementById('noteToAdmin').value,
          openForComments: document.getElementById('openForComments').checked,
          openForRatings: document.getElementById('openForRatings').checked,
          isErotic: document.getElementById('isErotic').checked,
          status,
          submissionAgreement: document.getElementById('submissionAgreement').checked,
        })
      });

      const toast = new Toast();

      if (response?.ok) {
        const successMessage = status === 'published' ? 'Story published successfully.' : 'Story saved as draft.';
        toast.show(successMessage, 'success');

        this.setPostIsEdited(false);

        if (!id) {
          const story = await response.json();
          window.location.href = `/account/stories/edit/${story.id}`;
        }
        else {
          this.previewStoryButton.textContent = status === 'published' ? 'View Story' : 'Preview Story';
        }
      }
      else {
        toast.show('Failed to save story. Please try again.', 'error');
      }
    }
    catch (error) {
      const toast = new Toast();
      toast.show(error.message, 'error');
    }
    finally {
      // Check for Safari
      if (this.saveStoryButton.hideLoader) {
        this.saveStoryButton.hideLoader();
      }
    }
  }

  validateForm() {
    const form = document.getElementById('editStoryForm');
    let isValid = form.checkValidity();
    form.reportValidity();

    const wordCount = this.updateWordCount();

    if (wordCount < this.minStoryWordCount) {
      isValid = false;
      const toast = new Toast();
      toast.show(`Your story must have at least ${this.minStoryWordCount} words.`, 'error');
      return;
    }

    if (isValid && this.selectedCategories.length === 0) {
      isValid = false;
    }

    const status = document.getElementById('status').value;
    if (isValid && status === 'published') {
      isValid = document.getElementById('submissionAgreement').checked;
    }

    if (!isValid) {
      const toast = new Toast();
      toast.show('All fields are required except for those marked as optional.', 'error');
    }

    return isValid;
  }

  async confirmDeleteStory() {
    const confirmDeleteStory = confirm('Are you sure you want to delete this story? This cannot be undone.');

    if (confirmDeleteStory) {
      await this.deleteStory();
    }
  }

  async deleteStory() {
    // Check for Safari
    if (this.deleteStoryButton.showLoader) {
      this.deleteStoryButton.showLoader();
    }

    try {
      const id = document.getElementById('id').value;

      const response = await fetch(`/account/stories/delete/${id}`, {
        method: 'delete',
      });

      const toast = new Toast();

      if (response?.ok) {
        this.setPostIsEdited(false);
        window.location.href = '/account/stories/';
      }
      else {
        toast.show('Failed to delete story. Please try again.', 'error');
      }
    }
    catch (error) {
      const toast = new Toast();
      toast.show(error.message, 'error');
    }
    finally {
      // Check for Safari
      if (this.deleteStoryButton.hideLoader) {
        this.deleteStoryButton.hideLoader();
      }
    }
  }

  get selectedCategories() {
    const categoryCheckboxes = document.getElementsByName('categories');
    return Array.from(categoryCheckboxes).filter(c => c.checked).map(c => Number(c.value))
  }

  updateWordCount() {
    const wordCountDisplay = document.getElementById('wordCount');
    const text = this.storyEditor?.value.trim();
    const wordCount = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;

    wordCountDisplay.textContent = wordCount;
    return wordCount;
  }
}

new EditStoryForm();
