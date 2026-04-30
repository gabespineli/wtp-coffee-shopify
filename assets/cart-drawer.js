class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
    this.initMobileScroll();
    this.initSidebarScroll();
  }

  initMobileScroll() {
    this.addEventListener('click', (event) => {
      const leftArrow = event.target.closest('.cds__mobile-arrow--left');
      const rightArrow = event.target.closest('.cds__mobile-arrow--right');
      
      if (!leftArrow && !rightArrow) return;
      
      const scrollContainer = this.querySelector('.cds__mobile-strip-scroll');
      if (!scrollContainer) return;

      const scrollAmount = 250;

      if (leftArrow) {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else if (rightArrow) {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    this.addEventListener('scroll', (event) => {
      if (event.target.classList && event.target.classList.contains('cds__mobile-strip-scroll')) {
        this.updateMobileScrollArrows(event.target);
      }
    }, true);
  }

  initSidebarScroll() {
    this.addEventListener('click', (event) => {
      const btnUp = event.target.closest('.cds__scroll-btn--up');
      const btnDown = event.target.closest('.cds__scroll-btn--down');
      
      if (!btnUp && !btnDown) return;
      
      const list = this.querySelector('.cds__sidebar-products');
      if (!list) return;

      if (btnUp) {
        list.scrollBy({ top: -230, behavior: 'smooth' });
      } else if (btnDown) {
        list.scrollBy({ top: 230, behavior: 'smooth' });
      }
    });

    this.addEventListener('scroll', (event) => {
      if (event.target.classList && event.target.classList.contains('cds__sidebar-products')) {
        this.updateSidebarScrollArrows(event.target);
      }
    }, true);
  }

  updateSidebarScrollArrows(list) {
    if (!list) return;
    const btnUp = this.querySelector('.cds__scroll-btn--up');
    const btnDown = this.querySelector('.cds__scroll-btn--down');
    if (!btnUp || !btnDown) return;

    btnUp.classList.toggle('is-visible', list.scrollTop > 4);
    btnDown.classList.toggle('is-visible', list.scrollTop + list.clientHeight < list.scrollHeight - 4);
  }

  updateMobileScrollArrows(scrollContainer) {
    if (!scrollContainer) return;
    const leftArrow = this.querySelector('.cds__mobile-arrow--left');
    const rightArrow = this.querySelector('.cds__mobile-arrow--right');
    if (!leftArrow || !rightArrow) return;

    if (scrollContainer.scrollLeft <= 10) {
      leftArrow.classList.add('is-disabled');
    } else {
      leftArrow.classList.remove('is-disabled');
    }

    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
      rightArrow.classList.add('is-disabled');
    } else {
      rightArrow.classList.remove('is-disabled');
    }
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
      const scrollContainer = this.querySelector('.cds__mobile-strip-scroll');
      if (scrollContainer) this.updateMobileScrollArrows(scrollContainer);
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      
      // Refresh arrow visibility after content update
      const mobileScroll = this.querySelector('.cds__mobile-strip-scroll');
      if (mobileScroll) this.updateMobileScrollArrows(mobileScroll);
      
      const sidebarScroll = this.querySelector('.cds__sidebar-products');
      if (sidebarScroll) this.updateSidebarScrollArrows(sidebarScroll);

      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.cds__sidebar',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
