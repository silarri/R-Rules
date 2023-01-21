# CARSProject
## Push based Context Aware Recommendation System

Autor: Manuel Herrero

## Notas viejas
### Procedimiento de configuración e instalación

Para instalar la aplicación en un dispositvo Android real o simulado es necesario instalar [Android Studio](https://developer.android.com/studio/?hl=es-419) y [Node](https://nodejs.org/es/).

En primer lugar es necesario instalar React Native CLI
```
npm install -g react-native-cli
```

Añade la siguientes líneas a tu fichero `$HOME/.bash_profile`:
```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Descarga este proyecto y viaja a la dirección de la descarga:
```
cd CARSProject
react-native run-android
```
Para completar la instalación de la aplicación es necesario realizar la instalación también desde Android Studio. Desde Android Studio seleccione la opción de abrir proyecto existente de la dirección `CARSProject/android`.

### Configuración de _Gestores de Entorno_

Para configurar la dirección de los *Gestores de Entorno* del sistema será necesario modificar el fichero `CARSProject/em/ems.json` adaptando la información conforme a los gestores deseados. 


# Prueba Prototipo: 2021
Autor: Irene Fumanal Lacoma

## Versiones
- Android Studio: 4.1.2
- Node: 10.24.0
- React-Native: 0.55.4
- React-Native CLI: 2.0.1
- Java: 1.8

Las dependencias de las librerías pueden consultarse en el fichero package.json 

## Pasos

1. Clonar el repositorio. 
2. Instalar React Native CLI como se ha indicado antes
3. Comprobar que la versión de node es la 10
```
node -v
```   
4. Para instalar las dependencias ejecutar (dentro del proyecto de React-Native):
```
cd CARSProject
npm install
npx jetify
```
5. En una terminal ejecutar lo siguiente dentro del proyecto de React Native:
```
react-native start
```
6. Instalar la apliación en el dispositivo desde Android Studio (versión utilizada: 4.1.2). Abrir CARS-Prototypes/android con Android Studio.
7. Una vez la apliación ha sido instalada en el dispositivo, para lanzarla ejecutar:
```
react-native run-android
```

NOTA: si se prueba en un dispositivo físico (no un emulador):
1. Asegurarse de que el dispositivo y el PC están conectados al mismo wifi
2. Ejecutar: adb reverse tcp:8081 tcp:8081 (react-native)
3. Ejecutar: adb reverse tcp:8080 tcp:8080 (para comunicación con el EM)


# Gestor de Entorno
El repositorio del Gestor de Entorno desarrollado es: https://github.com/irefu/CARS-em.git 

# Notas adicionales
- El login está deshabilitado (el login anterior funcionaba con Facebook, ya no está disponible para las características de este proyecto). Actualmente se crea un usuario con email "test@gmail.com" y contraseña: "1234test5678" (desde el código).
