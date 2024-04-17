FROM --platform=linux/amd64 node:18-alpine as build

WORKDIR /apps

COPY . .

# Install PNPM
RUN npm install -g pnpm

RUN pnpm install
#RUN pnpm build:ci --filter=./apps/rio-app
RUN pnpm run:api-rio

RUN ls dist/src -al

CMD ["node", "dist/src/main.js"]
