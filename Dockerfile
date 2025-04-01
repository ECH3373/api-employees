FROM node:20.10.0
WORKDIR /employees

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]