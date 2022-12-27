import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../Styles/Weather.css';
const API_KEY = '39e3eed599c1d4cc4a74c3f379bad554';
const WeatherLocal = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Solicita permiso al usuario para acceder a su ubicación
        const location = await navigator.geolocation.getCurrentPosition(
          async position => {
            console.log(location);
            // Obtiene la ubicación del usuario
            const { latitude, longitude } = position.coords;
            // Realiza una solicitud HTTP a la API de Open Weather Map utilizando la ubicación del usuario y el parámetro lang=es
            const currentResult = await axios(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&appid=${API_KEY}`
            );
            setWeatherData(currentResult.data);
            // Realiza una solicitud HTTP a la API de Open Weather Map para obtener la previsión del tiempo en español
            const forecastResult = await axios(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=es&appid=${API_KEY}`
            );
            setForecastData(forecastResult.data);
          },
          error => {
            setError(error);
          }
        );
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  if (error) {
    return <div>Error: {error.message}
      <br></br>
      Debe permitir buscar su ubicacion para ver localmente
    </div>;

  }
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  if (!weatherData || !forecastData) {
    return null;
  }

  const celsius = weatherData.main.temp - 273.15;
  const maxTemperatureCelsius = weatherData.main.temp_max - 273.15;
  const minTemperatureCelsius = weatherData.main.temp_min - 273.15;
  const iconName = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`;


  // Obtiene la fecha del quinto día en el futuro
  const fifthDay = new Date();
  fifthDay.setDate(fifthDay.getDate() + 5);

  // Filtra los datos de previsión del tiempo para obtener solo los del quinto día en el futuro
  const fifthDayData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === fifthDay.getDay();
  });

  // Calcula la temperatura promedio del quinto día en el futuro
  const fifthDayTemperature =
    fifthDayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / fifthDayData.length;

  // Obtiene la fecha del cuarto día en el futuro
  const fourthDay = new Date();
  fourthDay.setDate(fourthDay.getDate() + 4);

  // Filtra los datos de previsión del tiempo para obtener solo los del cuarto día en el futuro
  const fourthDayData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === fourthDay.getDay();
  });

  // Calcula la temperatura promedio del cuarto día en el futuro
  const fourthDayTemperature =
    fourthDayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / fourthDayData.length;

  // Obtiene la fecha del tercer día en el futuro
  const thirdDay = new Date();
  thirdDay.setDate(thirdDay.getDate() + 3);

  // Filtra los datos de previsión del tiempo para obtener solo los del tercer día en el futuro
  const thirdDayData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === thirdDay.getDay();
  });

  // Calcula la temperatura promedio del tercer día en el futuro
  const thirdDayTemperature =
    thirdDayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / thirdDayData.length;

  // Obtiene la fecha del segundo día en el futuro
  const secondDay = new Date();
  secondDay.setDate(secondDay.getDate() + 2);

  // Filtra los datos de previsión del tiempo para obtener solo los del segundo día en el futuro
  const secondDayData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === secondDay.getDay();
  });

  // Calcula la temperatura promedio del segundo día en el futuro
  const secondDayTemperature =
    secondDayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / secondDayData.length;

  // Obtiene la fecha del primer día en el futuro
  const firstDay = new Date();
  firstDay.setDate(firstDay.getDate() + 1);

  // Filtra los datos de previsión del tiempo para obtener solo los del primer día en el futuro
  const firstDayData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === firstDay.getDay();
  });

  // Calcula la temperatura promedio del primer día en el futuro
  const firstDayTemperature =
    firstDayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / firstDayData.length;

  //Obtener la hora para definir si es mañana,tarde o noche
  const currentHour = new Date().getHours();
  const rectangleClass =
    currentHour >= 6 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 18 ? 'afternoon' :
        'night';

  return (
    <div className='weather-card'>
      <div className={`rectangle ${rectangleClass}`}>
        <br></br>
        <div className="top">
          <h1>
            {/* colocar ciudad y pais */}
            <div>{weatherData.name}, {weatherData.sys.country}</div>
            {/* Descripcion */}
            <div >{weatherData.weather[0].main} <img src={iconUrl} alt='tiempo-Icon' /> </div>
          </h1>
          <h3>
            <div className='temp'>{Math.round(celsius)}°C</div>
            <div>
              <div>
                {/* Valores del dia */}
                Mín {Math.round(minTemperatureCelsius)}°C - Máx {Math.round(maxTemperatureCelsius)}°C</div>
              <div>Humedad: {weatherData.main.humidity}%</div>
              <div>Viento: {weatherData.wind.speed} m/s</div>
              <div>Presion: {weatherData.main.pressure} hPa</div>
              <br></br>
            </div>
          </h3>
        </div>
      </div>
      {/* dividir en dos partes */}
      <div className="bottom">
        <div className="wrapper">
          <ul className="forecast">
            <li>
              <span>{firstDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
              <span className="lnr lnr-cloud condition">
                <span className="temp">{firstDayTemperature.toFixed(1)}<span
                  className="temp-type">° C</span></span>
              </span>
            </li>
            <li>
              <span>{secondDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
              <span className="lnr lnr-cloud condition">
                <span className="temp">{secondDayTemperature.toFixed(1)}<span
                  className="temp-type">° C</span></span>
              </span>
            </li>
            <li>
              <span>{thirdDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
              <span className="lnr lnr-cloud condition">
                <span className="temp">{thirdDayTemperature.toFixed(1)}<span
                  className="temp-type">° C</span></span>
              </span>
            </li>
            <li>
              <span>{fourthDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
              <span className="lnr lnr-cloud condition">
                <span className="temp">{fourthDayTemperature.toFixed(1)}<span
                  className="temp-type">° C</span></span>
              </span>
            </li>
            <li>
              <span>{fifthDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
              <span className="lnr lnr-cloud condition">
                <span className="temp">{fifthDayTemperature.toFixed(1)}<span
                  className="temp-type">° C</span></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default WeatherLocal;

