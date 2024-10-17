# FROM node:18
# WORKDIR /server
# COPY src/ /server/src
# COPY prisma/ /server/prisma
# COPY package.json /server
# RUN npm install
# RUN npx prisma generate

FROM node:18-alpine
WORKDIR '/server'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]