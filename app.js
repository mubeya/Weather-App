const APIKEY = config.APIKEY;
const FORM = document.getElementById("form");
const mainDOM = document.getElementById("main");
const WEATHERDOM = document.createElement("div");
const WEATHERWEEKDOM = document.createElement("div");
const cityDropdown = document.getElementById("cityName");

getWeather();  //call function for default city first
cityDropdown.addEventListener("input", (e) =>{
    e.preventDefault(); 
  //WEATHERDOM.innerHTML = ``;
    WEATHERWEEKDOM.innerHTML = ``; // delete page content
    getWeather();   //call function for when new city selected
});                    


async function getWeather(){
    const CITY_NAME = cityDropdown.selectedOptions[0].textContent; //get selected city
    
    const APIURL = "https://api.openweathermap.org/data/2.5/weather?q="+ CITY_NAME + "&lang=tr&&appid=" + APIKEY +"&units=metric&lang=tr"; //getting lat and kon value from this url
    const res = await (await fetch(APIURL)).json();
   
    const ONECALLAPIURL =  "https://api.openweathermap.org/data/2.5/onecall?lat="+res.coord.lat+"&lon="+res.coord.lon+"&exclude=minutely&appid=" + APIKEY +"&units=metric&lang=tr"; //getting weather values from this url  
    const resp = await (await fetch(ONECALLAPIURL)).json(); 
   
    WEATHERDOM.classList.add("weather", "col-md-6", "offset-md-3", "mt-4");
    WEATHERDOM.innerHTML = `<div class="row city">
                                 <span style="font-weight:600; margin-right:3px;">${CITY_NAME.toUpperCase()}, </span>
                                 <span>${getToday(resp.current.dt)}</span>
                             </div>
                             <div class="row temp-img">
                                 <div class="col-6 col-md-4 ">
                                     <span style="font-size: 4.5rem;font-weight: bold;">${parseInt(resp.current.temp)}°</span>
                                 </div>
                                 <div class="col-6 col-md-4 ">
                                     <span style="font-size: 1.1rem;">Nem: %${resp.current.humidity}</span><br>
                                     <span style="font-size: 1.1rem;">Rüzgar:  ${Math.floor(resp.current.wind_speed * 10)} km/s</span> 
                                 </div>
                                 <div class="weather-img col-md-4">
                                     <img src="/hava-durumu/images/${resp.current.weather[0].icon}.png" style="width:90px;">
                                     <span>${resp.current.weather[0].description[0].toUpperCase() + resp.current.weather[0].description.slice(1)}</span>
                                 </div>
                             </div>
                             <div class="row hour-weather mt-4">
                                     <div class="list-group-item"><span>${getHour(resp.hourly[2].dt)}</span><img src="/hava-durumu/images/${resp.hourly[2].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[2].temp)}°</span></div>
                                     <div class="list-group-item"><span>${getHour(resp.hourly[4].dt)}</span><img src="/hava-durumu/images/${resp.hourly[4].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[4].temp)}°</span></div>
                                     <div class="list-group-item"><span>${getHour(resp.hourly[6].dt)}</span><img src="/hava-durumu/images/${resp.hourly[6].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[6].temp)}°</span></div>
                                     <div class="list-group-item"><span>${getHour(resp.hourly[8].dt)}</span><img src="/hava-durumu/images/${resp.hourly[8].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[8].temp)}°</span></div>
                                     <div class="list-group-item"><span>${getHour(resp.hourly[10].dt)}</span><img src="/hava-durumu/images/${resp.hourly[10].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[10].temp)}°</span></div>
                                     <div class="list-group-item"><span>${getHour(resp.hourly[12].dt)}</span><img src="/hava-durumu/images/${resp.hourly[12].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[12].temp)}°</span></div>
                             </div>`
     mainDOM.append(WEATHERDOM);
     
    WEATHERWEEKDOM.classList.add("weather-week", "col-md-6", "offset-md-3", "mt-4");
    mainDOM.append(WEATHERWEEKDOM); 
    
    // we dont get first day of the week cause its same as current weather so used for loop instead of forEach
    for(let i=1;i<resp.daily.length-3;i++){   // create week weather chart from second day
        const divDOM = document.createElement("div");
        divDOM.classList.add("week-day");
        divDOM.innerHTML = `<span>${getWeek(resp.daily[i].dt)}</span>
                           <span style="font-weight:bold; font-size:20px;">${parseInt(resp.daily[i].temp.day)}°</span>
                           <img src="/hava-durumu/images/${resp.daily[i].weather[0].icon}.png" style="width:40px;">
                           <span>%${resp.daily[i].humidity} Nem</span>`;
        WEATHERWEEKDOM.append(divDOM);
    }; 
}

function getHour(unix_timestamp){  //get today hours from API and convert to real clock time
    
    let date = new Date(unix_timestamp * 1000);
    let hours = "0" + date.getHours();
    let minutes = "0" + date.getMinutes();

    let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
 
    return formattedTime;    
}

function getToday(unix_timestamp){  //get today date from API and convert to real clock time
    
    let date = new Date(unix_timestamp * 1000);
    let hours = "0" + date.getHours();
    let minutes = "0" + date.getMinutes();
    let options = {weekday: 'long'};
    let today = new Intl.DateTimeFormat('tr-TR', options).format(date);
    let options2 = {month: 'long'};
    let month = new Intl.DateTimeFormat('tr-TR', options2).format(date);
    let monthDay = date.getDate();

    let formattedTime = monthDay + ' ' + month + ' ' + today +  ', ' + hours.substr(-2) + ':' + minutes.substr(-2);
 
    return formattedTime;    
}

function getWeek(unix_timestamp){  //get all week date from API and convert to real clock time
    let date = new Date(unix_timestamp * 1000);
    let options = {weekday: 'short'};
    let today = new Intl.DateTimeFormat('tr-TR', options).format(date);
    let monthDay = date.getDate();

    let formattedTime =  monthDay +  ', ' + today;
 
    return formattedTime;    
}
