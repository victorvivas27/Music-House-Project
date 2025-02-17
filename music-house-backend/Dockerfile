# Usa una imagen base de Maven y Java JDK con la versión que necesitas
FROM maven:3.8.4-openjdk-17 AS build

# Establece el directorio de trabajo en /home/app
WORKDIR /home/app

# Copia todo el código fuente al contenedor
COPY src src

# Copia el archivo pom.xml para descargar las dependencias
COPY pom.xml .

# Empaqueta la aplicación
RUN mvn package

# Inicia una nueva etapa de construcción para el contenedor de la aplicación
FROM openjdk:17.0.1-jdk

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia el archivo JAR de la aplicación al contenedor y renómbralo
COPY --from=build /home/app/target/music-house-0.0.1-SNAPSHOT.jar music-house-1.0.0.jar

# Exponer el puerto en el que la aplicación se ejecutará
#EXPOSE 8080

# Ejecutar la aplicación Spring Boot al iniciar el contenedor
CMD ["java", "-jar", "music-house-1.0.0.jar"]