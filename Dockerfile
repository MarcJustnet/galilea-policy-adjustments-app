# ---------- BUILDER STAGE ----------
FROM dev.justnetsystems.com:5000/cli-docker-base/app/builder:latest as builder

WORKDIR /app

# Copiar solo lo necesario para instalar dependencias (aprovecha la cache)
COPY package.json ./
COPY ./patche[s] ./patches

# Instalar todas las dependencias usando BuildKit secret
# El token nunca queda en la imagen final
RUN --mount=type=secret,id=npmtoken \
    echo "//registry.npmjs.org/:_authToken=$(cat /run/secrets/npmtoken)" > .npmrc && \
    echo "public-hoist-pattern[]=*plugin*" >> .npmrc && \
    echo "public-hoist-pattern[]=*eslint*" >> .npmrc && \
    echo "public-hoist-pattern[]=*@types*" >> .npmrc && \
    echo "public-hoist-pattern[]=*vite*" >> .npmrc && \
    echo "public-hoist-pattern[]=*tiptap*" >> .npmrc && \
    echo "public-hoist-pattern[]=vite" >> .npmrc && \
    echo "public-hoist-pattern[]=rollup" >> .npmrc && \
    echo "public-hoist-pattern[]=rimraf" >> .npmrc && \
    echo "public-hoist-pattern[]=tsc-alias" >> .npmrc && \
    echo "public-hoist-pattern[]=typescript-cp" >> .npmrc && \
    echo "public-hoist-pattern[]=pdfjs-dist" >> .npmrc && \
    pnpm install && \
    rm -f .npmrc

# Copiar el código fuente
COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./index.html ./vite.config.ts ./

# Variables de entorno de Vite
ARG VITE_ENV=dev
ARG VITE_CONFIG=vite.config.js
ARG VITE_API_BASE_URL
ARG VITE_BASE_NAME=/
ARG VITE_PORT=5173

# Hacer disponibles las variables durante el build
ENV VITE_ENV=${VITE_ENV}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_BASE_NAME=${VITE_BASE_NAME}
ENV VITE_PORT=${VITE_PORT}

RUN pnpm exec vite build --config $VITE_CONFIG --mode ${VITE_ENV}
# RUN pnpm exec just build --mode ${VITE_ENV}
RUN pnpm store prune && rm -rf /root/.npm /root/.pnpm-store

# ---------- RUNNER STAGE ----------
FROM dev.justnetsystems.com:5000/cli-docker-base/app/runner:latest

ARG NGINX_CONF
COPY $NGINX_CONF /etc/nginx/nginx.conf
ARG NGINX_TYPES
COPY $NGINX_TYPES /etc/nginx/mime.types

COPY --from=builder /app/dist /usr/share/nginx/html/

ARG VITE_PORT=5173
EXPOSE $VITE_PORT
ENTRYPOINT ["nginx", "-g", "daemon off;"]