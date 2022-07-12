import SiteMenu from './components/SiteMenu';
import SiteFilter from './components/SiteFilter';

import { generateSiteFiltersData } from './mock/generateSiteFiltersData';
import { generateTasksData } from './mock/generateTasksData';
import { render } from './utils/render';
import TasksModel from './models/tasks';
import BoardController from './controllers/board';
import Board from './components/Board';

// Моковые данные
const TASK_COUNT = 10;

const tasksData = generateTasksData(TASK_COUNT);
const tasksModel = new TasksModel().setTasksData(tasksData);
const filtersData = generateSiteFiltersData(tasksData);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, new SiteMenu());
render(siteMainElement, new SiteFilter(filtersData));

const boardComponent = new Board();
const boardController = new BoardController(boardComponent, tasksModel);
render(siteMainElement, boardComponent);
boardController.render();
