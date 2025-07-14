export default class NavigationCurrent {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.root = element;
    this.links = this.root.querySelectorAll('a');
    this.currentUrlPath = window.location.pathname;
  }

  init() {
    this.links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === this.currentUrlPath || href === this.currentUrlPath + '/') {
        link.classList.add('is-current');
      } else {
        link.classList.remove('is-current');
      }
    });
  }
}
