import SiteMenu from './components/SiteMenu';
import SiteFilter from './components/SiteFilter';
import Board from './components/Board';
import Sorting from './components/Sorting';
import Task from './components/Task';
import TaskEdit from './components/TaskEdit';
import Tasks from './components/Tasks';
import LoadModeButton from './components/LoadModeButton';

import { generateSiteFiltersData } from './mock/generateSiteFiltersData';
import { generateTasksData } from './mock/generateTasksData';
import { render } from './utils';

// Моковые данные
const TASK_COUNT = 22;

const SHOWING_TASKS_COUNT_ON_START = 4;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const renderTask = (taskListElement, taskData) => {
  const taskElement = new Task(taskData).getElement();
  const taskEditElement = new TaskEdit(taskData).getElement();

  const editBtnClickHandler = (event) => {
    event.preventDefault();
    taskElement.replaceWith(taskEditElement);
  };

  const submitEditedTaskHandler = (event) => {
    event.preventDefault();
    taskEditElement.replaceWith(taskElement);
  };

  const editBtn = taskElement.querySelector('.card__btn--edit');
  editBtn.addEventListener('click', editBtnClickHandler);

  const editForm = taskEditElement.querySelector('form');
  editForm.addEventListener('submit', submitEditedTaskHandler);

  render(taskListElement, taskElement);
};

const renderBoard = (siteMainElement, tasksData) => {
  const boardElement = new Board().getElement();
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

  render(siteMainElement, boardElement);
};

const tasksData = generateTasksData(TASK_COUNT);
const filtersData = generateSiteFiltersData(tasksData);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, (new SiteMenu()).getElement());
render(siteMainElement, new SiteFilter(filtersData).getElement());

renderBoard(siteMainElement, tasksData);
