import { remove, render } from '../utils/render';
import NoTasks from '../components/NoTasks';
import Sort from '../components/Sort';
import Tasks from '../components/Tasks';
import LoadModeButton from '../components/LoadModeButton';
import { SortTypes } from '../const';
import TaskController from './task';

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTasks = (taskListElement, tasksData, from, to) => tasksData.slice(from, to)
  .map((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
    return taskController;
  });

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
    this._tasksData = [];
    this._renderedTaskControllers = [];
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._tasksListElement = this._tasksComponent.getElement();
    this._loadMoreButtonComponent = new LoadModeButton();

    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _addRenderedTaskControllers(taskController) {
    this._renderedTaskControllers = this._renderedTaskControllers.concat(taskController);
  }

  _onSortTypeChange() {
    const sortedTasksData = getSortTasksData(this._tasksData, this._sortComponent.getSortType());
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
    this._tasksComponent.getElement().innerHTML = '';

    // const sortedTasksDataSlice = sortedTasksData.slice()
    const newRenderedTaskControllers = renderTasks(
      this._tasksListElement,
      sortedTasksData,
      0,
      this._showingTaskCount,
    );
    this._addRenderedTaskControllers(newRenderedTaskControllers);

    this._renderLoadMoreButton();
  }

  _onLoadMoreBtnClick() {
    const sortedTasksData = getSortTasksData(this._tasksData, this._sortComponent.getSortType());
    const prevTaskCount = this._showingTaskCount;
    this._showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
    if (this._showingTaskCount >= sortedTasksData.length) {
      this._showingTaskCount = sortedTasksData.length;
      remove(this._loadMoreButtonComponent);
    }

    // const sortedTasksDataSlice = sortedTasksData.slice(prevTaskCount, this._showingTaskCount);
    const newRenderedTaskControllers = renderTasks(
      this._tasksListElement,
      sortedTasksData,
      prevTaskCount,
      this._showingTaskCount,
    );
    this._addRenderedTaskControllers(newRenderedTaskControllers);
  }

  _renderLoadMoreButton() {
    if (this._showingTaskCount >= this._tasksData.length) return;
    render(this._container.getElement(), this._loadMoreButtonComponent);

    // Отобразить карточки по нажатию на кнопку
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreBtnClick);
  }

  render(tasksData) {
    this._tasksData = tasksData;
    const container = this._container.getElement();

    const isAllTasksArchived = tasksData.every((task) => task.isArchive);
    if (tasksData.length === 0 || isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);
    // const tasksDataSlice = tasksData.slice(0, this._showingTaskCount)
    const newRenderedTaskControllers = renderTasks(
      this._tasksListElement,
      tasksData,
      0,
      this._showingTaskCount,
    );
    this._addRenderedTaskControllers(newRenderedTaskControllers);
    this._renderLoadMoreButton();
  }
}
