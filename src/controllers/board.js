import Task from '../components/Task';
import TaskEdit from '../components/TaskEdit';
import { remove, render, replace } from '../utils/render';
import NoTasks from '../components/NoTasks';
import Sorting from '../components/Sorting';
import Tasks from '../components/Tasks';
import LoadModeButton from '../components/LoadModeButton';

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTask = (taskListElement, taskData) => {
  const taskComponent = new Task(taskData);
  const taskEditComponent = new TaskEdit(taskData);

  const escKeyDownHandler = (event) => {
    event.preventDefault();
    const isEsc = event.keyCode === 27;
    if (isEsc) {
      replace(taskEditComponent, taskComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  const editBtnClickHandler = (event) => {
    event.preventDefault();
    replace(taskComponent, taskEditComponent);
    document.addEventListener('keydown', escKeyDownHandler);
  };

  const submitEditedTaskHandler = (event) => {
    event.preventDefault();
    replace(taskEditComponent, taskComponent);
    document.removeEventListener('keydown', escKeyDownHandler);
  };

  taskComponent.setEditBtnClickHandler(editBtnClickHandler);
  taskEditComponent.setSubmitHandler(submitEditedTaskHandler);

  render(taskListElement, taskComponent);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasks = new NoTasks();
    this._sorting = new Sorting();
    this._tasks = new Tasks();
    this._loadMoreButton = new LoadModeButton();
  }

  render(tasksData) {
    const container = this._container.getElement();

    const isAllTasksArchived = tasksData.every((task) => task.isArchive);
    if (tasksData.length === 0 || isAllTasksArchived) {
      console.log(true);
      render(container, this._noTasks);
      return;
    }

    render(container, this._sorting);
    render(container, this._tasks);
    const taskListElement = container.querySelector('.board__tasks');
    // Отобразить первые N карточек
    let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    for (let i = 0; i < showingTaskCount; i += 1) {
      renderTask(taskListElement, tasksData[i]);
    }

    // Отобразить кнопку загрузки новых карточек
    render(container, this._loadMoreButton);

    // Отобразить еще N карточек по нажатию на кнопку
    const loadMoreHandler = (event) => {
      event.preventDefault();
      const prevTaskCount = showingTaskCount;
      showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
      if (showingTaskCount >= tasksData.length) {
        showingTaskCount = tasksData.length;
        remove(this._loadMoreButton);
      }
      for (let i = prevTaskCount; i < showingTaskCount; i += 1) {
        renderTask(taskListElement, tasksData[i]);
      }
    };
    this._loadMoreButton.setClickHandler(loadMoreHandler);
  }
}
