import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface): Promise<void> => {
    const tags = [
      {
        tag: 'Microsoft',
        slug: 'microsoft',
      },
      {
        tag: 'Apple',
        slug: 'apple',
      },
      {
        tag: 'macOS',
        slug: 'macos',
      },
      {
        tag: 'Windows',
        slug: 'windows',
      },
      {
        tag: 'Linux',
        slug: 'linux',
      },
    ];

    await query.bulkInsert('story_tags', tags.map(tag => ({
      ...tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    const allTags: any = await query.sequelize.query('SELECT id FROM story_tags', { type: 'SELECT' });
    const stories: any = await query.sequelize.query('SELECT id FROM stories', { type: 'SELECT' });

    const getRandomSubsetOfTags = () => {
      // Step 1: Shuffle the array using Fisher-Yates algorithm
      for (let i = allTags.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allTags[i], allTags[j]] = [allTags[j], allTags[i]];
      }

      // Step 2: Generate a random length for the subset
      const randomLength = Math.floor(Math.random() * allTags.length) + 1;

      // Step 3: Select the first randomLength elements from the shuffled array
      return allTags.slice(0, randomLength);
    };

    for (const story of stories) {
      const randomTags = getRandomSubsetOfTags();
      await query.bulkInsert('story_tag_mapper', randomTags.map((tag: any) => ({
        fk_story: story.id,
        fk_story_tag: tag.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })));
    }
  },

  down: async (): Promise<void> => {
  },
};
