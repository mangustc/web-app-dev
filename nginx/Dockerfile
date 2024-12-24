FROM nginx:1.27.3

WORKDIR /

COPY ./nginx/nginx.conf /etc/nginx

ENTRYPOINT ["nginx", "-g", "daemon off;"]
