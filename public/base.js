const menu = htmx.find('#menu');

const toggleMenu = () => {
  menu.classList.toggle("hidden");
  menu.classList.toggle("w-full");
  menu.classList.toggle("h-screen");
};

htmx.replaceClass = (elt, oldClass, newClass) => {
  htmx.addClass(elt, newClass);
  htmx.removeClass(elt, oldClass);
};

const handleResponse = ({ detail }) => {
  const targetSelector = detail.xhr.getResponseHeader("HX-Retarget");
  
  if (targetSelector) {
    const targetElement = htmx.find(targetSelector);
    detail.shouldSwap = !Boolean(targetElement.nextSibling);

    targetElement
      .addEventListener(
        "input",
        () => htmx.remove(targetElement.nextSibling),
        { once: true }
      );
  }
};
