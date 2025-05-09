import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useUnicorns } from '../context/UnicornContext'
import { useTheme } from '../context/Context'
import PdfGenerator from '../components/PdfGenerator'

function UnicornsView() {
  const navigate = useNavigate()
  const toast = useRef(null)
  const { unicorns, deleteUnicorn, loading } = useUnicorns()
  const { darkMode } = useTheme()

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const filteredUnicorns = unicorns.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedUnicorns = filteredUnicorns.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const totalPages = Math.ceil(filteredUnicorns.length / perPage)

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este unicornio? 🦄')) {
      try {
        await deleteUnicorn(id)
        toast.current.show({
          severity: 'success',
          summary: 'Hecho',
          detail: 'Unicornio eliminado',
          life: 3000
        })
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el unicornio',
          life: 3000
        })
      }
    }
  }

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => navigate(`/unicornios/editar/${rowData._id}`)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDelete(rowData._id)}
        tooltip="Eliminar"
      />
    </div>
  )

  return (
    <div className={`unicorns-view ${darkMode ? 'dark-theme' : ''}`} style={{ padding: '2rem' }}>
      <Toast ref={toast} />

      <h2>🦄 Lista de Unicornios</h2>

      <div className="card">
        <div
          className="card-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              label="Nuevo Unicornio"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={() => navigate('/unicornios/crear')}
            />
            <PdfGenerator data={filteredUnicorns} />
          </div>
        </div>

        <div className="my-3">
          <InputText
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full md:w-20rem"
          />
        </div>

        {loading ? (
          <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable value={paginatedUnicorns} paginator={false} responsiveLayout="scroll">
            <Column field="nombre" header="Nombre" />
            <Column field="color" header="Color" />
            <Column field="poder" header="Poder" />
            <Column field="edad" header="Edad" />
            <Column body={actionBodyTemplate} header="Acciones" style={{ textAlign: 'center' }} />
          </DataTable>
        )}

        {totalPages > 1 && (
          <div className="flex justify-content-center mt-3 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                label={(i + 1).toString()}
                className={currentPage === i + 1 ? 'p-button-info' : 'p-button-outlined'}
                onClick={() => setCurrentPage(i + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UnicornsView
