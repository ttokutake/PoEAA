#!/bin/bash
set -e

deno run --allow-env --allow-net script/seed.ts

exec "$@"
