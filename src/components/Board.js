import IComponent from './AbstractClasses/IComponent';

const createBoardTemplate = () => '<section class="board container"></section>';

export default class Board extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createBoardTemplate();
  }
}
