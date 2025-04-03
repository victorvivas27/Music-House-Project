# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json .
COPY package-lock.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos el proyecto (genera la carpeta dist/)
RUN npm run build

# Etapa final: usar Nginx para servir archivos estáticos
FROM nginx:alpine

# Copiamos el build generado (dist) a la carpeta que sirve Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 por defecto de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]