#!/bin/bash
set -e

sleep 1
deno run --allow-env --allow-net script/seed.ts

exec "$@"
