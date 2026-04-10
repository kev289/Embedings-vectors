"use client"; // Habilita el uso de JS en el navegador

import { useEffect } from "react";

export default function Home() {
  
  useEffect(() => {
    // Capturamos los elementos del HTML por su ID
    const form = document.getElementById("search-form") as HTMLFormElement;
    const input = document.getElementById("search-input") as HTMLInputElement;
    const btn = document.getElementById("btn-buscar") as HTMLButtonElement;
    const resultsContainer = document.getElementById("results-list") as HTMLUListElement;

    if (!form || !input || !btn || !resultsContainer) return;

    // Listener para capturar el envío del formulario
    form.onsubmit = async (event: SubmitEvent) => {
      event.preventDefault(); // Evita que la página se refresque

      const palabra = input.value;
      if (palabra.trim() === "") return; // Valida que no esté vacío

      // Feedback visual: bloqueamos botones mientras la IA procesa
      btn.innerText = "Analizando...";
      btn.disabled = true;
      input.disabled = true;

      try {
        // Petición al backend enviando la palabra clave
        const respuesta = await fetch("/api/embed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: palabra }),
        });

        const data = await respuesta.json();
        resultsContainer.innerHTML = ""; // Limpia resultados viejos

        // Si hay resultados, creamos los elementos uno por uno
        if (data.results && data.results.length > 0) {
          data.results.forEach((item: any) => {
            const li = document.createElement("li");
            li.className = "result-card"; 
            
            // Inyectamos la similitud y el texto del vector
            li.innerHTML = `
              <span class="similarity-badge">${item.similarity}</span>
              <p class="result-text">${item.text}</p>
            `;
            
            resultsContainer.appendChild(li); // Lo insertamos en la lista
          });
        }

      } catch (error) {
        console.error("Fallo la conexión con la API", error);
      } finally {
        // Restauramos la interfaz al terminar
        btn.innerText = "Buscar Similitud";
        btn.disabled = false;
        input.disabled = false;
      }
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Buscador de Similitud por Vectores</h1>
        <p>Frontend TS consumiendo backend</p>
      </header>

      <form id="search-form" className="search-form">
        <input
          id="search-input"
          type="text"
          placeholder="Escribe una palabra para buscar similitud"
          className="search-input"
        />
        <button id="btn-buscar" type="submit" className="btn-buscar">
          Buscar Similitud
        </button>
      </form>

      <main className="results-container">
        <ul id="results-list" className="results-list"></ul>
      </main>
    </div>
  );
}