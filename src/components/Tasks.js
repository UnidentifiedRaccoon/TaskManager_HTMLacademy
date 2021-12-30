import IComponent from './AbstractClasses/IComponent';

const createTasksTemplate = () => '<div class="board__tasks"></div>';

export default class Tasks extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createTasksTemplate();
  }
}
