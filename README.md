
## Práctica: Sistemas de Recomendación - Distancia Euclídea

### Integrantes del grupo
- Diego Hernández Toledo
- Jose Suarez Felipe

### ¿Qué es la distancia euclídea?
La distancia euclídea es una medida matemática que calcula la distancia "recta" entre dos puntos en un espacio multidimensional. Se utiliza frecuentemente para comparar similitud entre elementos, como usuarios o productos en sistemas de recomendación.

#### Forma simple
La forma simple de la distancia euclídea entre dos puntos \(A\) y \(B\) en un espacio de \(n\) dimensiones es:

\[
d(A, B) = \sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2 + \ldots + (a_n - b_n)^2}
\]

#### Forma media
La forma media consiste en dividir la distancia euclídea obtenida entre el número de dimensiones consideradas, para obtener un valor promedio por dimensión.

\[
d_{media}(A, B) = \frac{d(A, B)}{n}
\]

### Instrucciones de ejecución

1. Haz clic en el archivo `index.html` para abrirlo en tu navegador web.
2. En la página, introduce la matriz de entrada y completa los campos con los parámetros necesarios.
3. El sistema calculará la distancia euclídea según los datos proporcionados.
