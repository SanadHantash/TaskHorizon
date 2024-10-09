import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Todos from './Pages/TodoPage';



function App() {
  return (
    <div className="App">
      <header className="App-header">
      <BrowserRouter>
          <Routes>
          <Route path="/" element={<Todos />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
