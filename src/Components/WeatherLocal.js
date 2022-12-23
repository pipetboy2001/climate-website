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
    return <div>Error: {error.message}</div>;
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
  const today = new Date().getDay();
  const iconName = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`;

  // Obtiene la fecha del día anterior
  let yesterdayTemperature;
  if (forecastData) {
    // Obtiene la fecha del día anterior
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Filtra los datos de previsión del tiempo para obtener solo los del día anterior
    const yesterdayData = forecastData.list.filter(item => {
      const date = new Date(item.dt * 1000);
      return date.getDay() === yesterday.getDay();
    });

    // Calcula la temperatura promedio del día anterior
    yesterdayTemperature = yesterdayData.reduce((acc, item) => {
      const temp = item.main.temp - 273.15;
      return isNaN(temp) ? acc : acc + temp;
    }, 0) / yesterdayData.length;
  }




  // Obtiene la fecha del día de mañana
  const tomorrowData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === today + 1;
  });
  const tomorrowTemperature = tomorrowData.reduce((acc, item) => acc + item.main.temp, 0) / tomorrowData.length - 273.15;
  //Obtener la hora para definir si es mañana,tarde o noche
  const currentHour = new Date().getHours();
  const rectangleClass =
    currentHour >= 6 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 18 ? 'afternoon' :
        'night';

  return (
    <div className='weather-card'>
      <div className={`rectangle ${rectangleClass}`}>
        <div className="top">
          <h1>
            {/* Descripcion */}
            <div >{weatherData.weather[0].main} <img src={iconUrl} alt='tiempo-Icon'/> </div>
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
            <li className="active">
              <span >Ayer</span>
              <span className="lnr lnr-sun condition">
                {/* Obtener temperatura de ayer */}
                <span className="temp">{isNaN(yesterdayTemperature) ? 'no disponible' : `${yesterdayTemperature}° C`}</span>  
              </span>
            </li>
            <li>
              <span>Mañana</span>
              <span className="lnr lnr-cloud condition">
                {/* Obtener temperatura de mañana */}
                <span className="temp">{tomorrowTemperature.toFixed(1)}<span
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

