"use client";

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { apiService, User } from '../../services/apiService';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  
  // Estados para el formulario
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoEmail, setNuevoEmail] = useState<string>('');
  const [nuevoStatus, setNuevoStatus] = useState<string>('Usuario'); // o 'Cliente'
  
  // Estado para saber si estamos editando
  const [idEditando, setIdEditando] = useState<number | null>(null);

  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await apiService.getAll<User>('usuarios');
      setUsuarios(data);
    } catch (error) {
      console.error("Fallo al cargar usuarios:", error);
    }
  };

  // Función combinada para Crear o Actualizar
  const guardarUsuario = async (e: FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim() === "" || nuevoEmail.trim() === "") return;

    setCargando(true);

    try {
      const datos: User = { 
        name: nuevoNombre,
        email: nuevoEmail,
        status: nuevoStatus 
      };

      if (idEditando !== null) {
        // MODO EDICIÓN
        const actualizado = await apiService.update<User>('usuarios', idEditando, datos);
        setUsuarios((prev) => prev.map(u => u.id === idEditando ? actualizado : u));
        setIdEditando(null); // Salimos del modo edición
      } else {
        // MODO CREACIÓN
        const creado = await apiService.create<User>('usuarios', datos);
        setUsuarios((prev) => [creado, ...prev]);
      }
      
      // Limpiar el formulario
      setNuevoNombre('');
      setNuevoEmail('');
      setNuevoStatus('Usuario');
    } catch (error) {
      console.error("Fallo al guardar", error);
    } finally {
      setCargando(false);
    }
  };

  // Función para poblar el formulario cuando le dan click a editar
  const prepararEdicion = (usuario: User) => {
    setIdEditando(usuario.id!);
    setNuevoNombre(usuario.name);
    setNuevoEmail(usuario.email);
    setNuevoStatus(usuario.status || 'Usuario');
    // Hacer scroll arriba para que vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para borrar un usuario
  const borrarUsuario = async (id: number) => {
    try {
      await apiService.delete('usuarios', id);
      // Lo sacamos de la lista actual en pantalla
      setUsuarios((prev) => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Fallo al eliminar:", error);
    }
  };

  return (
    <div className="container">
      <nav className="navbar left">
        <Link href="/" className="nav-link">
          ← Volver a Vectores
        </Link>
      </nav>

      <header className="header">
        <h1>Gestión de Usuarios</h1>
        <p>CRUD de usuarios avanzado con estado completo</p>
      </header>

      {/* Observa la nueva clase `search-form-col` que puse en tu CSS */}
      <form onSubmit={guardarUsuario} className="search-form-col">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre completo..."
          className="search-input"
          disabled={cargando}
          required
        />
        
        <input
          type="email"
          value={nuevoEmail}
          onChange={(e) => setNuevoEmail(e.target.value)}
          placeholder="Correo electrónico (gmail, etc)..."
          className="search-input"
          disabled={cargando}
          required
        />

        <select 
          value={nuevoStatus} 
          onChange={(e) => setNuevoStatus(e.target.value)}
          className="search-input"
          disabled={cargando}
          style={{ cursor: 'pointer' }}
        >
          <option value="Usuario">Soy un Usuario</option>
          <option value="Cliente">Soy un Cliente</option>
        </select>

        <button type="submit" className="btn-buscar" disabled={cargando}>
          {cargando ? "Procesando..." : (idEditando !== null ? "Actualizar Datos" : "Crear Registro")}
        </button>

        {/* Botón para cancelar la edición si se arrepienten */}
        {idEditando !== null && (
          <button 
            type="button" 
            onClick={() => {
              setIdEditando(null); setNuevoNombre(''); setNuevoEmail(''); setNuevoStatus('Usuario');
            }} 
            className="btn-small" 
            style={{ backgroundColor: 'transparent', color: '#94a3b8', marginTop: '-5px' }}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <main className="results-container">
        <ul className="results-list">
           {usuarios.map((usuario) => (
             <li className="result-card" key={usuario.id}>
                
                {/* Diferenciar color según Status (Opción genial del diseño) */}
                <span className="similarity-badge" style={{ backgroundColor: usuario.status === 'Cliente' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: usuario.status === 'Cliente' ? '#34d399' : '#60a5fa' }}>
                  {usuario.status || 'Usuario'}
                </span>
                
                <div style={{ marginLeft: '10px' }}>
                  <p className="result-text">{usuario.name}</p>
                  <small style={{ color: '#94a3b8' }}>{usuario.email}</small>
                </div>
                
                {/* Contenedor de Botones de editar y borrar a la derecha */}
                <div className="card-actions">
                   <button 
                     onClick={() => prepararEdicion(usuario)} 
                     className="btn-small btn-edit"
                     disabled={cargando}
                   >
                     Editar
                   </button>
                   <button 
                     onClick={() => borrarUsuario(usuario.id!)} 
                     className="btn-small btn-danger"
                     disabled={cargando || idEditando === usuario.id}
                   >
                     Borrar
                   </button>
                </div>

             </li>
           ))}
        </ul>
      </main>
    </div>
  );
}
