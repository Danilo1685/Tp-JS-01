import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import UnicornService from './UnicornService'

function UnicornCRUD() {
  const [unicorns, setUnicorns] = useState([])
  const [unicorn, setUnicorn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayDialog, setDisplayDialog] = useState(false)
  const [isNewUnicorn, setIsNewUnicorn] = useState(false)
  const toast = useRef(null)
  const navigate = useNavigate()

  const colorOptions = [
    { label: 'Rosa', value: 'Rosa' },
    { label: 'Azul', value: 'Azul' },
    { label: 'Violeta', value: 'Violeta' },
    { label: 'Blanco', value: 'Blanco' },
    { label: 'Arcoiris', value: 'Arcoiris' },
  ]

  useEffect(() => {
    loadUnicorns()
  }, [])

  const loadUnicorns = async () => {
    try {
      setLoading(true)
      const data = await UnicornService.getUnicorns()
      setUnicorns(data)
      setError(null)
    } catch (err) {
      setError('Failed to load unicorns: ' + err.message)
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Fallo al cargar los unicornios',
        life: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const saveUnicorn = async () => {
    if (!unicorn.name || !unicorn.color || unicorn.age < 0 || !unicorn.power) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Todos los campos son obligatorios',
        life: 3000,
      })
      return
    }

    try {
      let result
      if (isNewUnicorn) {
        result = await UnicornService.createUnicorn(unicorn)
        toast.current.show({
          severity: 'success',
          summary: 'Hecho',
          detail: 'Unicornio creado',
          life: 3000,
        })
      } else {
        result = await UnicornService.updateUnicorn(unicorn._id, unicorn)
        toast.current.show({
          severity: 'success',
          summary: 'Hecho',
          detail: 'Unicornio actualizado',
          life: 3000,
        })
      }
      loadUnicorns()
      setDisplayDialog(false)
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: isNewUnicorn ? 'Fallo al crear unicornio' : 'Fallo al actualizar unicornio',
        life: 3000,
      })
    }
  }

  const deleteUnicorn = async (unicorn) => {
    try {
      await UnicornService.deleteUnicorn(unicorn._id)
      loadUnicorns()
      toast.current.show({
        severity: 'success',
        summary: 'Hecho',
        detail: 'Unicornio borrado',
        life: 3000,
      })
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Fallo al eliminar unicornio',
        life: 3000,
      })
    }
  }

  const openNew = () => {
    setUnicorn({ name: '', age: 0, color: 'rosa', power: '' })
    setIsNewUnicorn(true)
    setDisplayDialog(true)
  }

  const openEdit = (unicorn) => {
    setUnicorn({ ...unicorn, power: unicorn.power || '' })
    setIsNewUnicorn(false)
    setDisplayDialog(true)
  }

  const onInputChange = (e, name) => {
    const val = e.target?.value ?? e.value
    setUnicorn({ ...unicorn, [name]: val })
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="button-container">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => openEdit(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger ml-2"
          onClick={() => deleteUnicorn(rowData)}
          tooltip="Eliminar"
        />
      </div>
    )
  }

  const dialogFooter = (
    <div className="p-d-flex p-jc-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text p-button-danger"
        onClick={() => setDisplayDialog(false)}
      />
      <Button
        label={isNewUnicorn ? 'Guardar' : 'Actualizar'}
        icon="pi pi-check"
        className="p-button-warning"
        onClick={saveUnicorn}
      />
    </div>
  )

  return (
    <div className="unicorn-crud fondo-gris">
      <Toast ref={toast} />

      <div className="card">
        <div
          className="card-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h2>Unicorns</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              label="Nuevo Unicornio"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={openNew}
            />
            <Button
              label="Ir a READ"
              icon="pi pi-book"
              className="p-button-info"
              onClick={() => navigate('/unicornios-read')}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <ProgressSpinner />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <DataTable value={unicorns}>
            <Column field="name" header="Nombre" sortable />
            <Column field="age" header="Edad" sortable />
            <Column field="color" header="Color" sortable />
            <Column field="power" header="Poder" sortable />
            <Column
              body={actionBodyTemplate}
              header="Acciones"
              style={{ width: '10rem', textAlign: 'center' }}
            />
          </DataTable>
        )}
      </div>

      <Dialog
        visible={displayDialog}
        style={{ width: '450px' }}
        header={isNewUnicorn ? 'Nuevo Unicornio' : 'Editar Unicornio'}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={() => setDisplayDialog(false)}
      >
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText
            id="name"
            value={unicorn?.name}
            onChange={(e) => onInputChange(e, 'name')}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="age">Edad</label>
          <InputNumber
            id="age"
            value={unicorn?.age}
            onChange={(e) => onInputChange(e, 'age')}
            min={0}
          />
        </div>
        <div className="field">
          <label htmlFor="power">Poder</label>
          <InputText
            id="power"
            value={unicorn?.power}
            onChange={(e) => onInputChange(e, 'power')}
            placeholder="Ej: Volar, Invisibilidad"
          />
        </div>
        <div className="field">
          <label htmlFor="color">Color</label>
          <Dropdown
            id="color"
            value={unicorn?.color}
            options={colorOptions}
            onChange={(e) => onInputChange(e, 'color')}
            placeholder="Seleccione un color"
          />
        </div>
      </Dialog>
    </div>
  )
}

export default UnicornCRUD
