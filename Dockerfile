# ==============================================================================
# Dockerfile for Resumake (Next.js + Tectonic LaTeX compilation engine)
# Compatible with: Fly.io, Railway, Render, AWS Cloud Run, or local Docker
# ==============================================================================

# ---- Stage 1: Base & Tectonic Installer ----
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Install curl, certificates, and libraries needed by Tectonic (fontconfig, harfbuzz, openssl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    libfontconfig1 \
    libgraphite2-3 \
    libharfbuzz0b \
    libicu72 \
    libssl3 \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Install static Tectonic (musl binary has zero glibc version dependency and works on all Linux environments)
RUN ARCH=$(uname -m) \
    && if [ "$ARCH" = "x86_64" ]; then TECTONIC_ARCH="x86_64-unknown-linux-musl"; \
       elif [ "$ARCH" = "aarch64" ]; then TECTONIC_ARCH="aarch64-unknown-linux-musl"; \
       else echo "Unsupported architecture: $ARCH" && exit 1; fi \
    && curl -fsSL "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-${TECTONIC_ARCH}.tar.gz" | tar -xz -C /usr/local/bin \
    && tectonic --version

# Pre-warm Tectonic bundle cache so standard packages/formats are baked into the image
# This prevents cold-start request timeouts on first compilation
RUN echo '\\documentclass{article}\\begin{document}init\\end{document}' > /tmp/init.tex \
    && tectonic /tmp/init.tex \
    && rm -f /tmp/init.*

# ---- Stage 2: Dependencies ----
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 3: Builder ----
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 4: Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application and node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
