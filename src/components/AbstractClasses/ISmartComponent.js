import IComponent from './IComponent';

export default class ISmartComponent extends IComponent {
  // eslint-disable-next-line class-methods-use-this
  recoveryListeners() {
    throw new Error('Abstract method not implemented: recoveryListeners');
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    oldElement.replaceWith(newElement);
    this.recoveryListeners();
  }
}
