import { remove, render } from '../utils/render';
import NoTasks from '../components/NoTasks';
import Sort from '../components/Sort';
import TasksList from '../components/TasksList';
import LoadModeButton from '../components/LoadModeButton';
import { SortTypes } from '../const';
import TaskController from './task';

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTask = (container, taskData, onDataChange, onViewChange) => {
  const taskController = new TaskController(container, onDataChange, onViewChange);
  taskController.render(taskData);
  return taskController;
};

const renderTasks = (
  container,
  tasksDataSlice,
  onDataChange,
  onViewChange,
) => tasksDataSlice.map((taskData) => renderTask(
  container,
  taskData,
  onDataChange,
  onViewChange,
));

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
    this.tasksData = [];
    this._renderedTaskControllers = [];

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();

    this._tasksListComponent = new TasksList();
    this._loadMoreButtonComponent = new LoadModeButton();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._loadMoreHandler = this._loadMoreHandler.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
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
    this._renderTaskControllers(0, this._showingTaskCount);
    this._renderLoadMoreButton();
  }

  _sortTypeChangeHandler() {
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
    this._tasksListComponent.getElement().innerHTML = '';
    this._renderTaskControllers(0, this._showingTaskCount);
    this._renderLoadMoreButton();
  }

  _loadMoreHandler() {
    const prevTaskCount = this._showingTaskCount;
    this._showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
    if (this._showingTaskCount >= this.tasksData.length) {
      this._showingTaskCount = this.tasksData.length;
      remove(this._loadMoreButtonComponent);
    }
    this._renderTaskControllers(prevTaskCount, this._showingTaskCount);
  }

  _renderLoadMoreButton() {
    render(this._container.getElement(), this._loadMoreButtonComponent);
    // Отобразить карточки по нажатию на кнопку
    this._loadMoreButtonComponent.setClickHandler(this._loadMoreHandler);
  }

  _renderTaskControllers(from, to) {
    const sortedTasksData = getSortTasksData(this.tasksData, this._sortComponent.getSortType());
    const newRenderedControllers = renderTasks(
      this._tasksListComponent,
      sortedTasksData.slice(from, to),
      this._onDataChange,
      this._onViewChange,
    );
    this._renderedTaskControllers = this._renderedTaskControllers.concat(newRenderedControllers);
  }

  _onDataChange(oldData, newData) {
    const index = this.tasksData.findIndex((data) => data === oldData);
    if (index === -1) return;

    this.tasksData = [
      ...this.tasksData.slice(0, index),
      newData,
      ...this.tasksData.slice(index + 1),
    ];
    const taskController = this._renderedTaskControllers[index];
    taskController.render(newData);
  }

  _onViewChange() {
    this._renderedTaskControllers.forEach((taskController) => taskController.setDefaultView());
  }
}
