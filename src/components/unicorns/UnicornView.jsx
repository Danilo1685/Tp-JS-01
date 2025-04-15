// src/UnicornReadView.jsx
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import UnicornService from './UnicornService'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'

function UnicornView() {
  const [unicorns, setUnicorns] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await UnicornService.getUnicorns()
        setUnicorns(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="read-view">
      <h2>Unicornios (Vista de solo lectura)</h2>
      <Button 
        label="Volver" 
        icon="pi pi-arrow-left" 
        className="p-button-secondary mb-3" 
        onClick={() => navigate('/')}
      />

      {loading ? (
        <ProgressSpinner />
      ) : (
        <DataTable value={unicorns}>
          <Column field="name" header="Nombre" sortable />
          <Column field="age" header="Edad" sortable />
          <Column field="color" header="Color" sortable />
          <Column field="power" header="Poder" sortable />
        </DataTable>
      )}
    </div>
  )
}

export default UnicornView
