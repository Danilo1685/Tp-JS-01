import { Routes, Route, Link } from 'react-router-dom'
import { Fragment } from 'react'
import './App.css'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import UnicornCRUD from './components/unicorns/UnicornCRUD'
import UnicornView from './components/unicorns/UnicornView'

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<UnicornCRUD />} />
        <Route path="/unicornios-read" element={<UnicornView />} />
      </Routes>
      <Link to="/unicornios-read">
        <Button label="Ir a READ" />
      </Link>
    </Fragment>
  )
}

export default App
