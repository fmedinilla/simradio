# DEVLOG

## 25 de mayo de 2026
- se crea la página de configuracion del transceptor.
- se vincula la pagina de configuracion con el modelo de procesado del transceptor.

## 24 de mayo de 2026
- se arregla el nivel de salida del transceptor.
- se deshabilita el procesado de señal si el transceptor está apagado.
- se agrega una marca de agua de autor en el header.
- se agrega el CSS global a la página de about.

## 18 de mayo de 2026
- se agregan las llamadas de las acciones de los botones del generador.
- se vincula el estado del generador y sus displays
- se arregla el metodo togglePower del generador
- se arregla visualización cuando el modulo de modulación o rf está apagado
- se agrega que los modulos de modulación y rf se enciendan cuando se use su modo de input
- se actualizan los metodos de toggle para permitir un valor forzado
- se implementa el LED del SQ del transceptor

## 09 de mayo de 2026
- se ajusta el tamaño del panel bajo del transceptor.
- se sincroniza el estado interno del transceptor con su UI.
- se agregan los botones al generador RF (solo interfaz).
- se remplaza el screenshot del README

## 06 de mayo de 2026
- se trabaja en la reactividad del estado de las clases `GenRF`, `Transceiver` y `TIMS`.
- se actualiza la ficha técnica del proyecto y el screenshot del README.
- se implementan los displays de `GenRF`.
- se arregla el overflow del display del transceptor.
- se implementa la interfaz de los potenciometros.

## 05 de mayo de 2026
- se trabaja en el borrador de la ficha técnica del proyecto.
- se actualiza el README.
- se implementan los métodos de renderizado.
- se implementan los displays y el boton de on/off del `TIMS`.

## 03 de mayo de 2026
- se ha creado la página de about.
- se ha implementado una plantilla para la cabecera de las páginas.
- se ha creado la página de simulador a falta de hacer el renderizado de los componentes para la simulación.
- **DOCUMENTACION**: Se inicia con la ficha del proyecto `simradio.md`
    - Resumen y Motivación completados.
    - Definición de Stack tecnológico. 
    - Arquitectura

## 02 de mayo de 2026
- se ha implementado el metodo connect en `GenRF` para conectar la salida de este con la entrada del transceptor.
- se ha implementado el metodo connect en `Transceiver` para conectar la salida de este con la entrada del TIMS.
- **NOTA**: Estos metodos reciben un callback, que se ejecutará internamente si la accion llamada cambia la salida.

## 29 de abril de 2026
- Se crea un modelo para procesar la señal de RF (`RfSignal`) y convertirla en señal de audio (`BasebandAudioSignal`).
- Se implementa la clase `Transceiver` que representa un transceptor radio. Este recibe una `RfSignal` a traves de su método `input()` y devuelve una `BasebandAudioSignal` a traves de su método `output()`.

## 26 de abril de 2026
- se implementa la case `BasebandAudioSignal` que representa la señal de audio que sale de un transceptor.
- se implementa la clase `TimsAudioMonitor` que será la encargada de reproducir el audio de la señal `BasebandAudioSignal`, para esta mision se usa la función `processSignal`.
- **REFACTOR**: se cambia la función `processSignal` por una clase TIMS, que permite una mejor gestión del estado y escalabilidad.

## 25 de abril de 2026
- se implementan los metodos para obtener el valor del display (con formato para la fuente DSEG7).

## 24 de abril de 2026
- se crea la clase `RfSignal` para representar la señal que sale del generador RF.
- se crea la clase `GenRF` que simula ser el generador RF.
- se crean los metodos para manejar el input del `GenRF`.