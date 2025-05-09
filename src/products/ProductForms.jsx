// src/products/ProductForm.jsx
import React, { useEffect, useState } from 'react'
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'

const API_BASE = 'https://crudcrud.com/api/d0a2e735c8fc4300a439b9e2acb53110/products'

const validationSchema = Yup.object({
  nombre: Yup.string().required('Requerido'),
  precio: Yup.number().required('Requerido').positive('Debe ser mayor a 0')
})

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()

  const [initialValues, setInitialValues] = useState({
    nombre: '',
    precio: ''
  })
  const [loading, setLoading] = useState(false)

  // Fondo igual a ProductsView
  useEffect(() => {
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

  useEffect(() => {
    if (!id) return

    setLoading(true)
    fetch(`${API_BASE}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialValues({
          nombre: data.nombre || '',
          precio: data.precio || ''
        })
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error al cargar producto', err)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const productData = {
        nombre: values.nombre,
        precio: parseFloat(values.precio)
      }

      if (id) {
        await fetch(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        showToast('Producto actualizado')
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        showToast('Producto creado')
      }

      navigate('/productos')
    } catch (err) {
      console.error('Error al guardar producto', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page" style={{ padding: '2rem' }}>
      <h2 className="mb-4">{id ? 'Editar Producto' : 'Crear Producto'}</h2>

      {loading ? (
        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <ProgressSpinner />
        </div>
      ) : (
        <Card className="p-4 shadow-3 surface-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <FForm className="flex flex-column gap-3">
                <div>
                  <label htmlFor="nombre" className="block font-medium mb-1">Nombre</label>
                  <Field
                    name="nombre"
                    as={InputText}
                    id="nombre"
                    className="w-full"
                  />
                  <small className="p-error">
                    <ErrorMessage name="nombre" />
                  </small>
                </div>

                <div>
                  <label htmlFor="precio" className="block font-medium mb-1">Precio</label>
                  <InputNumber
                    id="precio"
                    name="precio"
                    value={values.precio}
                    onValueChange={(e) => setFieldValue('precio', e.value)}
                    mode="currency"
                    currency="USD"
                    locale="es-AR"
                    className="w-full"
                  />
                  <small className="p-error">
                    <ErrorMessage name="precio" />
                  </small>
                </div>

                <div className="flex gap-2 justify-content-end mt-4">
                  <Button
                    type="submit"
                    label={id ? 'Guardar Cambios' : 'Crear Producto'}
                    icon="pi pi-check"
                    className="p-button-success"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-secondary"
                    onClick={() => navigate('/productos')}
                  />
                </div>
              </FForm>
            )}
          </Formik>
        </Card>
      )}
    </div>
  )
}

export default ProductForm
