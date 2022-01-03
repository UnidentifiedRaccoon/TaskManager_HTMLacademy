import IComponent from './AbstractClasses/IComponent';
import { SortTypes } from '../const';

const createSortingTemplate = () => `   
    <div class="board__filter-list">
        <a href="#" class="board__filter" data-sort-type=${SortTypes.DEFAULT}>SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-sort-type=${SortTypes.DATE_UP}>SORT BY DATE up</a>
        <a href="#" class="board__filter" data-sort-type=${SortTypes.DATE_DOWN}>SORT BY DATE down</a>
    </div>   `;

export default class Sort extends IComponent {
  constructor() {
    super();
    this._currentSortType = SortTypes.DEFAULT;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
  }

  setSortTypeChangeHandler(handler) {
    const clickOnSortBtnHandler = (event) => {
      event.preventDefault();
      if (event.target.tagName !== 'A') return;

      const { sortType } = event.target.dataset;
      if (this.getSortType() === sortType) return;

      this.setSortType(sortType);
      handler(sortType);
    };
    this.getElement().addEventListener('click', clickOnSortBtnHandler);
  }
}
