#!/bin/bash

docker exec bookme_api php artisan migrate
docker exec bookme_api php artisan db:seed
docker exec bookme_api php artisan storage:link