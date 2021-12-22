import { createElement } from '../../utils';

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
}
