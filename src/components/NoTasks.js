import IComponent from './AbstractClasses/IComponent';

const createNoTasksTemplate = () => `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`;

export default class NoTasks extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createNoTasksTemplate();
  }
}
