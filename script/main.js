const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('timezone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HourFormat = hour >=13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HourFormat < 10? `0`+hoursIn12HourFormat:hoursIn12HourFormat) + ':' + (minutes < 10? `0`+minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ',' + ' ' + date + ' '+months[month];

}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) =>{

        let {latitude, longitude} = success.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
            })
    })
    
}

function showWeatherData(data){

    let {humidity, pressure, wind_speed, sunrise, sunset} = data.current;

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <p>${humidity}%</p>
    </div>
    <div class="weather-item">
        <p>Pressure</p>
        <p>${pressure}</p>
    </div>
    <div class="weather-item">
        <p>Wind Speed</p>
        <p>${wind_speed}</p>
    </div>
    <div class="weather-item">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
    </div>
    <div class="weather-item">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
    </div>`

    ;

    timezoneEl.innerHTML = data.timezone;
    countryEl.innerHTML =data.lat + `N` + data.lon + `E`;


    let otherDayforecast = ``

    data.daily.forEach((day, idx) =>{
        if(idx==0){
            currentTempEl.innerHTML=`
            <div class="today" id="current-temp">
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="" class="w-icon">
            <div class="others">
                <div class="day">Monday</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`

        }else{
            otherDayforecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`
        }
    
    })

    weatherForecastEl.innerHTML = otherDayforecast;

}