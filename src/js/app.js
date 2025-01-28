import WidgetList from "./WidgetList";

const _tasksBlock = document.querySelectorAll(".tasks__block");

_tasksBlock.forEach((_container) => {
  const id = _container.dataset.id;
  const widgetList = new WidgetList(_container);
  widgetList.init(id);
});
