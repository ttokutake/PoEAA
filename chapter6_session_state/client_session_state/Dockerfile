FROM denoland/deno:1.26.1

WORKDIR /app

RUN chown -R deno:deno /deno-dir

USER deno

CMD ["deno", "run", "--allow-net", "--allow-read", "src/main.ts"]
