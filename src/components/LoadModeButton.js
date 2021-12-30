import IComponent from './AbstractClasses/IComponent';

const createLoadModeButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadModeButton extends IComponent {
  constructor() {
    super();
    this._savedClickHandler = null;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createLoadModeButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().removeEventListener('click', this._savedClickHandler);
    this.getElement().addEventListener('click', handler);
    this._savedClickHandler = handler;
  }
}
