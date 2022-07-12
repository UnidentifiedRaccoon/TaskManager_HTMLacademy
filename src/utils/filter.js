import { FilterType } from '../const';
import { isOneDay, isOverdueDate, isRepeating } from './common';

export const getArchiveTasks = (tasks) => tasks.filter((task) => task.isArchive);

export const getNotArchiveTasks = (tasks) => tasks.filter((task) => !task.isArchive);

export const getFavoriteTasks = (tasks) => tasks.filter((task) => task.isFavorite);

export const getOverdueTasks = (tasks, date) => tasks.filter((task) => {
  const { dueDate } = task;

  if (!dueDate) {
    return false;
  }

  return isOverdueDate(dueDate, date);
});

export const getRepeatingTasks = (tasks) => tasks.filter((task) => isRepeating(task.repeatingDays));

export const getTasksInOneDay = (tasks, date) => tasks
  .filter((task) => isOneDay(task.dueDate, date));

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();
  console.log(tasks);

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
    default: return getNotArchiveTasks(tasks);
  }
};
