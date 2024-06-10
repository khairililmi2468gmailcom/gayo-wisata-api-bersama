# Stage 1: Install dependencies
FROM node:17-alpine as dependencies
WORKDIR /app
COPY package.json .
RUN npm install --only=prod

# Stage 2: Build production image
FROM node:17-alpine as builder
WORKDIR /app
COPY --from=dependencies /app .
COPY . .
RUN npm run build

# Stage 3: Final image
FROM node:17-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "start"]

# Command to check Node.js version
RUN node --version
