const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessCont = document.querySelector(".grant-location-conatiner");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getFormSessionStorage();

function switchTab(clickedTab) {
  if (currentTab != clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      // search tab prr jaana h
      console.log("pk");
      userInfoContainer.classList.remove("active");
      grantAccessCont.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // search tab pr the ab userinfo pr aana h
      searchForm.classList.remove("active");
      // grantAccessCont.classList.remove('active');
      userInfoContainer.classList.remove("active");
      // you have to show your current location weather
      // for coordinates , if we have saved them there;
      getFormSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // jispr click kro wo paas krna h
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  // jispr click kro wo paas krna h
  switchTab(searchTab);
});

function getFormSessionStorage() {
  const localCoord = sessionStorage.getItem("user-coordinates");
  if (!localCoord) {
    grantAccessCont.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoord);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // grant location ko invisble krde
  grantAccessCont.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  //  api call

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[ data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //place all the values on the page

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   
   desc.innerText=weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
 
  temp.innerText=weatherInfo?.main?.temp;
  windspeed.innerText=weatherInfo?.wind?.speed;
  humidity.innerText=weatherInfo?.main?.humidity;
  cloudiness.innerText=weatherInfo?.clouds?.all;
}
function getLocation()
{
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition);

  }
  else{
    // error for no location found
  }
}

function showPosition(position)
{

  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude
  }


  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

let searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>
{
  e.preventDefault();

  if(searchInput.value==="")
  return ;

  fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessCont.classList.remove("active");

    try{
      const response =await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )

      const data=await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(err)
    {
      // errr
    }
}