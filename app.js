async function obtenerEncabezados(url) {
  try {
    // Usamos un proxy público para evitar CORS
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const response = await fetch(proxy + url, { method: 'HEAD' });

    const headers = {};
    response.headers.forEach((valor, clave) => {
      headers[clave] = valor;
    });
    return headers;
  } catch (error) {
    return { error: error.message };
  }
}

// Exponer la función para usarla desde el HTML
window.obtenerEncabezados = obtenerEncabezados;