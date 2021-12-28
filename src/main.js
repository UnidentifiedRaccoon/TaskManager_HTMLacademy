import SiteMenu from './components/SiteMenu';
import SiteFilter from './components/SiteFilter';
import Board from './components/Board';
import Sorting from './components/Sorting';
import Task from './components/Task';
import TaskEdit from './components/TaskEdit';
import Tasks from './components/Tasks';
import NoTasks from './components/NoTasks';
import LoadModeButton from './components/LoadModeButton';

import { generateSiteFiltersData } from './mock/generateSiteFiltersData';
import { generateTasksData } from './mock/generateTasksData';
import { remove, render, replace } from './utils/render';

// Моковые данные
const TASK_COUNT = 10;

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

const renderBoard = (siteMainElement, tasksData) => {
  const boardComponent = new Board();
  render(siteMainElement, boardComponent);

  const isAllTasksArchived = tasksData.every((task) => task.isArchive);
  if (tasksData.length === 0 || isAllTasksArchived) {
    console.log(true);
    render(boardComponent.getElement(), new NoTasks());
    return;
  }

  render(boardComponent.getElement(), new Sorting());
  render(boardComponent.getElement(), new Tasks());
  const taskListElement = boardComponent.getElement().querySelector('.board__tasks');
  // Отобразить первые N карточек
  let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

  for (let i = 0; i < showingTaskCount; i += 1) {
    renderTask(taskListElement, tasksData[i]);
  }

  // Отобразить кнопку загрузки новых карточек
  const loadMoreButtonComponent = new LoadModeButton();
  render(boardComponent.getElement(), loadMoreButtonComponent);

  // Отобразить еще N карточек по нажатию на кнопку
  const loadMoreHandler = (event) => {
    event.preventDefault();
    const prevTaskCount = showingTaskCount;
    showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
    if (showingTaskCount >= tasksData.length) {
      showingTaskCount = tasksData.length;
      remove(loadMoreButtonComponent);
    }
    for (let i = prevTaskCount; i < showingTaskCount; i += 1) {
      renderTask(taskListElement, tasksData[i]);
    }
  };
  loadMoreButtonComponent.setClickHandler(loadMoreHandler);
};

const tasksData = generateTasksData(TASK_COUNT);
const filtersData = generateSiteFiltersData(tasksData);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, new SiteMenu());
render(siteMainElement, new SiteFilter(filtersData));

renderBoard(siteMainElement, tasksData);
