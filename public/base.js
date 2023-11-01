htmx.onLoad(() => {
  globalThis.menu = htmx.find('#menu');

  globalThis.toggleMenu = () => {
    menu.classList.toggle("hidden");
    menu.classList.toggle("w-full");
    menu.classList.toggle("h-screen");
  };

  htmx.replaceClass = (elt, oldClass, newClass) => {
    htmx.addClass(elt, newClass);
    htmx.removeClass(elt, oldClass);
  };

  globalThis.handleResponse = ({ detail }) => {
    const targetSelector = detail.xhr.getResponseHeader("HX-Retarget");

    if (targetSelector) {
      const targetElement = htmx.find(targetSelector);
      detail.shouldSwap = targetElement.nextSibling == null;
      targetElement 
        .addEventListener(
          "input",
          () => htmx.remove(targetElement.nextSibling),
          { once: true }
        );
    }
  };
});
