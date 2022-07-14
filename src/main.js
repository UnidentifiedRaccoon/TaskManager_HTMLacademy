import SiteMenu, { MenuItem } from './components/SiteMenu';

import { generateTasksData } from './mock/generateTasksData';
import { render } from './utils/render';
import Tasks from './models/tasks';
import BoardController from './controllers/board';
import Board from './components/Board';
import FilterController from './controllers/filter';
import Statistics from './components/Statistics';

// Моковые данные
const TASK_COUNT = 25;

const tasksData = generateTasksData(TASK_COUNT);
const tasksModel = new Tasks();
tasksModel.setTasksData(tasksData);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const siteMenuComponent = new SiteMenu();
render(siteHeaderElement, siteMenuComponent);
const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new Board();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new Statistics({ tasks: tasksModel, dateFrom, dateTo });
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      filterController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      filterController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      filterController.show();
      break;
    default:
  }
});
