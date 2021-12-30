import { RenderMethods } from '../const';

export const createElement = (template) => {
  // Превращение шаблона в DOM элемент с помощью insertAdjacentHTML
  const div = document.createElement('div');
  div.innerHTML = template.trim();
  return div.firstChild;
};

export const render = (container, component, method = RenderMethods.APPEND) => {
  switch (method) {
    case RenderMethods.PREPEND:
      container.prepend(component.getElement());
      break;
    case RenderMethods.APPEND:
      container.append(component.getElement());
      break;
    default:
  }
};

export const replace = (oldComponent, newComponent) => {
  if (newComponent && oldComponent) {
    oldComponent.getElement().replaceWith(newComponent.getElement());
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
