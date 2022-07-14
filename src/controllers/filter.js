import { FilterType } from '../const';
import { getTasksByFilter } from '../utils/filter';
import SiteFilter from '../components/SiteFilter';
import { render, replace } from '../utils/render';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterChangeInModel = this._onFilterChangeInModel.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChangeInModel);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getAllTasksData();
    const filters = Object.values(FilterType).map((filterType) => ({
      name: filterType,
      count: getTasksByFilter(allTasks, filterType).length,
      checked: filterType === this._activeFilterType,
    }));
    const oldComponent = this._filterComponent;

    this._filterComponent = new SiteFilter(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(oldComponent, this._filterComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    if (this._tasksModel.getIsTaskCreatingRun()) {
      this._tasksModel.setFilter(FilterType.ALL);
    } else {
      this._tasksModel.setFilter(filterType);
    }
  }

  _onFilterChangeInModel() {
    this._activeFilterType = this._tasksModel.getActiveFilter();
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
