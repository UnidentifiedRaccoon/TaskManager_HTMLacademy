const createFilterMarkup = (filter, isChecked) => {
  const { name, count } = filter;
  return `
        <input
          type="radio"
          id="filter__${name}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? 'checked' : ''}
          ${count === 0 ? 'disabled' : ''}
        />
        <label for="filter__${name}" class="filter__label">
          ${name} <span class="filter__${name}-count">${count}</span></label
        >
`;
};

const SiteFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0));
  return `

      <section class="main__filter filter container">
        ${filtersMarkup.join('\n')}
      </section>
    `;
};

export default SiteFilterTemplate;
