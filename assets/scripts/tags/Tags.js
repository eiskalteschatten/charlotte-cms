class Tags {
  tagSearchForm = document.getElementById('tagSearchForm');
  tagSearchField = document.getElementById('tagSearchField');

  constructor() {
    this.tagSearchForm.addEventListener('submit', e => {
      e.preventDefault();
      this.submitSearchForm();
    });
  }

  submitSearchForm() {
    window.location.href = `/tags/${this.tagSearchField.value}/`;
  }
}

new Tags();
