const APIKEY = config.APIKEY;
const FORM = document.getElementById("form");
const mainDOM = document.getElementById("main");
const WEATHERDOM = document.createElement("div");
const WEATHERWEEKDOM = document.createElement("div");

FORM.addEventListener("submit", (e) =>{
    e.preventDefault(); 
    WEATHERDOM.innerHTML = ``;  // delete page content
    WEATHERWEEKDOM.innerHTML = ``;
    
    let CITY_NAME = document.getElementById("cityName").value;
    const APIURL = "https://api.openweathermap.org/data/2.5/weather?q="+ CITY_NAME + "&lang=tr&&appid=" + APIKEY +"&units=metric&lang=tr";
   
    fetch(APIURL).then(res => res.json())
             .then(res =>{
                          getWeather(res.coord.lat,res.coord.lon,CITY_NAME);  //get city name and coordinates from API
             });
});                    


function getWeather(lat,lon,CITY_NAME){
    const ONECALLAPIURL =  "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely&appid=" + APIKEY +"&units=metric&lang=tr"; 
    fetch(ONECALLAPIURL).then(resp => resp.json())
                    .then(resp =>{   //get today's weather
                                
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
                                                                <span style="font-size: 1.1rem;">Rüzgar:  ${(resp.current.wind_speed) * 10} km/s</span> 
                                                            </div>
                                                            <div class="weather-img col-md-4">
                                                                <img src="/images/${resp.current.weather[0].icon}.png" style="width:90px;">
                                                                <span>${resp.current.weather[0].description[0].toUpperCase() + resp.current.weather[0].description.slice(1)}</span>
                                                            </div>
                                                        </div>
                                                        <div class="row hour-weather mt-4">
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[2].dt)}</span><img src="/images/${resp.hourly[2].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[2].temp)}°</span></div>
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[4].dt)}</span><img src="/images/${resp.hourly[4].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[4].temp)}°</span></div>
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[6].dt)}</span><img src="/images/${resp.hourly[6].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[6].temp)}°</span></div>
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[8].dt)}</span><img src="/images/${resp.hourly[8].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[8].temp)}°</span></div>
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[10].dt)}</span><img src="/images/${resp.hourly[10].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[10].temp)}°</span></div>
                                                                <div class="list-group-item"><span>${getHour(resp.hourly[12].dt)}</span><img src="/images/${resp.hourly[12].weather[0].icon}.png" style="width:30px;"><span>${parseInt(resp.hourly[12].temp)}°</span></div>
                                                        </div>`

                                mainDOM.append(WEATHERDOM);
                                
                                WEATHERWEEKDOM.classList.add("weather-week", "col-md-6", "offset-md-3", "mt-4");
                                mainDOM.append(WEATHERWEEKDOM); 
                                
                                // we dont get first day of the week cause its same as current weather so used for instead of forEach
                                for(let i=1;i<resp.daily.length-2;i++){   // create week weather chart from second day
                                    const divDOM = document.createElement("div");
                                    divDOM.classList.add("week-day");
                                    divDOM.innerHTML = `<span>${getWeek(resp.daily[i].dt)}</span>
                                                       <span style="font-weight:bold;">${parseInt(resp.daily[i].temp.day)}°</span>
                                                       <img src="/images/${resp.daily[i].weather[0].icon}.png" style="width:40px;">
                                                       <span>${resp.daily[i].weather[0].description[0].toUpperCase() + resp.daily[i].weather[0].description.slice(1)}</span>
                                                       <span>%${resp.daily[i].humidity} Nem</span>`;
                                    WEATHERWEEKDOM.append(divDOM);
                                };  
                    });     
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

    let formattedTime = today + ' ' + hours.substr(-2) + ':' + minutes.substr(-2);
 
    return formattedTime;    
}

function getWeek(unix_timestamp){  //get all week date from API and convert to real clock time
    let date = new Date(unix_timestamp * 1000);
    let options = {weekday: 'short'};
    let today = new Intl.DateTimeFormat('tr-TR', options).format(date);
    let options2 = {month: 'short'};
    let month = new Intl.DateTimeFormat('tr-TR', options2).format(date);
    let monthDay = date.getDate();

    let formattedTime =  monthDay + ' ' + month + ', ' + today;
 
    return formattedTime;    
}