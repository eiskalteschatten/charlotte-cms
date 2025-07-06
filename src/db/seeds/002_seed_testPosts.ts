import { QueryInterface } from 'sequelize';

export default {
  up: async (query: QueryInterface): Promise<void> => {
    await query.bulkInsert('posts', [
      {
        title: 'This is a draft post',
        content: 'I have **some boldness** as well as some *italics* and ** *bold italic* **.',
        short_description: 'Examples, examples, examples...',
        open_for_comments: true,
        open_for_ratings: true,
        status: 'draft',
        slug: 'this-is-a-draft-post',
        views: 0,
        fk_user: 1,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        title: 'This is a published posts',
        content: 'I have **some boldness** as well as some *italics* and ** *bold italic* **.',
        short_description: 'Examples, examples, examples...',
        open_for_comments: true,
        open_for_ratings: true,
        status: 'published',
        slug: 'this-is-a-published-posts',
        views: 0,
        fk_user: 2,
        published_at: new Date(),
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        title: 'Why I Use a Mac',
        content: `When I tell most people that I use a Mac as a developer they have an odd reaction. They look at Macs as being more like a toy computer rather than a machine which can get any actual work done. That is especially true when it comes to development of any sort. This is, however, an old notion that seems to be long in dying.

The reasons I use a Mac are not because I am one of Apple's "fanboys" as most people who use Macs conscientiously are assumed to be. I use one for very pragmatic reasons. The first is that I *really* dislike Windows. It is a terrible operating system which has many problems which require constant solving and I simply don't have time for that. On top of its problems, it lacks one of the key features I use everyday: a Unix terminal. Yes, there are many programs out there which will turn the Windows command prompt into a Unix-like terminal, but I've found those are generally not as reliable or as quick as a native terminal.

Now is the point where fans of Linux will ask why I don't use Linux. I have used Linux and I used to use it before I bought a Mac. If Apple were to suddenly go out of business and Macs ceased to exist, I would go back to Linux before Windows. But why don't I use Linux now? The reasons are simple. Like Windows, Linux requires constant upkeep. Unlike Windows, Linux requires far more manual maintenance. If there is a program I want to install and it requires certain libraries which I don't have installed, I have to go out and find them and install them before I can install the program I originally wanted to install. Again, I simply don't have time for that. Of course this manual maintenance is also one of Linux's key strengths. It is a ridiculously flexible operating system which can be customized for any use. I am not interesting in doing that as a web developer, however. Then there are drivers. A plethora of open source drivers for all sorts of hardware exist for Linux and you are very likely to find drivers for what you need. The problem is that a large number of them are buggy and not nearly as stable as proprietary drivers which come with other OSes. Linux is an amazing client for many devices such as servers (I use Debian) which do not have peripherals or whose hardware is not likely to change any time soon, but I just do not care for it on my own computer as it simply requires too much of my time to maintain.

So why, then, do I use a Mac? There are several reasons. Firstly, it has a native terminal because OS X is built on a Unix foundation. Secondly, it works with the hardware it comes with seamlessly which allows me to focus on my work and not on maintaining my computer so that I can work. This makes for a very stable environment which does not require much maintenance. Of course there are detriments to owning a Mac. One of the more obvious ones is that Apple likes to control everything. In reality, however, this doesn't bother me in the least. It doesn't hamper anything I wish to do on my computer and it can even be somewhat nice in that I don't have to worry thing I would have to on other platforms. One example would be buying an app from the Mac App Store. I don't have to worry about malware or problems; I can simply get an app that will do what I need without concern for my computer. As a web developer, my needs are relatively few and the Mac fulfills them better than any other platform I've tried.`,
        short_description: 'When I tell most people that I use a Mac as a developer they have an odd reaction. They look at Macs as being more like a toy computer rather than a machine which can get any actual work done. That is especially true when it comes to development of any sort. This is, however, … more &#x2192;',
        open_for_comments: true,
        open_for_ratings: true,
        status: 'published',
        slug: 'why-i-use-a-mac',
        views: 0,
        fk_user: 1,
        published_at: new Date(),
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        title: 'My Favorite Books from 2024',
        content: `With the new year ushered in over a month ago, it's time to recap my favorite books I read in 2024. This is a tradition I started in [2022](https://blog.alexseifert.com/2023/01/09/my-favorite-books-from-2022/) and continued in [2023](https://blog.alexseifert.com/2023/12/18/my-favorite-books-from-2023/) which gives me the opportunity to relive some my favorite stories.

*Note: I am not sponsored in any way and what follows is my genuine opinion.*

*Ghost Eaters* by Clay McLeod Chapman
-------------------------------------

This book was certainly one of my favorites. In fact, it was the first [book I reviewed](https://haunting.alexseifert.com/2024/08/28/ghost-eaters-by-clay-mcleod-chapman/) on my blog about ghost stories, [Haunting Alex](https://haunting.alexseifert.com), so check out that post for a much more in-depth review than here. I will warn you though, there are spoilers there.

The book covers a range of topics from drug addiction to social pressure and leaves the reader pondering about its ending. Despite the title, it isn't a classic ghost story, but it does feature ghosts in a way that leaves a haunting impression on the reader that makes him or her question whether the ghosts were real or just a metaphor. It's a brilliantly written book that engages you and I can highly recommend it.

*The Last of What I Am* by Abigail Cutter
-----------------------------------------

While *The Last of What I Am* is technically a ghost story since its protagonist is a ghost, it's not the scary type. In fact, the whole premise of the story is for the ghost, who was a Confederate soldier in the American Civil War to tell his story about his life and experiences as a soldier in the war. It is an excellent read that sets the reader in a vivid painting of the American South before, during and after the Civil War. I can highly recommend it to anyone interested in history or the American Civil War.

*The Haunting of Leigh Harker* by Darcy Coates
----------------------------------------------

This masterpiece of a ghost story by Darcy Coates is the only "real" ghost story on this list. It is a haunting tale about a woman who wakes up and finds her house haunted. The atmosphere is surreal and the twist in the plot makes the novel extremely memorable. I can't give away much more without spoiling the story, so you will just have to check it out if you are interested. Of all the ghost stories I've read recently, this is my favorite and I can only highly recommend it.

*The Invisible Life of Addie LaRue* by V.E. Schwab
--------------------------------------------------

*The Invisible Life of Addie LaRue* feels like it's destined to become a modern-day classic. The story is about a French woman who makes a deal with the darkness to live forever but loses the ability to be remembered by other people. It is compelling, complex and leads the reader to contemplate his or her own life and the decisions we all make on a daily basis. It also shows just how important social contacts are to the human experience and what can happen to someone who loses them all with no ability to make new ones.

*Carmilla* by Sheridan Le Fanu
------------------------------

*Carmilla* is the only true classic on this list. First published 1872, it was the vampire story that inspired Bram Stoker to write *Dracula*. The story isn't very long and I would call it a novelette rather than a novel, but it is still excellent and worth reading if you like vampire stories. Sheridan Le Fanu is an excellent author and, since we're already talking about him, I can also recommend his full-length gothic novel, *Uncle Silas*, which I read a few years ago.

Conclusion
----------

Well, that concludes this year's list. As usual, I did read more books than appeared here, but while many of them were good, they were not among my favorites. I can only recommend you take a look at the books on this list if you enjoy darker stories.

*What were your favorite books from 2024? Have you read any on this list? Let me know in the comments below!*`,
        short_description: 'With the new year ushered in over a month ago, it\'s time to recap my favorite books I read in 2024.',
        open_for_comments: true,
        open_for_ratings: true,
        status: 'published',
        slug: 'my-favorite-books-from-2024',
        views: 0,
        fk_user: 2,
        published_at: new Date(),
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]);
  },

  down: async (): Promise<void> => {
  },
};
