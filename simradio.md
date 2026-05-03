# SimRadio
Entorno web para simulación de pruebas Rx en transceptores radio.

## Motivación
Necesidad de mejorar las habilidades del personal técnico en un entorno seguro y controlado.

## Solución
![Status: In Progress](https://img.shields.io/badge/Status-In_Progress-orange)

Se desarrolla una aplicación web donde se puede simular la realización de pruebas Rx en un transceptor de radio. La solución cuenta con tres componentes básicos: un generador de radiofrecuencia, un transceptor de radio, y un TIMS.

Desde el generador de radiofrecuencia podemos crear una señal RF, que será la entrada del transceptor. Éste, procesará la señal de entrada y otorgará una señal de audio. Con el TIMS, veremos la frecuencia del tono y la calidad.

## Stack detallado
- **Webapp**: HTML, CSS y JS

## Arquitectura 
### Webapp
La webapp está estructurada en tres páginas HTML:
- **index.html**: Entorno de simulación
- **configuration.hmtl**: Pagina para configurar el comportamiento del transceptor y del modelo de procesamiento de señal.
- **about.html**: Página para mostrar más acerca del proyecto.

Las tres páginas estan unidas entre sí mediante un componente común: el header. Este contiene enlaces a cada una de estas páginas, permitiendo la navegación entre ellas.

### Señal y procesamiento
![Status: In Progress](https://img.shields.io/badge/Status-In_Progress-orange)

Generador ---[señal rf]---> Transceptor ---[señal audio]---> TIMS

## Logros
![Status: TODO](https://img.shields.io/badge/Status-To_Do-red)