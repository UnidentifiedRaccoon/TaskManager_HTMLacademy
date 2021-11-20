const castTimeFormat = (value) => (value < 10 ? `0${value}` : `${value}`);

// eslint-disable-next-line import/prefer-default-export
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};
