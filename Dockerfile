FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY src ./src

ENV NODE_ENV=production
ENV WEIGHTEDSHARES_MCP_URL=https://weightedshares.com/mcp

USER node

CMD ["node", "/app/src/stdio-bridge.mjs"]
