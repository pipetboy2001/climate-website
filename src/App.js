import React from 'react';
// import { WeatherGlobal } from './Components/WeatherGlobal';
import WeatherLocal from './Components/WeatherLocal';
import { Footer } from './Components/Footer';


function App() {
  return (
    <div>
      <h1>Hola mundo</h1>
      {/* Obtener de manera Global */}
      {/* Obtener de manera local */}
      <WeatherLocal />
      {/* Footer */}
      < Footer />
    </div>
  );
}

export default App;
