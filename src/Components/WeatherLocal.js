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
            // Realiza una solicitud HTTP a la API de Open Weather Map utilizando la ubicación del usuario
            const currentResult = await axios(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
            );
            setWeatherData(currentResult.data);

            // Realiza una solicitud HTTP a la API de Open Weather Map para obtener la previsión del tiempo
            const forecastResult = await axios(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let yesterdayTemperature;
  if (forecastData) {
    const yesterdayData = forecastData.list.filter(item => {
      const date = new Date(item.dt * 1000);
      return date.getDay() === yesterday.getDay();
    });
    yesterdayTemperature = yesterdayData.reduce((acc, item) => acc + (item.main.temp - 273.15), 0) / yesterdayData.length;
  }


  const tomorrowData = forecastData.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getDay() === today + 1;
  });
  const tomorrowTemperature = tomorrowData.reduce((acc, item) => acc + item.main.temp, 0) / tomorrowData.length - 273.15;

  const currentHour = new Date().getHours();

  const rectangleClass =
    currentHour >= 6 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 18 ? 'afternoon' :
        'night';

  return (
    <div className="outer-rectangle">
      {/* rectangulo cambia segun la hora */}
      <h4 className="card-title">Clima en tu ubicación</h4>
      <div className={`inner-rectangle ${rectangleClass}`}>
        {/* tu ubicacion */}
        <h5 className="card-title">{weatherData.name}</h5>
        {weatherData.weather[0].description}
        {/* Un icono segun el tiempo*/}
        <p className="card-text">
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="weather icon"
          />
        </p>
        {/* Temperatura actual */}
        <p className="card-text temperature">{celsius.toFixed(1)}°C</p>
        {/* Temperatura minima y maxima */}
        <p className="card-text min-max-temperature">
          {minTemperatureCelsius.toFixed(1)}°C - {maxTemperatureCelsius.toFixed(1)}°C
        </p>
        {/* Rectangulo con temperatura de ayer y mañana */}
        <div className="PrevensionTiempo">
          <div>
            <p>Ayer</p>
            <p> {yesterdayTemperature}°C</p>
          </div>
          <div>
            <p>Mañana</p>
            <p className="forecast-temperature">{tomorrowTemperature.toFixed(1)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherLocal;

