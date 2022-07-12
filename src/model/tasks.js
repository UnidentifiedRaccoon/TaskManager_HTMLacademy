export default class Tasks {
  constructor() {
    this._tasks = [];
    this._dataChangeHandlers = [];
  }

  getTasksData() {
    return this._tasks;
  }

  setTasksData(data) {
    this._tasks = [...data];
    this._callHandlers(this._dataChangeHandlers);
  }

  update(id, updatedTaskData) {
    const index = this._tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    this._tasks = [this._tasks.slice(0, index), updatedTaskData, this._tasks.slice(index + 1)];
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  // eslint-disable-next-line class-methods-use-this
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
