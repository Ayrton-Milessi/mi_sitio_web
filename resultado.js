// Encabezados que queremos comparar
const encabezadosClave = ["server", "content-type", "date", "cache-control", "accept-ranges", "content-language"];

// Objeto donde guardaremos los resultados filtrados
const comparacion = {};

// Función auxiliar: filtrar encabezados clave
function filtrarEncabezados(headers) {
    const filtrados = {};
    encabezadosClave.forEach(k => {
        if (headers[k]) filtrados[k] = headers[k];
    });
    return filtrados;
}

// Construir la tabla comparativa con estilos bonitos
function mostrarComparacion() {
    let html = `
    <table style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:32px;
        box-shadow:0 2px 12px rgba(0,0,0,0.10);
        font-size:1em;
        background:#f8f9fa;
        border-radius:12px;
        overflow:hidden;
    ">
      <thead>
        <tr style="background:linear-gradient(90deg,#00b4d8 60%,#90e0ef 100%); color:#fff;">
          <th style="padding:14px;">Sitio</th>
          <th style="padding:14px;">Fetch()</th>
          <th style="padding:14px;">cURL (PHP)</th>
        </tr>
      </thead>
      <tbody>
    `;

    for (const sitio in comparacion) {
        let fetchStr = "";
        let curlStr = "";

        encabezadosClave.forEach((k, idx) => {
            fetchStr += `<div style="margin-bottom:6px;">
                <span style="background:#e7f6ff; color:#0077b6; border-radius:4px; padding:2px 8px; font-weight:bold;">${k}:</span>
                <span style="color:#333;">${comparacion[sitio].fetch[k] || "<span style='color:#bbb;'>-</span>"}</span>
            </div>`;
            curlStr  += `<div style="margin-bottom:6px;">
                <span style="background:#fff6f6; color:#e76f51; border-radius:4px; padding:2px 8px; font-weight:bold;">${k}:</span>
                <span style="color:#333;">${comparacion[sitio].curl[k] || "<span style='color:#bbb;'>-</span>"}</span>
            </div>`;
        });

        html += `<tr style="background:${Object.keys(comparacion).indexOf(sitio)%2===0 ? '#f1f8fb' : '#f6fff7'};">
            <td style="vertical-align:top; font-weight:bold; padding:12px 14px; color:#009688;">${sitio}</td>
            <td style="vertical-align:top; padding:12px 14px;">${fetchStr}</td>
            <td style="vertical-align:top; padding:12px 14px;">${curlStr}</td>
        </tr>`;
    }

    html += `</tbody></table>`;
    document.getElementById("resultados-comparacion").innerHTML = html;
}

// Hook: cuando la primera tabla ya terminó de cargarse
document.addEventListener("tablaEncabezadosLista", (e) => {
    const datos = e.detail; // viene del listarEncabezados original

    // Guardamos los filtrados
    for (const sitio in datos) {
        comparacion[sitio] = {
            fetch: filtrarEncabezados(datos[sitio].fetch || {}),
            curl:  filtrarEncabezados(datos[sitio].curl || {})
        };
    }

    // Renderizamos tabla
    mostrarComparacion();
});