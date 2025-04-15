import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import UnicornService from './UnicornService';
import './UnicornDetails.css';

function UnicornDetails() {
  const [unicornio, setUnicornio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function obtenerUnicornio() {
      try {
        setCargando(true);
        const datos = await UnicornService.getUnicorn(id);
        setUnicornio(datos);
        setError(null);
      } catch (err) {
        console.error('Error al obtener el unicornio:', err);
        setError('No se pudieron cargar los detalles del unicornio. Por favor, intentá nuevamente más tarde.');
      } finally {
        setCargando(false);
      }
    }

    obtenerUnicornio();
  }, [id]);

  const volver = () => {
    navigate('/');
  };

  const mostrarColor = (color) => (
    <div className="color-swatch" style={{ backgroundColor: color }}></div>
  );

  const encabezado = (
    <div className="unicorn-details-header">
      <h2>{unicornio?.name || 'Nombre no disponible'}</h2>
    </div>
  );

  const pie = (
    <div className="unicorn-details-footer">
      <Button 
        label="Volver a la lista" 
        icon="pi pi-arrow-left" 
        className="p-button-primary" 
        onClick={volver} 
      />
    </div>
  );

  if (cargando) {
    return (
      <div className="unicorn-details-loading">
        <ProgressSpinner />
        <p>Cargando detalles del unicornio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unicorn-details-error">
        <h3>Error</h3>
        <p>{error}</p>
        <Button 
          label="Volver a la lista" 
          icon="pi pi-arrow-left" 
          className="p-button-primary" 
          onClick={volver} 
        />
      </div>
    );
  }

  if (!unicornio) {
    return (
      <div className="unicorn-details-not-found">
        <h3>Unicornio no encontrado</h3>
        <p>No pudimos encontrar el unicornio que estás buscando.</p>
        <Button 
          label="Volver a la lista" 
          icon="pi pi-arrow-left" 
          className="p-button-primary" 
          onClick={volver} 
        />
      </div>
    );
  }

  return (
    <div className="unicorn-details-container">
      <Card header={encabezado} footer={pie} className="unicorn-details-card">
        <div className="unicorn-details-content">
          <div className="detail-item">
            <div className="detail-label">ID:</div>
            <div className="detail-value">{unicornio._id || 'No disponible'}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Nombre:</div>
            <div className="detail-value">{unicornio.name || 'No disponible'}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Edad:</div>
            <div className="detail-value">{unicornio.age || 'No disponible'}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Color:</div>
            <div className="detail-value">
              {unicornio.color || 'No disponible'}
              {unicornio.color && mostrarColor(unicornio.color)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UnicornDetails;
