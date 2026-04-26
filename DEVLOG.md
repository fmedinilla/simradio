# DEVLOG

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