import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageGallery from "./components/imageGallery/ImageGallery";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <ImageGallery />
      </div>
    </>
  )
}

export default App
