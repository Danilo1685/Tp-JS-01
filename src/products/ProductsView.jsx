import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'

function ProductsView() {
  const navigate = useNavigate()
  const toast = useRef(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  useEffect(() => {
    fetchProducts()

    // Cambiar fondo
    Object.assign(document.body.style, {
      backgroundImage: 'url("/images/carrito.jpg")',
      minHeight: '100vh',
      paddingTop: '2rem',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })

    return () => {
      Object.assign(document.body.style, {
        backgroundImage: '',
        minHeight: '',
        paddingTop: '',
        backgroundSize: '',
        backgroundPosition: '',
        backgroundRepeat: ''
      })
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://crudcrud.com/api/713c93db8a1145d49a03ed9eeae4415d/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los productos',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto? 🛒')) {
      try {
        await fetch(`https://crudcrud.com/api/028f0b7279a648b7b4d21c95f953e6b7/products/${id}`, {
          method: 'DELETE'
        })
        setProducts((prev) => prev.filter((p) => p._id !== id))
        toast.current.show({
          severity: 'success',
          summary: 'Hecho',
          detail: 'Producto eliminado',
          life: 3000
        })
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el producto',
          life: 3000
        })
      }
    }
  }

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const totalPages = Math.ceil(filteredProducts.length / perPage)

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-content-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => navigate(`/productos/editar/${rowData._id}`)}
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
    <div className="products-view" style={{ padding: '2rem' }}>
      <Toast ref={toast} />
      <h2 className="mb-4">🛒 Lista de Productos</h2>

      <div className="card">
        <div className="card-header flex justify-content-between align-items-center mb-3">
          <Button
            label="Nuevo Producto"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => navigate('/productos/crear')}
          />
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
          <>
            <DataTable
              value={paginatedProducts}
              responsiveLayout="scroll"
              emptyMessage="No hay productos para mostrar "
              paginator={false}
            >
              <Column field="nombre" header="Nombre" sortable />
              <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio.toFixed(2)}`} sortable />
              <Column header="Acciones" body={actionBodyTemplate} />
            </DataTable>

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
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsView
