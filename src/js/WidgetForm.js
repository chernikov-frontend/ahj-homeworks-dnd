import { getData, setData } from "./functions";
import WidgetList from "./WidgetList";
export default class WidgetForm {
  constructor(container, id) {
    this.container = container;
    this.id = id;

    this.onSubmit = this.onSubmit.bind(this);
  }

  init() {
    this.container.insertAdjacentHTML("beforeend", this.markup());
    const _btnShow = this.container.querySelector(".tasks__btn-showForm");
    const _bntHide = this.container.querySelector(".tasks__btn-hide");
    const _form = this.container.querySelector(".tasks__form");

    _btnShow.addEventListener(
      "click",
      this.onToggle.bind(this, _form, _btnShow),
    );
    _bntHide.addEventListener(
      "click",
      this.onToggle.bind(this, _form, _btnShow),
    );
    _form.addEventListener("submit", this.onSubmit);
  }

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    this.save(formData);
  }

  onToggle(_form, _btnShow) {
    _btnShow.classList.toggle("hidden");
    _form.classList.toggle("hidden");
  }

  save(formData) {
    const data = getData();
    const item = {
      id: Date.now(),
      text: formData.get("text"),
    };
    const widgetList = new WidgetList(this.container);

    if (Object.hasOwn(data, this.id)) {
      item.sort = data[this.id].length + 1;
      data[this.id].push(item);
    } else {
      item.sort = 1;
      data[this.id] = [item];
    }

    setData(data);
    widgetList.init(this.id);
  }

  markup() {
    return `
      <div class="tasks__btn-showForm">
        + Добавить новую задачу
      </div>
      <form class="form tasks__form hidden">
        <div class="form__group">
          <label for="addTextTaskTodo"></label>
          <textarea class="form__textarea" id="addTextTaskTodo" name="text" placeholder="Введите текст задачи"></textarea>
        </div>
        <div class="form__group">
          <button class="form__button tasks__btn-add">Добавить задачу</button>
          <button class="form__button tasks__btn-hide" type="button" title="Убрать форму"></button>
        </div>
      </form>
    `;
  }
}
