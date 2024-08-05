import './style.css';

async function getData(location = "el eulma") {
  let url = new URL(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?unitGroup=metric&key=TH2W2JX6TVFYUSEP9AE3QTGHD&contentType=json&include=days,hours,current&elements=tempmax,tempmin,temp,conditions,datetime`
  );
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const message = "Enter a valid location";
    errorHandler(message);
    throw new Error(error.message);
  }
}

function errorHandler(message) {
  const messageContainer = document.querySelector(".message");
  messageContainer.classList.remove("hidden");
  messageContainer.textContent = message;
}

async function showHourlyTemp(data) {
  const todayData = data.days[0];
  const hourlyData = todayData.hours;
  hourlyData.forEach((hour) => {
    const time = (() => {
      let timeArray = hour.datetime.split(":");
      return timeArray[0];
    })();
    const condition = hour.conditions;
    const temp = hour.temp;

    createHourlyTempCard(time, condition, temp);
  });
}

async function showCurrentTemp(data) {
  const currentData = data.currentConditions;
  const time = (() => {
    let timeArray = currentData.datetime.split(":");
    return timeArray[0];
  })();
  const condition = currentData.conditions;
  const temp = currentData.temp;
  createCurrentTempCard(time, condition, temp);
}

function createHourlyTempCard(time, condition, temp) {
  const container = document.querySelector(".more");
  const card = document.createElement("div");
  const timeDom = document.createElement("div");
  const conditionDom = document.createElement("div");
  const tempDom = document.createElement("div");

  timeDom.textContent = time;
  conditionDom.textContent = condition;
  tempDom.textContent = temp;

  card.classList.add("card");
  timeDom.classList.add("time");
  conditionDom.classList.add("condition");
  tempDom.classList.add("temp");

  card.append(timeDom, conditionDom, tempDom);
  container.appendChild(card);
}

function createCurrentTempCard(time, condition, temp) {
  const container = document.querySelector(".current");
  const card = document.createElement("div");
  const timeDom = document.createElement("div");
  const conditionDom = document.createElement("div");
  const tempDom = document.createElement("div");

  timeDom.textContent = time;
  conditionDom.textContent = condition;
  tempDom.textContent = temp;

  card.classList.add("card");
  timeDom.classList.add("time");
  conditionDom.classList.add("condition");
  tempDom.classList.add("temp");

  card.append(timeDom, conditionDom, tempDom);
  container.appendChild(card);
}

async function showDailyTemp(data) {
  const dailyData = data.days;
  dailyData.forEach((day) => {
    const datetime = getDayValue(day.datetime);
    const condition = day.conditions;
    const minmax = `${day.tempmin} \/ ${day.tempmax}`;
    const temp = day.temp;
    createTableRow(datetime, condition, temp, minmax);
  });
}

function createTableRow(datetime, condition, temp, minmax) {
  const table = document.querySelector(".daily-temp tbody");
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const conditionCol = document.createElement("td");
  const TempCol = document.createElement("td");
  const minmaxCol = document.createElement("td");

  th.textContent = datetime;
  conditionCol.textContent = condition;
  TempCol.textContent = temp;
  minmaxCol.textContent = minmax;

  th.setAttribute("scope", "row");

  tr.append(th, conditionCol, TempCol, minmaxCol);

  table.appendChild(tr);
}
function getDayValue(datetime) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(datetime);
  let day = days[date.getDay()];
  return day;
}

async function refreshForecast(location) {
  const data = await getData(location);
  clearDom();
  showHourlyTemp(data);
  showCurrentTemp(data);
  showDailyTemp(data);
}

function clearDom() {
  const nodes = document.querySelectorAll(".card");
  nodes.forEach((node) => node.remove());

  const rows = document.querySelectorAll(".daily-temp tr");
  rows.forEach((row) => row.remove());
}

refreshForecast();

function searchByLocation(e) {
  e.preventDefault();
  let locationInput = document.querySelector("input#location");
  refreshForecast(locationInput.value);
  locationInput.value = "";
  const errorMessage = document.querySelector(".message");
  errorMessage.classList.add("hidden");
}

const searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", searchByLocation);
