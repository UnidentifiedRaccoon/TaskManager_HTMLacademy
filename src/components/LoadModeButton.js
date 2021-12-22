import IComponent from './AbstractClasses/IComponent';

const createLoadModeButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadModeButton extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createLoadModeButtonTemplate();
  }
}
