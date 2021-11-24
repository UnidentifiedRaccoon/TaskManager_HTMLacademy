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
import { render } from './utils';

// Моковые данные
const TASK_COUNT = 10;

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTask = (taskListElement, taskData) => {
  const taskElement = new Task(taskData).getElement();
  const taskEditElement = new TaskEdit(taskData).getElement();

  const escKeyDownHandler = (event) => {
    event.preventDefault();
    const isEsc = event.keyCode === 27;
    if (isEsc) {
      taskEditElement.replaceWith(taskElement);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  const editBtnClickHandler = (event) => {
    event.preventDefault();
    taskElement.replaceWith(taskEditElement);
    document.addEventListener('keydown', escKeyDownHandler);
  };

  const submitEditedTaskHandler = (event) => {
    event.preventDefault();
    taskEditElement.replaceWith(taskElement);
    document.removeEventListener('keydown', escKeyDownHandler);
  };

  const editBtn = taskElement.querySelector('.card__btn--edit');
  editBtn.addEventListener('click', editBtnClickHandler);

  const editForm = taskEditElement.querySelector('form');
  editForm.addEventListener('submit', submitEditedTaskHandler);

  render(taskListElement, taskElement);
};

const renderBoard = (siteMainElement, tasksData) => {
  const boardElement = new Board().getElement();
  render(siteMainElement, boardElement);

  const isAllTasksArchived = tasksData.every((task) => task.isArchive);
  if (tasksData.length === 0 || isAllTasksArchived) {
    console.log(true);
    render(boardElement, new NoTasks().getElement());
    return;
  }

  render(boardElement, (new Sorting()).getElement());
  render(boardElement, (new Tasks()).getElement());
  const taskListElement = boardElement.querySelector('.board__tasks');
  // Отобразить первые N карточек
  let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

  for (let i = 0; i < showingTaskCount; i += 1) {
    renderTask(taskListElement, tasksData[i]);
  }

  const loadMoreButtonElement = new LoadModeButton().getElement();
  render(boardElement, loadMoreButtonElement);

  // Отобразить еще N карточек по нажатию на кнопку
  loadMoreButtonElement.addEventListener('click', (event) => {
    event.preventDefault();
    const prevTaskCount = showingTaskCount;
    showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
    if (showingTaskCount >= tasksData.length) {
      showingTaskCount = tasksData.length;
      loadMoreButtonElement.remove();
    }
    for (let i = prevTaskCount; i < showingTaskCount; i += 1) {
      renderTask(taskListElement, tasksData[i]);
    }
  });
};

const tasksData = generateTasksData(TASK_COUNT);
const filtersData = generateSiteFiltersData(tasksData);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, (new SiteMenu()).getElement());
render(siteMainElement, new SiteFilter(filtersData).getElement());

renderBoard(siteMainElement, tasksData);
