FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Expose the application port
EXPOSE 3000

ENV JSON_LOGGING=true
# Command to run the application
CMD ["node", "dist/main"]