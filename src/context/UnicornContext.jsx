// src/context/UnicornContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const UnicornContext = createContext();
const API_URL = 'https://crudcrud.com/api/9e6ce7e1504e4dae995bc3df0f51fd6d/unicornios';

export const UnicornProvider = ({ children }) => {
  const [unicorns, setUnicorns] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUnicorns = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setUnicorns(data);
    } catch (err) {
      console.error('Error al cargar unicornios', err);
    } finally {
      setLoading(false);
    }
  };

  const createUnicorn = async (newUnicorn) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUnicorn),
      });
      const data = await res.json();
      setUnicorns((prev) => [...prev, data]);
    } catch (err) {
      console.error('Error al crear unicornio', err);
    }
  };

  const editUnicorn = async (id, updatedUnicorn) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUnicorn),
      });
      setUnicorns((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...updatedUnicorn } : u))
      );
    } catch (err) {
      console.error('Error al editar unicornio', err);
    }
  };

  const deleteUnicorn = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setUnicorns((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Error al eliminar unicornio', err);
    }
  };

  useEffect(() => {
    getUnicorns();
  }, []);

  return (
    <UnicornContext.Provider
      value={{
        unicorns,
        loading,
        getUnicorns,
        createUnicorn,
        editUnicorn,
        deleteUnicorn,
      }}
    >
      {children}
    </UnicornContext.Provider>
  );
};

export const useUnicorns = () => useContext(UnicornContext);
