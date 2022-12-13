FROM httpd:2.4.54

RUN apt update
RUN apt install -y ruby

RUN sed -i -e 's/#\(LoadModule cgid_module modules\/mod_cgid.so\)/\1/' conf/httpd.conf

COPY cgi-bin/hello.rb cgi-bin/
