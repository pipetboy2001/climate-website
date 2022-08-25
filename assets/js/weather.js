
/* usando la documentadio seguires mediante la ubicacion geografica*/
const APP_ID = '4090239d69cdb3874de692fd18539299';
/* Obteniendo la data del clima*/
/*obtendremos la latitud y logitud de posicion */
const fetchData = position => {
  const { latitude, longitude } = position.coords;
  /*llamamos a la API colocandole que vea por latitudes longitud */
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APP_ID}`)
    .then(response => response.json())
    .then(data => setWeatherData(data));
}
/* obtener los datos de data*/
const setWeatherData = data => {
  const weatherData = {
    location: data.name,
    description: data.weather[0].main,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    temperature: Math.floor(data.main.temp),
    date: getDate(),
  }
  /*para iterar cada objeto y usar la ID que se usan ahi */
  Object.keys(weatherData).forEach(key => {
    setTextContent(key, weatherData[key]);
  });

  
}

/*para obtener la fecha en js */
const getDate = () => {
  let date = new Date();
  return `${date.getDate()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
}

const setTextContent = (element, text) => {
  document.getElementById(element).textContent = text;
}

/* pedir tu ubicacion*/
const onLoad = () => {
  navigator.geolocation.getCurrentPosition(fetchData)
}

/**********************************************/
/* la usamos para cuando es por busqueda API*/
const Busq_API = {
  key: '4090239d69cdb3874de692fd18539299',
  url: `https://api.openweathermap.org/data/2.5/weather`
} 


/* Obteniendo la data del clima*/
const card = document.getElementById('card')
const city = document.getElementById('city');
const date = document.getElementById('date');
const tempImg = document.getElementById('temp-img');
const temp = document.getElementById('temp');
const weather = document.getElementById('weather');
const range = document.getElementById('range');

function updateImages(data) {
  const temp = toCelsius(data.main.temp);
  let src = 'images/temp-mid.png';
  if (temp > 26) {
    src = 'images/temp-high.png';
  } else if (temp < 20) {
    src = 'images/temp-low.png';
  }
  tempImg.src = src;
}

/*funcion asincrona que obtendremos la informacion de la API */
async function search(query) {
  try {
    /*fetch para obtener la informacion */
    const response = await fetch(`${Busq_API.url}?q=${query}&appid=${Busq_API.key}&lang=es`);
    const data = await response.json();
    card.style.display = 'block';
    city.innerHTML = `${data.name}, ${data.sys.country}`;
    data.innerHTML = (new Date()).toLocaleDateString();
    temp.innerHTML = `${toCelsius(data.main.temp)}c`;
    weather.innerHTML = data.weather[0].description;
    range.innerHTML = `${toCelsius(data.main.temp_min)}c / ${toCelsius(data.main.temp_max)}c`;
    updateImages(data);
  } /*para asegurarse que no hay ningun error */
    catch (err) {
    console.log(err);
    alert('Hubo un error');
  }
}

//convertir de kelvin a celcius
function toCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

/*funcion onSubmit que recibe un evento */
function onSubmit(event) {
  /*esto es para no hacer una revendicacion */
  event.preventDefault();
  search(searchbox.value);
}

/*Obtener cuando buscar en el buscador */
const searchform = document.getElementById('search-form');
const searchbox = document.getElementById('searchbox');
searchform.addEventListener('submit', onSubmit, true);
