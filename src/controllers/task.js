import Task from '../components/Task';
import { render, replace } from '../utils/render';
import TaskEdit from '../components/TaskEdit';

export default class TaskController {
  constructor(container) {
    this.container = container;
    this.taskData = null;
    this.task = null;
    this.taskEdit = null;
  }

  render(taskData) {
    this.taskData = taskData;
    this.task = new Task(taskData);
    this.taskEdit = new TaskEdit(taskData);

    this.task.setEditBtnClickHandler(this._onEditBtnClickHandler);
    this.taskEdit.setSubmitHandler(this._onSubmitHandler);

    render(this.container.getElement(), this.task);
  }

  _onSubmitHandler(event) {
    event.preventDefault();
    this._replaceEditToTask();
  }

  _onEditBtnClickHandler(event) {
    event.preventDefault();
    this._replaceTaskToEdit();
  }

  _onEscKeyDownHandler(event) {
    event.preventDefault();
    const isEsc = event.keyCode === 27;
    if (isEsc) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    replace(this.task, this.taskEdit);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
  }

  _replaceEditToTask() {
    replace(this.taskEdit, this.task);
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }
}
