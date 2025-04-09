import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import UnicornService from './UnicornService';
import './UnicornDetails.css';

function UnicornDetails() {
  const [unicorn, setUnicorn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUnicorn() {
      try {
        setLoading(true);
        const data = await UnicornService.getUnicorn(id);
        setUnicorn(data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener el unicornio:', err);
        setError('No se pudieron cargar los detalles del unicornio. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchUnicorn();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const renderColorSwatch = (color) => (
    <div className="color-swatch" style={{ backgroundColor: color }}></div>
  );

  const header = (
    <div className="unicorn-details-header">
      <h2>{unicorn?.name || 'Detalles del Unicornio'}</h2>
    </div>
  );

  const footer = (
    <div className="unicorn-details-footer">
      <Button 
        label="Volver a la lista" 
        icon="pi pi-arrow-left" 
        className="p-button-primary" 
        onClick={handleBack} 
      />
    </div>
  );

  if (loading) {
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
          onClick={handleBack} 
        />
      </div>
    );
  }

  if (!unicorn) {
    return (
      <div className="unicorn-details-not-found">
        <h3>Unicornio no encontrado</h3>
        <p>No pudimos encontrar el unicornio que estás buscando.</p>
        <Button 
          label="Volver a la lista" 
          icon="pi pi-arrow-left" 
          className="p-button-primary" 
          onClick={handleBack} 
        />
      </div>
    );
  }

  return (
    <div className="unicorn-details-container">
      <Card header={header} footer={footer} className="unicorn-details-card">
        <div className="unicorn-details-content">
          <div className="detail-item">
            <div className="detail-label">ID:</div>
            <div className="detail-value">{unicorn._id}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Nombre:</div>
            <div className="detail-value">{unicorn.name}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Edad:</div>
            <div className="detail-value">{unicorn.age}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Color:</div>
            <div className="detail-value">
              {unicorn.color}
              {renderColorSwatch(unicorn.color)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UnicornDetails;
