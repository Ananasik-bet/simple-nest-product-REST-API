#!/bin/sh

echo "Apply database migrations"

npx prisma generate
npx prisma db push

exec "$@"