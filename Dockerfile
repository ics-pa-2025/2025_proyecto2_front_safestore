## Multi-stage Dockerfile for Vite + React
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --silent

# Copiar el código fuente y el .env
COPY . .
# Copiar .env y exportarlo para que Vite lo use
# Esto permite que VITE_API_URL y otras variables sean tomadas del archivo
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY .env .env

# Cargar variables del .env y construir
RUN export $(grep -v '^#' .env | xargs) && npm run build

## Imagen de producción
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Para soporte de runtime env (opcional)
COPY nginx-entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
