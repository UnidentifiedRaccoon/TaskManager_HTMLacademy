import flatpickr from 'flatpickr';
import { COLORS, DAYS } from '../const';
import {
  formatTime, formatDate, isRepeating, isOverdueDate,
} from '../utils/common';
import ISmartComponent from './AbstractClasses/ISmartComponent';

import 'flatpickr/dist/flatpickr.min.css';

const createColorsMarkup = (colors, currentColor) => colors.map((color, index) => `
      <input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${currentColor === color ? 'checked' : ''}
      />
      <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
        >${color}</label
      >
`).join('\n');

const createRepeatingDaysMarkup = (days, repeatingDays) => days
  .map((day, index) => {
    const isChecked = repeatingDays[day];
    return (
      `<input
          class="visually-hidden card__repeat-day-input"
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${isChecked ? 'checked' : ''}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}"
          >${day}</label
        >`
    );
  })
  .join('\n');

const createTaskEditTemplate = (task, options = {}) => {
  const { description, dueDate } = task;

  const {
    isDateShowing, isRepeatingTask, activeRepeatingDays, currentColor,
  } = options;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isSaveButtonBlocked = (isDateShowing && isRepeatingTask)
      || (isRepeatingTask && isRepeating(activeRepeatingDays));

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : '';
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : '';

  const repeatClass = isRepeatingTask ? 'card--repeat' : '';
  const deadlineClass = isExpired ? 'card--deadline' : '';

  const colorsMarkup = createColorsMarkup(COLORS, currentColor);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  return `
          <article class="card card--edit card--${currentColor} ${repeatClass} ${deadlineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? 'yes' : 'no'}</span>
                      </button>
                        ${isDateShowing ? `                      <fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>` : ''}


                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? 'yes' : 'no'}</span>
                      </button>

                      <fieldset class="card__repeat-days">
                        <div class="card__repeat-days-inner">
                        ${repeatingDaysMarkup}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                        ${colorsMarkup}
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button class="card__save" type="submit" ${isSaveButtonBlocked ? 'disabled' : ''}>save</button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>
      `;
};

const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get('date');

  return {
    description: formData.get('text'),
    color: formData.get('color'),
    dueDate: date ? new Date(date) : null,
    repeatingDays: formData.getAll('repeat').reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
  };
};

export default class TaskEdit extends ISmartComponent {
  constructor(task) {
    super();
    this.task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = { ...task.repeatingDays };
    this._currentColor = task.color;

    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._setAllListeners();
  }

  getTemplate() {
    return createTaskEditTemplate(
      this.task,
      {
        isDateShowing: this._isDateShowing,
        isRepeatingTask: this._isRepeatingTask,
        activeRepeatingDays: this._activeRepeatingDays,
        currentColor: this._currentColor,
      },
    );
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._setAllListeners();
  }

  reset() {
    this._isDateShowing = !!this.task.dueDate;
    this._isRepeatingTask = Object.values(this.task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = { ...this.task.repeatingDays };
    this._currentColor = this.task.color;
    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector('.card__date');
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this.task.dueDate || 'today',
      });
    }
  }

  getData() {
    const form = this.getElement().querySelector('.card__form');
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  setSubmitHandler(handler) {
    this.getElement()
      .querySelector('form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        handler();
      });
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector('.card__delete')
      .addEventListener('click', (event) => {
        event.preventDefault();
        handler();
      });

    this._deleteButtonClickHandler = handler;
  }

  _setAllListeners() {
    this._addDateToggleClickListener();
    this._addRepeatToggleClickListener();
    this._addRepeatingDaysChangeListener();
    this._addColorsChangeListener();
  }

  _addDateToggleClickListener() {
    this.getElement()
      .querySelector('.card__date-deadline-toggle')
      .addEventListener('click', (event) => {
        event.preventDefault();
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });
  }

  _addRepeatToggleClickListener() {
    this.getElement()
      .querySelector('.card__repeat-toggle')
      .addEventListener('click', (event) => {
        event.preventDefault();
        this._isRepeatingTask = !this._isRepeatingTask;
        this.rerender();
      });
  }

  _addRepeatingDaysChangeListener() {
    this.getElement()
      .querySelector('.card__repeat-days')
      .addEventListener('change', (event) => {
        event.preventDefault();
        this._activeRepeatingDays[event.target.value] = event.target.checked;
        this.rerender();
      });
  }

  _addColorsChangeListener() {
    this.getElement()
      .querySelector('.card__colors-wrap')
      .addEventListener('change', (event) => {
        event.preventDefault();
        this._currentColor = event.target.value;
        this.rerender();
      });
  }
}
