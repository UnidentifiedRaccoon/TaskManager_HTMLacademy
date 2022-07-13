import { FilterType } from '../const';
import { getTasksByFilter } from '../utils/filter';

export default class Tasks {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.All;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getAllTasksData() {
    return this._tasks;
  }

  getTasksData() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  setTasksData(data) {
    this._tasks = [...data];
    this._callHandlers(this._dataChangeHandlers);
  }

  updateTask(id, updatedTaskData) {
    const index = this._tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    this._tasks = [
      ...this._tasks.slice(0, index),
      updatedTaskData,
      ...this._tasks.slice(index + 1)];
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  // eslint-disable-next-line class-methods-use-this
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
