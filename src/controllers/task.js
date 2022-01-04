import Task from '../components/Task';
import { render, replace } from '../utils/render';
import TaskEdit from '../components/TaskEdit';

export default class TaskController {
  constructor(container, onDataChange) {
    this.container = container;
    this._onDataChange = onDataChange;
    this.taskData = null;
    this.task = null;
    this.taskEdit = null;

    this._onEditBtnClickHandler = this._onEditBtnClickHandler.bind(this);
    this._onArchiveBtnClickHandler = this._onArchiveBtnClickHandler.bind(this);
    this._onFavoritesBtnClickHandler = this._onFavoritesBtnClickHandler.bind(this);
    this._onSubmitHandler = this._onSubmitHandler.bind(this);

    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  render(taskData) {
    this.taskData = taskData;
    const oldTask = this.task;
    const oldTaskEdit = this.taskEdit;
    this.task = new Task(taskData);
    this.taskEdit = new TaskEdit(taskData);

    if (oldTask && oldTaskEdit) {
      replace(oldTask, this.task);
      replace(oldTaskEdit, this.taskEdit);
    } else {
      render(this.container.getElement(), this.task);
    }

    this.task.setEditBtnClickHandler(this._onEditBtnClickHandler);
    this.task.setArchiveBtnClickHandler(this._onArchiveBtnClickHandler);
    this.task.setFavoritesBtnClickHandler(this._onFavoritesBtnClickHandler);
    this.taskEdit.setSubmitHandler(this._onSubmitHandler);
  }

  _onSubmitHandler() {
    this._replaceEditToTask();
  }

  _onEditBtnClickHandler() {
    this._replaceTaskToEdit();
  }

  _onArchiveBtnClickHandler() {
    this._onDataChange(this.taskData, { ...this.taskData, isArchive: !this.task.isArchive });
  }

  _onFavoritesBtnClickHandler() {
    this._onDataChange(this.taskData, { ...this.taskData, isFavorite: !this.task.isFavorite });
  }

  _onEscKeyDownHandler(event) {
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
