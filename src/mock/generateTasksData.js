import { COLORS } from '../const';

const defaultRepeatingDays = {
  mo: false,
  tu: false,
  wu: false,
  th: false,
  fr: false,
  sa: false,
  su: false,
};

const DescriptionItems = [
  'Изучить теорию',
  'Дописать конспект',
  'Выполнить лабораторную работу по ооооооочень длиииииинному предмету',
];

const getRandomIntegerNumber = (min, max) => min + Math.floor(Math.random() * (max - min));

const getRandomArrayItem = (arr) => {
  const randomIndex = getRandomIntegerNumber(0, arr.length);
  return arr[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateRepeatingDays = () => ({
  ...defaultRepeatingDays,
  ...{
    mo: Math.random() > 0.5,
    fr: Math.random() > 0.5,
  },
});

const generateTaskData = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();
  return {
    description: getRandomArrayItem(DescriptionItems),
    color: getRandomArrayItem(COLORS),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDays : generateRepeatingDays(),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateTasksData = (count) => new Array(count)
  .fill('')
  .map(generateTaskData);

export { generateTaskData, generateTasksData };
