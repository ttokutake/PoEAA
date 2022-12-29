FROM node:18.12.1 AS node

FROM httpd:2.4.54

RUN sed -i -e 's/#\(LoadModule cgid_module modules\/mod_cgid.so\)/\1/' conf/httpd.conf

COPY cgi-bin/hello.mjs cgi-bin/
COPY --from=node /usr/local/bin/node /usr/bin/node
