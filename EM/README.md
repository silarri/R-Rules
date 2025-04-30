# CARS-em

Para desarrollar y ejecutar el proyecto se ha utilizado IntelliJ IDEA.

Ejecutar desde la herramienta y acceder a:
http://localhost:8080/

# API:
API con Swagger y Open API 3.0 disponible una vez lanzado el servidor  en:
http://localhost:8080/swagger-ui.html


# Base de datos: PostgreSQL
## EN HEROKU (ACTUAL):
Conectarse desde Heroku y ver ahí las credenciales de la BD 


## CON DOCKER:
Para lanzar la base de datos (local) se ha utilizado docker.

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

Pueden accederse a ellos en el directorio /data de este repositorio.
# Prototipo móvil
El repositorio del prototipo móvil desarrollado es: https://github.com/silarri/CARS-Prototypes.git

