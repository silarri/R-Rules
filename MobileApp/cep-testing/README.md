# Prueba de las tecnologías CEP en Android
Durante la realización del proyecto se han estudiado y probado dos tecnologías de procesamiento de eventos complejos (CEP), Esper y Siddhi.

En este directorio se han incluido varios **archivos comprimidos** que contienen los proyectos de Android Studio de las pruebas de dichas tecnologías.
Para probarlos pueden descomprimirse y abrirlos con AndroidStudio.

Todos estos proyectos tienen una interfaz común con tres botones para poder iniciar el motor de proesamiento, pararlo y enviarle eventos para que los procese. 

De Esper se probaron tres versiones distintas y de Siddhi una.


## Asper (tfg-test-asper.zip)
Asper es una adaptación de Esper para que funcione en un dispositivo móvil, ya que soluciona problemas con algunos paquetes de Java.

Asper consiguió utilizarse en un dispositivo móvil. El problema es que utiliza una versión muy antigua de Esper (versión 4.8.0 y la última es la 8.7.0).
Esto último fue el motivo por el que se descartó su utilización.

Puede encontrarse en https://github.com/mobile-event-processing/Asper .


## Esper 7.1 (tfg-test-esper7.1.zip)
El siguiente paso fue intentar probar una versión de Esper directamente. Se eligió la 7.1 porque era una de las más recientes.

No se consiguió éxito en su prueba porque había problemas con paquetes de Java que no están disponibles para Android.

## Esper 8.7 (tfg-test-esper8.7.zip)
Esta es la versión más reciente de Esper y en su página oficial indican que hay varios cambios con respecto a las versiones anteriores. 
(https://www.espertech.com/esper/esper-information-about-esper-version-8/)

Tampoco se consiguió que funcionara en Android porque había problemas con paquetes de Java no disponibles para Android.


## Siddhi (tfg-test-siddhi.zip)
Siddhi es la otra tecnología CEP capaz de funcionar en Android. 

En este caso, la prueba se completó con éxito y se decidió optar por esta opción.

En su proyecto se incluye la tecnología como un servicio de Android que lanza un thread para que no realice las tareas 
sobre el hilo principal (MAIN THREAD o UI THREAD).