import { createElement } from '../../utils/render';

const HIDDEN_CLASS = 'visually-hidden';

export default class IComponent {
  constructor() {
    if (new.target === IComponent) {
      throw new Error('Creating direct instances of IComponent class is not allowed');
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method is not implemented: ${this.getTemplate.name}`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
