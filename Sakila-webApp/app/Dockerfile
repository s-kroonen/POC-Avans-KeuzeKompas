FROM node:20-alpine
WORKDIR /usr/src/app
# Install deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# App source
COPY src ./src
# COPY public ./public
# COPY views ./views
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/server.js"]