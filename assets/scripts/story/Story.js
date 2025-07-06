import { Toast } from '../lib/toast';

class Story {
  storyElement = document.getElementById('story');
  ratingStars = document.querySelectorAll('.rating-star');
  storyRatingStars = document.getElementById('storyRatingStars');

  constructor() {
    this.addViewToStory();
    const userLoggedIn = this.storyRatingStars.dataset.loggedIn === 'true';

    if (userLoggedIn) {
      this.ratingStars.forEach(star => {
        star.addEventListener('click', async () => {
          const rating = star.dataset.rating;
          await this.addRatingToStory(rating);
        });

        star.addEventListener('mouseenter', () => this.mouseOverRatingStar(star.dataset.rating));
      });

      this.storyRatingStars.addEventListener('mouseleave', () => this.mouseOutRatingStar());
    }
  }

  async addViewToStory() {
    await fetch(`/stories/views/update`, {
      method: 'put',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        storyId: Number(this.storyElement.dataset.id),
      })
    });
  }

  async addRatingToStory(rating) {
    const toast = new Toast();

    try {
      const response = await fetch(`/stories/ratings/add`, {
        method: 'post',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          rating: Number(rating),
          storyId: Number(this.storyElement.dataset.id),
        })
      });

      if (!response.ok) {
        throw new Error('An error occurred while submitting your rating. Please try again later.');
      }

      const { averageRating } = await response.json();

      const storyAverageRatingStat = document.getElementById('storyAverageRatingStat');
      storyAverageRatingStat.textContent = averageRating;

      this.ratingStars.forEach(star => {
        const rating = Number(star.dataset.rating) - 0.5;
        if (rating <= averageRating) {
          star.classList.add('filled');
        }
        else {
          star.classList.remove('filled');
        }
      });

      toast.show('Thank you for submitting your rating!.', 'success');
    }
    catch (error) {
      toast.show(error, 'error');
    }
  }

  mouseOverRatingStar(rating) {
    this.ratingStars.forEach(star => {
      if (star.dataset.rating <= rating) {
        star.classList.add('hover');
      }
      else {
        star.classList.remove('hover');
      }
    });
  }

  mouseOutRatingStar() {
    this.ratingStars.forEach(star => {
      star.classList.remove('hover');
    });
  }
}

new Story();
