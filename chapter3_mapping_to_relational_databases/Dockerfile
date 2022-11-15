FROM denoland/deno:1.26.1

WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts

RUN chown -R deno:deno /deno-dir

USER deno
