import WidgetList from "./WidgetList";

const _tasksBlock = document.querySelectorAll(".tasks__block");

_tasksBlock.forEach((_container) => {
  const id = _container.dataset.id;
  const title = _container.querySelector(".tasks__block-title")?.textContent.trim();
  const widgetList = new WidgetList(_container, title);
  widgetList.init(id);
});
