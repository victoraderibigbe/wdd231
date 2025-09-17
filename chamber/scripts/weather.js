const currentWeather = document.querySelector("#currentWeather");
const weatherForecast = document.querySelector("#weatherForecast");

const weatherUrl =
  "https://api.openweathermap.org/data/2.5/weather?lat=16.780751867378907&lon=-3.011886804832405&unit=imperial&appid=bf2fc5388248f6e4827dd643c43faf58";

const forecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast?lat=16.780751867378907&lon=-3.011886804832405&unit=imperial&appid=bf2fc5388248f6e4827dd643c43faf58";

const fetchCurrentWeather = async () => {
  try {
    const response = await fetch(weatherUrl);

    if (response.ok) {
      const data = await response.json();
      displayCurrentWeather(data);
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchWeatherForecast = async () => {
  try {
    const response = await fetch(forecastUrl);

    if (response.ok) {
      const data = await response.json();
      displayWeatherForecast(data);
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    console.error(error);
  }
};

const displayCurrentWeather = (data) => {
  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container");

  const iconImg = document.createElement("img");
  iconImg.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  iconImg.alt = data.weather[0].description;
  iconImg.width = 80;
  iconContainer.appendChild(iconImg);
  currentWeather.appendChild(iconContainer);

  const dataContainer = document.createElement("div");
  dataContainer.classList.add("data-container");

  const temperature = document.createElement("p");
  temperature.innerHTML = `${data.main.temp}&deg;F`;
  dataContainer.appendChild(temperature);
  currentWeather.appendChild(dataContainer);

  const description = document.createElement("p");
  description.innerHTML = data.weather[0].description;
  dataContainer.appendChild(description);
  currentWeather.appendChild(dataContainer);

  const temperatureHigh = document.createElement("p");
  temperatureHigh.innerHTML = `High: ${data.main.temp_max}&deg;F`;
  dataContainer.appendChild(temperatureHigh);
  currentWeather.appendChild(dataContainer);

  const temperatureLow = document.createElement("p");
  temperatureLow.innerHTML = `Low: ${data.main.temp_min}&deg;F`;
  dataContainer.appendChild(temperatureLow);
  currentWeather.appendChild(dataContainer);

  const humidity = document.createElement("p");
  humidity.innerHTML = `Humidity: ${data.main.humidity}`;
  dataContainer.appendChild(humidity);
  currentWeather.appendChild(dataContainer);

  const sunrise = document.createElement("p");
  sunrise.innerHTML = `Sunrise: ${formatTimeForTimezone(
    data.sys.sunrise,
    data.timeZone
  )}`;
  dataContainer.appendChild(sunrise);
  currentWeather.appendChild(dataContainer);

  const sunset = document.createElement("p");
  sunset.innerHTML = `Sunset: ${formatTimeForTimezone(
    data.sys.sunset,
    data.timeZone
  )}`;
  dataContainer.appendChild(sunset);
  currentWeather.appendChild(dataContainer);
};

const displayWeatherForecast = (data) => {
  const dayTemps = {};
  data.list.forEach((item) => {
    const dateStr = item.dt_txt.split(" ")[0];
    if (!dayTemps[dateStr] || item.dt_txt.includes("15:00:00")) {
      dayTemps[dateStr] = item.main.temp;
    }
  });

  // Get the next three unique dates
  const dayKeys = Object.keys(dayTemps).slice(0, 3);

  const list = document.createElement("ul");

  dayKeys.forEach((dateStr, idx) => {
    let label;
    if (idx === 0) {
      label = "Today";
    } else {
      label = getWeekday(dateStr);
    }

    const listItem = document.createElement("li");
    listItem.innerHTML += `${label}: <strong>${dayTemps[dateStr]}&deg;F</strong>`;
    list.appendChild(listItem);
  });

  weatherForecast.appendChild(list);
};

const formatTimeForTimezone = (unixTimestamp, timeZone) => {
  const date = new Date(unixTimestamp * 1000);
  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  };
  const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
  const [timePart, ampm] = formatted.split(" ");
  const [hour, minute] = timePart.split(":");
  return `${hour}.${minute} ${ampm.toLowerCase()}`;
};

function getWeekday(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

fetchCurrentWeather();
fetchWeatherForecast();
