// src/products/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const API_BASE = 'https://crudcrud.com/api/9e6ce7e1504e4dae995bc3df0f51fd6d/products';

const validationSchema = Yup.object({
  nombre: Yup.string().required('Requerido'),
  precio: Yup.number()
    .required('Requerido')
    .positive('Debe ser mayor a 0')
});

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [initialValues, setInitialValues] = useState({
    nombre: '',
    precio: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Estilo de fondo igual que en ProductsView
    Object.assign(document.body.style, {
      backgroundImage: 'url("/images/carrito.jpg")',
      minHeight: '100vh',
      paddingTop: '2rem',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    });

    return () => {
      Object.assign(document.body.style, {
        backgroundImage: '',
        minHeight: '',
        paddingTop: '',
        backgroundSize: '',
        backgroundPosition: '',
        backgroundRepeat: ''
      });
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_BASE}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialValues({
          nombre: data.nombre || '',
          precio: data.precio || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar producto', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const productData = {
        nombre: values.nombre,
        precio: parseFloat(values.precio)
      };

      if (id) {
        await fetch(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        showToast('Producto actualizado');
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        showToast('Producto creado');
      }

      navigate('/productos');
    } catch (err) {
      console.error('Error al guardar producto', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <h2>{id ? 'Editar Producto' : 'Crear Producto'}</h2>
      {id && initialValues.nombre === '' ? (
        <Spinner animation="border" />
      ) : (
        <div className="bg-light text-dark p-4 rounded">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <FForm>
                <div className="mb-3">
                  <label>Nombre</label>
                  <Field className="form-control" name="nombre" />
                  <div className="text-danger">
                    <ErrorMessage name="nombre" />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Precio</label>
                  <Field
                    className="form-control"
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="precio" />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {id ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>{' '}
                <Button variant="secondary" onClick={() => navigate('/productos')}>
                  Cancelar
                </Button>
              </FForm>
            )}
          </Formik>
        </div>
      )}
    </Container>
  );
};

export default ProductForm;
