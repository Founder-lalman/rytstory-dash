import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashbord from './Dashbord/Dashbord'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Dashbord/>
    </>
  )
}

export default App
