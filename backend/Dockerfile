FROM composer:2.0 as build
RUN apk update && apk add --no-cache \
    openldap-dev \
    && docker-php-ext-install ldap \
    && docker-php-ext-configure ldap

COPY . /app/
RUN composer update && composer install --prefer-dist --optimize-autoloader --no-interaction

FROM php:8.0-apache-buster as production

ENV APP_ENV=local
ENV APP_DEBUG=true

RUN apt-get update && \
    apt-get install vim redis libldap-common libldap2-dev -y && \
    docker-php-ext-install pcntl ldap pdo pdo_mysql && \
    docker-php-ext-configure ldap && \
    docker-php-ext-configure pcntl --enable-pcntl

COPY --from=build /app /var/www/html
COPY .env.dev /var/www/html/.env
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf


RUN chmod 777 -R /var/www/html/storage/ && \
    chown -R www-data:www-data /var/www/ && \
    a2enmod rewrite