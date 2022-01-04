import IComponent from './AbstractClasses/IComponent';

const createTasksListTemplate = () => '<div class="board__tasks"></div>';

export default class TasksList extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createTasksListTemplate();
  }
}
