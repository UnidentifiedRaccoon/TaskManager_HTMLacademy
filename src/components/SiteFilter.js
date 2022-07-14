import IComponent from './AbstractClasses/IComponent';

const FILTER_ID_PREFIX = 'filter__';

const getFilterNameById = (id) => id.substring(FILTER_ID_PREFIX.length);

const createFilterMarkup = (filter, isChecked) => {
  const { name, count } = filter;
  return ` <input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`;
};

const createSiteFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item) => createFilterMarkup(item, item.checked));
  return ` <section class="main__filter filter container">
        ${filtersMarkup.join('\n')}
      </section>`;
};

export default class SiteFilter extends IComponent {
  constructor(filters) {
    super();
    this.filters = filters;
  }

  getTemplate() {
    return createSiteFilterTemplate(this.filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener('change', (evt) => {
      evt.preventDefault();
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
