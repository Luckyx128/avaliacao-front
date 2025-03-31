# Estágio de build
FROM node:20-alpine as build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY app/package.json app/package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY app/ .

# Constrói a aplicação React
RUN npm run build

# Usando uma imagem Nginx para servir a aplicação
FROM nginx:alpine

# Copia os arquivos construídos para o diretório de serviço do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 8007
EXPOSE 8080

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
