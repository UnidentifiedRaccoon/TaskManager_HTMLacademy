import { createElement } from '../utils';

const createTasksTemplate = () => '<div class="board__tasks"></div>';

export default class Tasks {
  constructor() {
    this._element = null;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createTasksTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element.remove();
  }
}
