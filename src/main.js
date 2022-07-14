import SiteMenu, { MenuItem } from './components/SiteMenu';

import { generateTasksData } from './mock/generateTasksData';
import { render } from './utils/render';
import Tasks from './models/tasks';
import BoardController from './controllers/board';
import Board from './components/Board';
import FilterController from './controllers/filter';

// Моковые данные
const TASK_COUNT = 10;

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

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
    default:
  }
});
