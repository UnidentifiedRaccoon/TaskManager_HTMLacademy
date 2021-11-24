import { createElement } from '../utils';

const createLoadModeButtonTemplate = () => '<button class="load-more" type="button">load more</button>';
export default class LoadModeButton {
  constructor() {
    this._element = null;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createLoadModeButtonTemplate();
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
