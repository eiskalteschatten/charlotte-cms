import { Toast } from '../lib/toast';

class Post {
  postElement = document.getElementById('post');
  ratingStars = document.querySelectorAll('.rating-star');
  postRatingStars = document.getElementById('postRatingStars');

  constructor() {
    this.addViewToPost();
    const userLoggedIn = this.postRatingStars.dataset.loggedIn === 'true';

    if (userLoggedIn) {
      this.ratingStars.forEach(star => {
        star.addEventListener('click', async () => {
          const rating = star.dataset.rating;
          await this.addRatingToPost(rating);
        });

        star.addEventListener('mouseenter', () => this.mouseOverRatingStar(star.dataset.rating));
      });

      this.postRatingStars.addEventListener('mouseleave', () => this.mouseOutRatingStar());
    }
  }

  async addViewToPost() {
    await fetch(`/posts/views/update`, {
      method: 'put',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        postId: Number(this.postElement.dataset.id),
      })
    });
  }

  async addRatingToPost(rating) {
    const toast = new Toast();

    try {
      const response = await fetch(`/posts/ratings/add`, {
        method: 'post',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          rating: Number(rating),
          postId: Number(this.postElement.dataset.id),
        })
      });

      if (!response.ok) {
        throw new Error('An error occurred while submitting your rating. Please try again later.');
      }

      const { averageRating } = await response.json();

      const postAverageRatingStat = document.getElementById('postAverageRatingStat');
      postAverageRatingStat.textContent = averageRating;

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

new Post();
