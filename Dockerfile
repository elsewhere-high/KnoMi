FROM node:22-bookworm AS base
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl make g++ unzip zip bash bubblewrap socat ripgrep fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-$(uname -m).sh" -o /tmp/miniforge.sh \
    && bash /tmp/miniforge.sh -b -p /opt/conda \
    && rm /tmp/miniforge.sh \
    && /opt/conda/bin/conda create -y --override-channels -c conda-forge -n knomi python=3.12 \
    && /opt/conda/bin/conda clean -afy
ENV CONDA_PREFIX=/opt/conda/envs/knomi
ENV PATH="/opt/conda/envs/knomi/bin:/opt/conda/bin:${PATH}" \
    KNOMI_PYTHON=/opt/conda/envs/knomi/bin/python \
    npm_config_python=/opt/conda/envs/knomi/bin/python

FROM base AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/knomi/package.json apps/knomi/tsconfig.json apps/knomi/
COPY apps/knomi/web/package.json apps/knomi/web/tsconfig.json apps/knomi/web/
COPY apps/showcase/package.json apps/showcase/
COPY vendor/ vendor/
RUN npm ci --no-audit --no-fund
COPY apps/knomi/src apps/knomi/src/
COPY apps/knomi/scripts apps/knomi/scripts/
COPY apps/knomi/presets apps/knomi/presets/
COPY apps/knomi/web/src apps/knomi/web/src/
COPY apps/knomi/web/public apps/knomi/web/public/
COPY apps/knomi/web/vite.config.ts apps/knomi/web/index.html apps/knomi/web/
RUN npm run build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    KNOMI_HOME=/var/lib/knomi \
    KNOMI_CONFIG_DIR=/etc/knomi \
    KNOMI_DATA_DIR=/var/lib/knomi/data \
    KNOMI_SKILLS_DIR=/var/lib/knomi/skills \
    KNOMI_WORKSPACE_DIR=/srv/knomi-workspace \
    KNOMI_PORT=3000
# Preserve workspace dependency placement, including nested SDK versions.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/knomi/node_modules ./apps/knomi/node_modules
COPY --from=build /app/apps/knomi/dist ./apps/knomi/dist
COPY --from=build /app/apps/knomi/web/dist ./apps/knomi/web/dist
COPY --from=build /app/apps/knomi/scripts ./apps/knomi/scripts
COPY --from=build /app/apps/knomi/presets ./apps/knomi/presets
COPY --from=build /app/apps/knomi/package.json ./apps/knomi/package.json
COPY --from=build /app/package.json ./package.json
COPY LICENSE ./LICENSE
COPY vendor/*LICENSE* vendor/THIRD_PARTY_NOTICES.md ./vendor/
RUN mkdir -p /etc/knomi /var/lib/knomi/data /var/lib/knomi/skills /srv/knomi-workspace
EXPOSE 3000
CMD ["node", "apps/knomi/dist/server.js"]
