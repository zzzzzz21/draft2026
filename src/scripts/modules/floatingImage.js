export default class FloatingImage {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.root = element;
    this.spacer = this.root.querySelector('.js-floating-image__spacer');
    this.image = this.root.querySelector('.js-floating-image__image');
  }

  init() {
    this.calc();
  }

  calc() {
    this.elementHeight = this.root.offsetHeight;
    this.imageHeight = this.image.clientHeight;
    const diff = this.elementHeight - this.imageHeight;
    this.spacer.style.height = `${diff}px`;
  }
}
