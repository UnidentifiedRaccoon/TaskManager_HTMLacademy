import Task from '../components/Task';
import TaskEdit from '../components/TaskEdit';
import { render, replace } from '../utils/render';

export default class TaskController {
  constructor(container) {
    this._container = container;
    this._task = null;
    this._taskEdit = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._task = new Task(task);
    this._taskEdit = new TaskEdit(task);

    const editBtnClickHandler = (event) => {
      event.preventDefault();
      this._replaceTaskToEdit();
    };

    const submitEditedTaskHandler = (event) => {
      event.preventDefault();
      this._replaceEditToTask();
    };

    this._task.setEditBtnClickHandler(editBtnClickHandler);
    this._taskEdit.setSubmitHandler(submitEditedTaskHandler);

    render(this._container, this._task);
  }

  _replaceEditToTask() {
    replace(this._taskEdit, this._task);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    replace(this._task, this._taskEdit);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(event) {
    event.preventDefault();
    const isEsc = event.keyCode === 27;
    if (isEsc) this._replaceEditToTask();
  }
}
