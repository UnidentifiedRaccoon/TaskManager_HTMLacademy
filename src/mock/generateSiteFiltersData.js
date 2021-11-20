import { FILTER_TITLES } from '../const';

const filterValues = {
  All: 0,
  Overdue: 0,
  Today: 0,
  Favorites: 0,
  Repeating: 0,
  Archive: 0,
};

const updateFilterValues = (tasksData) => {
  tasksData.forEach((item) => {
    const {
      dueDate, repeatingDays, isFavorite, isArchive,
    } = item;
    const withDate = !!dueDate;
    const isExpired = withDate && dueDate < Date.now();
    const isToday = withDate && dueDate.getDate() === (new Date()).getDate();
    const isRepeating = Object.values(repeatingDays).some(Boolean);

    filterValues.All += 1;
    filterValues.Overdue += isExpired ? 1 : 0;
    filterValues.Today += isToday ? 1 : 0;
    filterValues.Repeating += isRepeating ? 1 : 0;
    filterValues.Favorites += isFavorite ? 1 : 0;
    filterValues.Archive += isArchive ? 1 : 0;
  });
};

const generateSiteFiltersData = (tasksData) => {
  updateFilterValues(tasksData);
  return FILTER_TITLES.map((title) => ({
    title,
    count: filterValues[title],
  }));
};

export default generateSiteFiltersData;
