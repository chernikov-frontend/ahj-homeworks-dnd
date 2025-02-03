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

    _btnShow.addEventListener("click", this.onToggle.bind(this, _form, _btnShow));
    _bntHide.addEventListener("click", this.onToggle.bind(this, _form, _btnShow));
    _form.addEventListener("submit", this.onSubmit);
  }

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskText = formData.get("text").trim();

    if (!taskText) return; // Запрещаем пустые задачи

    this.save(taskText);
    e.target.reset(); // Очищаем поле ввода
  }

  onToggle(_form, _btnShow) {
    _btnShow.classList.toggle("hidden");
    _form.classList.toggle("hidden");
  }

  save(text) {
    const data = getData();
    const item = {
      id: Date.now(),
      text: text,
    };

    if (Object.hasOwn(data, this.id)) {
      item.sort = 1;
      data[this.id].unshift(item); // Добавляем в начало списка
    } else {
      item.sort = 1;
      data[this.id] = [item];
    }

    setData(data);

    // Перерисовываем список задач
    const widgetList = new WidgetList(this.container);
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
