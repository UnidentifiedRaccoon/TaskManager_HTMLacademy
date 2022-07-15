import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const formatTime = (date) => moment(date).format('hh:mm');

export const formatDate = (date) => moment(date).format('DD MMMM');

export const isRepeating = (repeatingDays) => Object.values(repeatingDays).some(Boolean);

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, 'days') === 0 && dateA.getDate() === dateB.getDate();
};

export const isOverdueDate = (dueDate, date) => dueDate < date && !isOneDay(date, dueDate);
