# 1) EM

Para desarrollar y ejecutar el Environment Manager (EM) se ha utilizado IntelliJ IDEA.

Ejecutar desde la herramienta y acceder a:
http://localhost:8080/

## API del EM
API con Swagger y Open API 3.0 disponible una vez lanzado el servidor  en:
http://localhost:8080/swagger-ui.html

## Base de datos del EM (PostgreSQL)
Para lanzar la base de datos (local) se ha utilizado Docker.
Ejecutamos lo siguiente:
```
cd database
docker-compose up
```
### Acceso con herramientas extenas (por ejemplo DataGrip)

Una vez la base de datos esté lanzada, para visualizar el contenido de la BD accedemos a **http://localhost:8082** e introducimos lo siguiente:

- Motor de base de datos: PosgreSQL
- Servidor: db
- Usuario: adminCARS
- Contraseña: CARSdb123
- Base de datos: CARSdb

### Acceso por terminal:
Ejecutar:
```
psql postgresql://adminCARS@localhost:5432/CARSdb
```
NOTA: instalar lo que pida (psql)

### Datos de prueba utilizados
Los datos relacionados con las actividades han sido obtenidos del portal de datos abiertos de Madrid. 
Los datos de valoraciones son datos falsos que hemos generado.
Pueden accederse a ellos en el directorio /data del repositorio.

### Notas viejas:

Con Heroku, conectarse desde Heroku y ver ahí las credenciales de la BD.

# 2) Aplicación móvil

## Procedimiento de configuración e instalación

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

## Configuración de _Gestores de Entorno_

Para configurar la dirección de los *Gestores de Entorno* del sistema será necesario modificar el fichero `CARSProject/em/ems.json` adaptando la información conforme a los gestores deseados. 

## Prueba del prototipo

### Versiones
- Android Studio: 4.1.2
- Node: 10.24.0
- React-Native: 0.55.4
- React-Native CLI: 2.0.1
- Java: 1.8

Las dependencias de las librerías pueden consultarse en el fichero package.json 

### Pasos

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
6. Instalar la aplicación en el dispositivo desde Android Studio (versión utilizada: 4.1.2). Abrir CARS-Prototypes/android con Android Studio.
7. Una vez la aplicación ha sido instalada en el dispositivo, para lanzarla ejecutar:
```
react-native run-android
```

NOTA: tanto si se prueba en un dispositivo físico (no un emulador) como si se prueba con emulador:
1. Asegurarse de que el dispositivo y el PC están conectados a la misma red WiFi (no es necesario si se prueba con el emulador).
2. Ejecutar: adb reverse tcp:8081 tcp:8081 (react-native).
3. Ejecutar: adb reverse tcp:8080 tcp:8080 (para comunicación con el EM).

##Resumen de pasos a ejecutar en la máquina virtual
```
./EM.sh
studio.sh
./MobileApp.sh
```

Terminal 1:
---
```
cd R-Rules/EM
cd database
sudo docker-compose up
```
----
You can test the connection with the DB as follows:
```
psql postgresql://adminCARS@localhost:5432/CARSdb
```
(password: CARSdb123)
You can see all the tables with:
```
\dt
```
----
If you get this error when connecting to the DB:
Error: You must install at least one postgresql-client-<version> package
Then do this first:
```
sudo apt-get install postgresql-client
```
----
If you have not created the database, first you have to create the tables:
https://github.com/irefu/CARS-em/blob/main/database/createTables.sql
Then in table "user", you need to create a user with email "test@gmail.com" and password "1234test5678". Careful: the password must be stored encrypted, in the Modular Crypt Format.
----
If you want to visualize the DB:
```
datagrip.sh
```

Terminal 2:
```
idea.sh
```
Ejecutar el proyecto (com.example.CARSEm.CarsEmApplication, in folder src/main/java/CarsEmApplication.java)
Desde un navegador web, conectarse a http://localhost:8080/swagger-ui.html para ver si está activo y accesible el API de Swagger.

Terminal 3:
```
cd R-Rules/MobileApp
react-native start
```

Terminal 4:
```
studio.sh
```
Start emulator ("Tools" -> "AVD Manager")
---
Click on "Logcat" in the status bar if you want to see the emulated device's console messages.

Terminal 5:
```
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8080 tcp:8080
cd R-Rules/MobileApp
react-native run-android
```

## Notas adicionales
- El login está deshabilitado (el login anterior funcionaba con Facebook, ya no está disponible para las características de este proyecto). Actualmente se crea un usuario con email "test@gmail.com" y contraseña: "1234test5678" (desde el código).
