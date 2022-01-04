import { remove, render } from '../utils/render';
import NoTasks from '../components/NoTasks';
import Sort from '../components/Sort';
import TasksList from '../components/TasksList';
import LoadModeButton from '../components/LoadModeButton';
import { SortTypes } from '../const';
import TaskController from './task';

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTask = (container, taskData) => {
  const taskController = new TaskController(container);
  taskController.render(taskData);
};

const renderTasks = (container, tasksDataSlice) => {
  tasksDataSlice.forEach((taskData) => {
    renderTask(container, taskData);
  });
};

const getSortTasksData = (tasksData, sortType) => {
  let sortedTasksData;
  const tasksDataCopy = tasksData.slice();

  switch (sortType) {
    case SortTypes.DATE_DOWN:
      sortedTasksData = tasksDataCopy.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortTypes.DATE_UP:
      sortedTasksData = tasksDataCopy.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortTypes.DEFAULT:
      sortedTasksData = tasksDataCopy;
      break;
    default:
      sortedTasksData = tasksDataCopy;
  }
  return sortedTasksData;
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
    this.tasksData = null;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();

    this._tasksListComponent = new TasksList();
    this._loadMoreButtonComponent = new LoadModeButton();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._loadMoreHandler = this._loadMoreHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  render(tasksData) {
    this.tasksData = tasksData;

    const isAllTasksArchived = tasksData.every((task) => task.isArchive);
    if (tasksData.length === 0 || isAllTasksArchived) {
      render(this._container.getElement(), this._noTasksComponent);
      return;
    }

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), this._tasksListComponent);
    const tasksDataSlice = tasksData.slice(0, this._showingTaskCount);
    renderTasks(this._tasksListComponent, tasksDataSlice);
    this._renderLoadMoreButton();
  }

  _sortTypeChangeHandler() {
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
    this._tasksListComponent.getElement().innerHTML = '';
    const sortedTasksData = getSortTasksData(this.tasksData, this._sortComponent.getSortType());
    const sortedTasksDataSlice = sortedTasksData.slice(0, this._showingTaskCount);
    renderTasks(this._tasksListComponent, sortedTasksDataSlice);
    this._renderLoadMoreButton();
  }

  _loadMoreHandler() {
    const sortedTasksData = getSortTasksData(this.tasksData, this._sortComponent.getSortType());
    const prevTaskCount = this._showingTaskCount;
    this._showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
    if (this._showingTaskCount >= sortedTasksData.length) {
      this._showingTaskCount = sortedTasksData.length;
      remove(this._loadMoreButtonComponent);
    }
    const sortedTasksDataSlice = sortedTasksData.slice(prevTaskCount, this._showingTaskCount);
    renderTasks(this._tasksListComponent, sortedTasksDataSlice);
  }

  _renderLoadMoreButton() {
    render(this._container.getElement(), this._loadMoreButtonComponent);

    // Отобразить карточки по нажатию на кнопку
    this._loadMoreButtonComponent.setClickHandler(this._loadMoreHandler);
  }
}
