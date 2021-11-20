const FILTER_NAMES = [
  'All',
  'Overdue',
  'Today',
  'Favorites',
  'Repeating',
  'Archive',
];

const generateSiteFiltersData = () => FILTER_NAMES.map((name) => ({
  name,
  count: Math.floor(Math.random() * 10),
}));

export default generateSiteFiltersData;
