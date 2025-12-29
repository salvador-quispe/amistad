# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=build /app/dist/recuerdos-inocentes/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
