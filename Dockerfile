# --------> The build image
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev

# --------> The production image, USER node in alpine
FROM gcr.io/distroless/nodejs:18
USER 1000
WORKDIR /usr/src/app
COPY --chown=1000:1000 --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=1000:1000 . .
CMD ["server.js"]
