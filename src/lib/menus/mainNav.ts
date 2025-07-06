export interface MainNavItem {
  id: string;
  label: string;
  url: string;
}

const mainNav: MainNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    url: '/',
  },
  {
    id: 'browse',
    label: 'Browse Posts',
    url: '/posts/',
  },
  {
    id: 'categories',
    label: 'Categories',
    url: '/categories/',
  },
  {
    id: 'tags',
    label: 'Tags',
    url: '/tags/',
  },
  {
    id: 'about',
    label: 'About',
    url: '/about/',
  },
  {
    id: 'beta',
    label: 'Beta',
    url: '/beta/',
  },
];

export default mainNav;
