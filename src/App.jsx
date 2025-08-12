import { useState } from 'react'
import './App.css'
import Dashbord from './Dashbord/Dashbord'
import FilterProvider from './context/Filtercontext'

function App() {

  return (
    <>
      <FilterProvider>
        <Dashbord/>
      </FilterProvider>
    </>
  )
}

export default App
