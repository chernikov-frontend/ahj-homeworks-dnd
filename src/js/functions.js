export function getData(id = "") {
  let data = localStorage.getItem("data");

  if (!data) return {};

  data = JSON.parse(data);

  if (id) {
    if (Object.hasOwn(data, id)) {
      return data[id];
    } else {
      return [];
    }
  } else {
    return data;
  }
}
export function setData(data) {
  for (let key in data) {
    data[key].sort((a, b) => a.sort - b.sort);
  }

  localStorage.setItem("data", JSON.stringify(data));
}
