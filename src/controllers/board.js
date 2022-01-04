import Task from '../components/Task';
import TaskEdit from '../components/TaskEdit';
import { remove, render, replace } from '../utils/render';
import NoTasks from '../components/NoTasks';
import Sort from '../components/Sort';
import Tasks from '../components/Tasks';
import LoadModeButton from '../components/LoadModeButton';
import { SortTypes } from '../const';

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

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._loadMoreButtonComponent = new LoadModeButton();
  }

  render(tasksData) {
    const container = this._container.getElement();
    const taskListElement = this._tasksComponent.getElement();
    let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    const renderTasks = (tasksDataSlice) => {
      tasksDataSlice.forEach((task) => {
        renderTask(taskListElement, task);
      });
    };

    const renderLoadMoreButton = () => {
      render(container, this._loadMoreButtonComponent);

      // Отобразить карточки по нажатию на кнопку
      const loadMoreHandler = () => {
        const sortedTasksData = getSortTasksData(tasksData, this._sortComponent.getSortType());
        const prevTaskCount = showingTaskCount;
        showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
        if (showingTaskCount >= sortedTasksData.length) {
          showingTaskCount = sortedTasksData.length;
          remove(this._loadMoreButtonComponent);
        }
        renderTasks(sortedTasksData.slice(prevTaskCount, showingTaskCount));
      };
      this._loadMoreButtonComponent.setClickHandler(loadMoreHandler);
    };

    const isAllTasksArchived = tasksData.every((task) => task.isArchive);
    if (tasksData.length === 0 || isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);
    renderTasks(tasksData.slice(0, showingTaskCount));
    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler(() => {
      const sortedTasksData = getSortTasksData(tasksData, this._sortComponent.getSortType());
      showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
      taskListElement.innerHTML = '';
      renderTasks(sortedTasksData.slice(0, showingTaskCount));
      renderLoadMoreButton();
    });
  }
}
