FROM node:22.14.0
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]