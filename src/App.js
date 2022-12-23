import React from 'react';
import  WeatherGlobal  from './Components/WeatherGlobal';
import WeatherLocal from './Components/WeatherLocal';
import { Footer } from './Components/Footer';


function App() {
  return (
    <div className="App">

    <div className='responsive-components'>
      {/* Obtener de manera local */}
      <WeatherLocal />
      {/* Obtener de manera Global */}
      <WeatherGlobal />
      </div>
      {/* Footer */}
      < Footer />
    </div>
  );
}

export default App;
