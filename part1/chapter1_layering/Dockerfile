FROM denoland/deno:1.26.1

EXPOSE 8080

WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

USER deno

CMD ["deno", "run", "--allow-net", "main.ts"]
