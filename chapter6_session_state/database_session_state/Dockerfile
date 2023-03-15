FROM denoland/deno:1.26.1

WORKDIR /app

RUN chown -R deno:deno /deno-dir

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

USER deno

CMD ["deno", "run", "--allow-net", "--allow-read", "src/main.ts"]
