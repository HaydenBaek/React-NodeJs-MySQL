import React from 'react'
import Home from './Home';  // Capital "H" in Home
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Create from './Create';
import Update from './Update';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/create' element={<Create />}></Route>
      <Route path='/update/:id' element={<Update />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
