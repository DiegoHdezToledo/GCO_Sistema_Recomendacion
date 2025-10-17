document.getElementById("processBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput").files[0];
  const k = parseInt(document.getElementById("kInput").value);
  const predType = document.getElementById("predInput").value;
  const resultsDiv = document.getElementById("results");

  if (!fileInput) {
    alert("Por favor, sube un fichero de matriz.");
    return;
  }

  const text = await fileInput.text();
  const lines = text.trim().split("\n").map(line => line.trim().split(/\s+/));
  const minRating = parseFloat(lines[0][0]);
  const maxRating = parseFloat(lines[1][0]);
  const matrix = lines.slice(2).map(row => row.map(x => x === "-" ? null : parseFloat(x)));

  // Calcular similitud entre usuarios (distancia euclídea)
  const similarities = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      let sum = 0;
      let count = 0;
      for (let k = 0; k < matrix[i].length; k++) {
        if (matrix[i][k] != null && matrix[j][k] != null) {
          sum += Math.pow(matrix[i][k] - matrix[j][k], 2);
          count++;
        }
      }
      const dist = count > 0 ? Math.sqrt(sum) : Infinity;
      const sim = dist === Infinity ? 0 : 1 / (1 + dist);
      similarities.push({ u1: i, u2: j, dist, sim });
    }
  }

  // Seleccionar vecinos
  const neighbors = matrix.map((_, i) => {
    const sims = similarities.filter(s => s.u1 === i || s.u2 === i)
      .map(s => ({
        user: s.u1 === i ? s.u2 : s.u1,
        sim: s.sim
      }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, k);
    return sims;
  });

  // Predicciones
  const predictedMatrix = matrix.map(row => [...row]);
  for (let u = 0; u < matrix.length; u++) {
    for (let i = 0; i < matrix[u].length; i++) {
      if (matrix[u][i] == null) {
        const numerador = neighbors[u].reduce((acc, n) => {
          const val = matrix[n.user][i];
          return val != null ? acc + n.sim * val : acc;
        }, 0);
        const denominador = neighbors[u].reduce((acc, n) => {
          const val = matrix[n.user][i];
          return val != null ? acc + n.sim : acc;
        }, 0);
        predictedMatrix[u][i] = denominador > 0 ? (numerador / denominador).toFixed(2) : "-";
      }
    }
  }

  // Mostrar resultados
  let html = `<h3> Matriz original</h3>${renderTable(matrix, true)}`;
  html += `<h3> Similitudes (Distancia Euclídea)</h3>${renderSims(similarities)}`;
  html += `<h3> Vecinos seleccionados</h3>${renderNeighbors(neighbors)}`;
  html += `<h3>Matriz con predicciones</h3>${renderTable(predictedMatrix, false)}`;

  // Recomendaciones
  const recs = [];
  for (let u = 0; u < predictedMatrix.length; u++) {
    let bestItem = null;
    let bestVal = -1;
    for (let i = 0; i < predictedMatrix[u].length; i++) {
      if (matrix[u][i] == null && predictedMatrix[u][i] !== "-") {
        const val = parseFloat(predictedMatrix[u][i]);
        if (val > bestVal) {
          bestVal = val;
          bestItem = i + 1;
        }
      }
    }
    if (bestItem)
      recs.push(`Usuario ${u + 1} → Ítem ${bestItem} (predicción: ${bestVal.toFixed(2)})`);
  }

  if (recs.length)
    html += `<h3>Recomendaciones</h3><ul>${recs.map(r => `<li>${r}</li>`).join("")}</ul>`;
  else
    html += `<h3>Recomendaciones</h3><p>No hay ítems por predecir.</p>`;

  resultsDiv.innerHTML = html;
});

function renderTable(matrix, markMissing) {
  let html = `<div style="overflow-x:auto; max-width:100%;">`;
  html += "<table style='min-width:600px; max-width:100%; table-layout:auto;'>";
  html += "<tr><th>Usuario</th>";
  for (let i = 0; i < matrix[0].length; i++) html += `<th>Ítem ${i + 1}</th>`;
  html += "</tr>";

  matrix.forEach((row, u) => {
    html += `<tr><td>U${u + 1}</td>`;
    row.forEach(v => {
      if (v == null && markMissing) html += `<td class="missing">-</td>`;
      else if (v == null) html += `<td>-</td>`;
      else html += `<td>${v}</td>`;
    });
    html += "</tr>";
  });
  html += "</table></div>";
  return html;
}

function renderSims(sims) {
  let html = "<table><tr><th>Par</th><th>Distancia</th><th>Similitud</th></tr>";
  sims.forEach(s => {
    html += `<tr><td>U${s.u1 + 1}-U${s.u2 + 1}</td><td>${s.dist.toFixed(2)}</td><td>${s.sim.toFixed(2)}</td></tr>`;
  });
  html += "</table>";
  return html;
}

function renderNeighbors(neighbors) {
  let html = "<table><tr><th>Usuario</th><th>Vecinos</th></tr>";
  neighbors.forEach((n, i) => {
    const desc = n.map(x => `U${x.user + 1} (${x.sim.toFixed(2)})`).join(", ");
    html += `<tr><td>U${i + 1}</td><td>${desc}</td></tr>`;
  });
  html += "</table>";
  return html;
}
