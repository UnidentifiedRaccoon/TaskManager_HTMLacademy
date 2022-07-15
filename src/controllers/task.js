import Task from '../components/Task';
import { remove, render, replace } from '../utils/render';
import TaskEdit from '../components/TaskEdit';
import { COLOR, RenderMethods } from '../const';

export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
  ADDING: 'adding',
};

export const EmptyTask = {
  description: '',
  dueDate: null,
  repeatingDays: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this.container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this.taskData = null;
    this.task = null;
    this.taskEdit = null;
    this._mode = Mode.DEFAULT;

    this.onEditBtnClickHandler = this._onEditBtnClickHandler.bind(this);
    this.onArchiveBtnClickHandler = this._onArchiveBtnClickHandler.bind(this);
    this.onFavoritesBtnClickHandler = this._onFavoritesBtnClickHandler.bind(this);
    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._onDeleteHandler = this._onDeleteHandler.bind(this);

    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  render(taskData, mode) {
    this.taskData = taskData;
    const oldTask = this.task;
    const oldTaskEdit = this.taskEdit;
    this._mode = mode;
    this.task = new Task(taskData);
    this.taskEdit = new TaskEdit(taskData);

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTask && oldTaskEdit) {
          replace(oldTask, this.task);
          replace(oldTaskEdit, this.taskEdit);
          this._replaceEditToTask();
        } else {
          render(this.container.getElement(), this.task);
        }
        break;
      case Mode.ADDING:
        if (oldTask && oldTaskEdit) {
          remove(oldTask);
          remove(oldTaskEdit);
        }
        document.addEventListener('keydown', this._onEscKeyDownHandler);
        render(this.container, this.taskEdit, RenderMethods.PREPEND);
        break;
      default:
    }

    this.task.setEditBtnClickHandler(this.onEditBtnClickHandler);
    this.task.setArchiveBtnClickHandler(this.onArchiveBtnClickHandler);
    this.task.setFavoritesBtnClickHandler(this.onFavoritesBtnClickHandler);
    this.taskEdit.setSubmitHandler(this._onSubmitHandler);
    this.taskEdit.setDeleteButtonClickHandler(this._onDeleteHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) this._replaceEditToTask();
  }

  _onSubmitHandler() {
    const taskEditData = this.taskEdit.getData();
    const taskData = this.task.getData();
    this._onDataChange(this.taskData, { ...taskEditData, ...taskData });
    this._replaceEditToTask();
  }

  _onDeleteHandler() {
    this._onDataChange(this.taskData, null);
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this.taskData, null);
      }
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    this._mode = Mode.EDIT;
    replace(this.task, this.taskEdit);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
  }

  _replaceEditToTask() {
    this._mode = Mode.DEFAULT;
    this.taskEdit.reset();
    if (document.contains(this.taskEdit.getElement())) {
      replace(this.taskEdit, this.task);
    }
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  destroy() {
    remove(this.task);
    remove(this.taskEdit);
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }
}
