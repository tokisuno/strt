/*****************************
         * WEATHER *
*****************************/
class Weather {
    constructor(location, temp, feelslike, humidity, precip) {
        this.location = location;
        this.temp = temp;
        this.feelslike = feelslike;
        this.humidity = humidity;
        this.precip = precip;
    }
}

const API_KEY = "D8APCPL4XYH6U7888V47PGE8W"; // It's a free API key, chill.

async function getData(city = 'toronto') {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`, { mode: 'cors' });
        const result = await response.json();
        const data = new Weather (
            result.resolvedAddress,
            result.currentConditions.temp,
            result.currentConditions.feelslike,
            result.currentConditions.humidity,
            result.currentConditions.precip,
        )
        return data;
    } catch (err) {
        throw err;
    }
}

function getWeather(data) {
    data.then(res => {
        const location = document.querySelector('div.location');
        location.textContent = `${res.location}`;
        const weather = document.querySelector('div.weather');
        weather.textContent = `${res.temp} (${res.humidity}%) :: PoP ${res.precip}%`
    });
}

getWeather(getData());

/*****************************
          * DATE *
*****************************/

const daysInYear = (year) => {
    const isLeap = new Date(year, 1, 29).getDate() === 29;
    return (isLeap) ? 366 : 365;
}

// Just straight up stolen from --> https://stackoverflow.com/a/6117889
const getWeek = (date) => {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Set to the nearest Thursday: Current Date + 4 - Current day number
    // Make Sunday's day number = 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));

    // Get first day of the year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));

    // Calculate full weeks to the nearest Thursday
    const weekNum = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);

    // Returns array containing year and week number
    return [date.getUTCFullYear(), weekNum];
}

const dateDiv = document.querySelector("div.date");
const date = new Date().toLocaleDateString("en-ca");
const week = getWeek(new Date())
dateDiv.textContent = `${date} (W${week[1]})`;

const daysElapsed = (date) => {
    const beginningOfThisYear = new Date("2024-01-01");
    const difference = Math.round((date.getTime() - beginningOfThisYear.getTime()) / (1000 * 60 * 60 * 24));
    return difference;
}

const daysThisYear = daysInYear(week[0]);
const remaining = document.querySelector("div.remain");
remaining.textContent = `${daysElapsed(new Date)}/${daysThisYear} (${((daysElapsed(new Date) / daysThisYear) * 100).toPrecision(2)}%)`;
