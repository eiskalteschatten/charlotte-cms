interface AccountMenuLink {
  id: string;
  label: string;
  url: string;
}

interface AccountMenuDivider {
  divider: true;
}

export type AccountMenuItem = AccountMenuLink | AccountMenuDivider;

const accountMenu: AccountMenuItem[] = [
  {
    id: 'myAccount',
    label: 'My Account',
    url: '/account/',
  },
  {
    id: 'myProfile',
    label: 'My Profile',
    url: '/account/profile/',
  },
  {
    id: 'myPosts',
    label: 'My Posts',
    url: '/account/posts/',
  },
  {
    id: 'myRatingsAndComments',
    label: 'My Ratings and Comments',
    url: '/account/ratings-comments/',
  },
  {
    divider: true,
  },
  {
    id: 'logout',
    label: 'Log Out',
    url: '/auth/logout/',
  },
];

export default accountMenu;
