FROM denoland/deno:1.26.1

EXPOSE 8080

WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts

RUN chown -R deno:deno /deno-dir

USER deno

CMD ["deno", "run", "--allow-net", "main.ts"]
