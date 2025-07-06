import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface): Promise<void> => {
    await query.bulkInsert('users', [
      {
        email: 'alex@alexseifert.com',
        username: 'alex',
        // This password is Test123$
        password: '$2a$12$c77H9TKQNwq29VfhWTGFuuCkTw4OUkNqKjo8nHdAaxqyxmjCDPPly',
        status: 'active',
        role: 'super_admin',
        bio: 'I am the creator of Charlotte CMS.',
        links: JSON.stringify({
          website: 'https://www.alexseifert.com',
          twitter: 'https://www.twitter.com',
          instagram: 'https://www.instagram.com',
          facebook: 'https://www.facebook.com',
          mastodon: 'https://www.mastodon.social',
          bluesky: 'https://bsky.app',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'liz@alexseifert.com',
        username: 'liz',
        // This password is Test123$
        password: '$2a$12$c77H9TKQNwq29VfhWTGFuuCkTw4OUkNqKjo8nHdAaxqyxmjCDPPly',
        status: 'unverified',
        role: 'author',
        bio: 'I\'m another person.',
        links: JSON.stringify({
          website: 'https://alexseifert.com',
          twitter: 'https://www.twitter.com',
          instagram: 'https://www.instagram.com',
          facebook: 'https://www.facebook.com',
          mastodon: 'https://www.mastodon.social',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'charlotte@alexseifert.com',
        username: 'charlotte',
        // This password is Test123$
        password: '$2a$12$c77H9TKQNwq29VfhWTGFuuCkTw4OUkNqKjo8nHdAaxqyxmjCDPPly',
        status: 'disabled',
        role: 'moderator',
        bio: 'I was disabled.',
        links: JSON.stringify({
          website: 'https://alexseifert.com',
          twitter: 'https://www.twitter.com',
          instagram: 'https://www.instagram.com',
          facebook: 'https://www.facebook.com',
          mastodon: 'https://www.mastodon.social',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (): Promise<void> => {
  },
};
