import { RenderMethods } from './const';

const castTimeFormat = (value) => (value < 10 ? `0${value}` : `${value}`);

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const createElement = (template) => {
  // Превращение шаблона в DOM элемент с помощью insertAdjacentHTML
  const div = document.createElement('div');
  div.innerHTML = template.trim();
  return div.firstChild;
};

export const render = (container, element, method = RenderMethods.APPEND) => {
  // console.log('Контейнер');
  // console.log(container);
  // console.log('Содержимое - элемент');
  // console.log(element);

  switch (method) {
    case RenderMethods.PREPEND:
      container.prepend(element);
      break;
    case RenderMethods.APPEND:
      container.append(element);
      break;
    default:
      console.log('Ошибка вставки метода render');
  }
};
