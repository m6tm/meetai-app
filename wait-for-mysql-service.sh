#!/bin/bash

# Get database host from environment variable
MYSQL_HOST=${MYSQL_HOST}
MYSQL_PORT=${MYSQL_PORT}
MYSQL_DATABASE=${MYSQL_DATABASE}
MYSQL_USER=${MYSQL_USER}
MYSQL_PASSWORD=${MYSQL_PASSWORD}

# print MYSQL_HOST
echo "MYSQL_HOST: $MYSQL_HOST"
echo "MYSQL_PORT: $MYSQL_PORT"
echo "MYSQL_DATABASE: $MYSQL_DATABASE"
echo "MYSQL_USER: $MYSQL_USER"
echo "MYSQL_PASSWORD: $MYSQL_PASSWORD"

# Wait for the MySQL service to be ready
until mysqladmin ping -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; do
    sleep 1
done