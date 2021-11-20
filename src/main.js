import generateSiteFiltersData from './mock/generateSiteFiltersData';

import { generateTasksData } from './mock/generateTasksData';
import SiteMenuTemplate from './components/SiteMenuTemplate';
import SiteFilterTemplate from './components/SiteFilterTemplate';
import BoardTemplate from './components/BoardTemplate';
import TaskEditTemplate from './components/TaskEditTemplate';
import TaskTemplate from './components/TaskTemplate';
import LoadModeButtonTemplate from './components/LoadModeButtonTemplate';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 3;
const SHOWING_TASKS_COUNT_ON_BUTTON_CLICK = 4;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

// Моковые данные
const filtersData = generateSiteFiltersData();
const tasksData = generateTasksData(TASK_COUNT);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, SiteMenuTemplate());
render(siteMainElement, SiteFilterTemplate(filtersData));
render(siteMainElement, BoardTemplate());

const taskListElement = siteMainElement.querySelector('.board__tasks');
const boardElement = siteMainElement.querySelector('.board');

render(taskListElement, TaskEditTemplate(tasksData[0]));

// Отобразить первые N карточек
let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;
for (let i = 1; i < showingTaskCount; i += 1) {
  render(taskListElement, TaskTemplate(tasksData[i]));
}

render(boardElement, LoadModeButtonTemplate());

// Отобразить еще N карточек по нажатию на кнопку
const loadMoreButtonElement = boardElement.querySelector('.load-more');
loadMoreButtonElement.addEventListener('click', (event) => {
  event.preventDefault();
  const prevTaskCount = showingTaskCount;
  showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON_CLICK;
  if (showingTaskCount >= tasksData.length) {
    showingTaskCount = tasksData.length;
    loadMoreButtonElement.remove();
    console.log('loadMoreButtonElement was removed');
  }
  for (let i = prevTaskCount; i < showingTaskCount; i += 1) {
    render(taskListElement, TaskTemplate(tasksData[i]));
  }
});
