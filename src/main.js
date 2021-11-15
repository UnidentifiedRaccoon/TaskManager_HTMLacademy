import SiteMenuTemplate from './components/SiteMenuTemplate';
import SiteFilterTemplate from './components/SiteFilterTemplate';
import BoardTemplate from './components/BoardTemplate';
import EditTemplate from './components/EditTemplate';
import TaskTemplate from './components/TaskTemplate';
import LoadModeButtonTemplate from './components/LoadModeButtonTemplate';

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, SiteMenuTemplate());
render(siteMainElement, SiteFilterTemplate());
render(siteMainElement, BoardTemplate());

const taskListElement = siteMainElement.querySelector('.board__tasks');
const boardElement = siteMainElement.querySelector('.board');

render(taskListElement, EditTemplate());

const TASK_COUNT = 3;
for (let i = 0; i < TASK_COUNT; i += 1) {
  render(taskListElement, TaskTemplate());
}

render(boardElement, LoadModeButtonTemplate());
