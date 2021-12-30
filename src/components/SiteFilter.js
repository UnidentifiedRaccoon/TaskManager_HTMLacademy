import IComponent from './AbstractClasses/IComponent';

const createFilterMarkup = (filter, isChecked) => {
  const { title, count } = filter;
  return ` <input
      type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label
    >`;
};

const createSiteFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0));
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
}