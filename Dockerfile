# Usando uma imagem do Node.js para construir e rodar a aplicação React
FROM node:22

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de dependências e instalá-las
COPY package*.json ./
RUN yarn install

# Copiar o código da aplicação
COPY . .

# Construir a aplicação
RUN yarn run build
RUN yarn global add serve


# Expor a porta usada pela aplicação React
EXPOSE 3000

# Rodar a aplicação
CMD ["serve", "--ssl-cert", ".cert/cert.pem", "--ssl-key", ".cert/key.pem", "./build/"]
