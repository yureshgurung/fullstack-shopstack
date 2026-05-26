# =========================
# 1. Base Image
# =========================
FROM node:22-alpine

WORKDIR /app

# =========================
# 2. Install dependencies (better caching)
# =========================
COPY package*.json ./

# Install dependencies with cache clean
RUN npm ci

# =========================
# 3. Copy source code
# =========================
COPY . .

# =========================
# 4. Expose Vite dev server port
# =========================
EXPOSE 5173

# =========================
# 5. Run dev server
# =========================
CMD ["npm", "run", "dev", "--", "--host"]