//npm install formik yup

// src/unicorns/UnicornForm.jsx
import React, { useEffect, useState } from 'react';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useUnicorns } from '../context/UnicornContext';
import { useTheme } from '../context/Context';

const validationSchema = Yup.object({
  nombre: Yup.string().required('Requerido'),
  color: Yup.string().required('Requerido'),
  edad: Yup.number().required('Requerido').positive('Debe ser mayor a 0'),
});

const UnicornForm = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { unicorns, createUnicorn, editUnicorn } = useUnicorns();

  const [initialValues, setInitialValues] = useState({
    nombre: '',
    color: '',
    edad: '',
  });

  useEffect(() => {
    if (id) {
      const found = unicorns.find((u) => u._id === id);
      if (found) {
        setInitialValues({
          nombre: found.nombre,
          color: found.color,
          edad: found.edad,
        });
      }
    }
  }, [id, unicorns]);

  const handleSubmit = async (values) => {
    if (id) {
      await editUnicorn(id, values);
    } else {
      await createUnicorn(values);
    }
    navigate('/unicornios');
  };

  return (
    <Container>
      <h2>{id ? 'Editar Unicornio' : 'Crear Unicornio'}</h2>
      {id && initialValues.nombre === '' ? (
        <Spinner animation="border" />
      ) : (
        <div className={darkMode ? 'bg-dark text-light p-4 rounded' : 'bg-light text-dark p-4 rounded'}>
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
                <label>Color</label>
                <Field className="form-control" name="color" />
                <div className="text-danger">
                  <ErrorMessage name="color" />
                </div>
              </div>

              <div className="mb-3">
                <label>Edad</label>
                <Field className="form-control" name="edad" type="number" />
                <div className="text-danger">
                  <ErrorMessage name="edad" />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {id ? 'Guardar Cambios' : 'Crear'}
              </Button>{' '}
              <Button variant="secondary" onClick={() => navigate('/unicornios')}>
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

export default UnicornForm;
