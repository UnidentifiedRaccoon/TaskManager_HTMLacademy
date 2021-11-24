import { createElement } from '../utils';

const createBoardTemplate = () => '<section class="board container"></section>';
export default class Board {
  constructor() {
    this._element = null;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createBoardTemplate();
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
