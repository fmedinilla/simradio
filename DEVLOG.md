# DEVLOG

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