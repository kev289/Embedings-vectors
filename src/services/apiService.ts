export interface User {
  id?: number;
  name: string;
  email: string;
  status?: string; // Ahora lo usaremos para definir si es "Usuario" o "Cliente"
}

export interface Client {
  id?: number;
  companyName: string;
  nit: string;
}

const BASE_URL = '/api';

export const apiService = {
  async getAll<T>(endpoint: string): Promise<T[]> {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error('Error al obtener datos');
    return response.json();
  },

  async create<T>(endpoint: string, data: T): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear');
    return response.json();
  },

  async update<T>(endpoint: string, id: number, data: T): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar');
    return response.json();
  },

  async delete(endpoint: string, id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${endpoint}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar');
  }
};
