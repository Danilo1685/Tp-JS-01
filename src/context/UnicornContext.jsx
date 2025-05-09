// src/context/UnicornContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UnicornContext = createContext();
const API_URL = 'https://crudcrud.com/api/d0a2e735c8fc4300a439b9e2acb53110/unicornios';

export const UnicornProvider = ({ children }) => {
  const [unicorns, setUnicorns] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUnicorns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setUnicorns(res.data);
    } catch (err) {
      console.error('Error al cargar unicornios', err);
    } finally {
      setLoading(false);
    }
  };

  const createUnicorn = async (newUnicorn) => {
    try {
      const res = await axios.post(API_URL, newUnicorn);
      setUnicorns((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error al crear unicornio', err);
    }
  };

  const editUnicorn = async (id, updatedUnicorn) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedUnicorn);
      setUnicorns((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...updatedUnicorn } : u))
      );
    } catch (err) {
      console.error('Error al editar unicornio', err);
    }
  };

  const deleteUnicorn = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
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
