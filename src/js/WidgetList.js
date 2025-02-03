import WidgetForm from "./WidgetForm";
import { getData, setData } from "./functions";

export default class WidgetList {
  constructor(container, title) {
    this.container = container;
    this.parentId = null;
    this._targetItem = null;
    this._elementTmp = null;
    this.title = title;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  init(id) {
    this.parentId = id;
    this.container.innerHTML = "";

    const titleElement = document.createElement("h3");
    titleElement.classList.add("tasks__block-title");
    titleElement.textContent = this.title;

    const data = getData(id);

    const _element = this.render(data);

    const widgetForm = new WidgetForm(this.container, id);

    this.container.append(titleElement, _element);

    widgetForm.init();

    this._tasksList = this.container.querySelector(".tasks__list");

    this._tasksList.addEventListener("mousedown", this.onMouseDown);

    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("tasks__btn-remove")) {
        const taskItem = e.target.closest(".tasks__item");
        if (taskItem) {
          this.removeItem(taskItem);
        }
      }
    });
  }

  onMouseDown(e) {
    e.preventDefault();

    const targetItem = e.target.closest(".tasks__item");

    if (!targetItem || e.target.classList.contains("tasks__btn-remove")) return;

    this._targetItem = targetItem;
    this._targetItem.classList.add("tasks__dragged");

    this._tasksList.style.cursor = "grabbing";
    this._targetItem.style.width = `${this._tasksList.offsetWidth}px`;

    this._elementTmp = document.createElement("div");
    this._elementTmp.classList.add("tasks__tmp");
    this._elementTmp.style.height = `${this._targetItem.offsetHeight}px`;

    this._targetItem.after(this._elementTmp);

    document.documentElement.addEventListener("mousemove", this.onMouseMove);
    document.documentElement.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseMove(e) {
    if (!this._targetItem) return;

    this._targetItem.style.position = "absolute";
    this._targetItem.style.top = `${e.clientY}px`;
    this._targetItem.style.left = `${e.clientX}px`;

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) return;

    const closestItem = elementBelow.closest(".tasks__item");
    const closestList = elementBelow.closest(".tasks__list");

    if (closestItem && closestItem !== this._targetItem) {
      const rect = closestItem.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;

      if (e.clientY < middleY) {
        closestItem.before(this._elementTmp);
      } else {
        closestItem.after(this._elementTmp);
      }

    } else if (closestList && !closestList.querySelector(".tasks__item")) {
      closestList.append(this._elementTmp);
    }
  }

  onMouseUp() {
    if (!this._targetItem) return;

    this._elementTmp.replaceWith(this._targetItem);

    this._tasksList.style.cursor = "default";
    this._targetItem.classList.remove("tasks__dragged");
    this._targetItem.style = "";

    this._targetItem = null;
    this._elementTmp = null;

    this.setData();

    document.documentElement.removeEventListener("mousemove", this.onMouseMove);
    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
  }

  removeItem(_item) {
    if (confirm("Удалить задачу?")) {
      const taskId = _item.dataset.id;
      const data = getData(this.parentId);

      const newData = data.filter((task) => task.id !== taskId);

      const allData = getData();
      allData[this.parentId] = newData;

      setData(allData);
      _item.remove();
    }
  }

  setData() {
    const data = {};
    const tasks = document.querySelectorAll(".tasks__block");

    tasks.forEach((tasksList) => {
      data[tasksList.dataset.id] = [];
      const tasksItems = tasksList.querySelectorAll(".tasks__item");
      tasksItems.forEach((item, index) => {
        data[tasksList.dataset.id].push({
          id: item.dataset.id,
          text: item.querySelector(".tasks__item-text").innerText,
          sort: index + 1,
        });
      });
    });

    setData(data);
  }

  render(data) {
    const _list = document.createElement("div");
    _list.classList.add("tasks__list");

    if (data.length > 0) {
      data.forEach((item) => {
        _list.insertAdjacentHTML("beforeend", this.markupElement(item));
      });
    }

    return _list;
  }

  markupElement(item) {
    return `
      <div class="tasks__item" data-id="${item.id}">
        <div class="tasks__btn-remove"></div>
        <div class="tasks__item-text">${item.text}</div>
      </div>
    `;
  }
}
