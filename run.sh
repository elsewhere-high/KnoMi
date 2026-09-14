#!/usr/bin/env bash
set -euo pipefail
KNOMI_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
KNOMI_ENV="${KNOMI_CONDA_PREFIX:-$KNOMI_ROOT/.conda-env}"
if [[ ! -x "$KNOMI_ENV/bin/node" || ! -d "$KNOMI_ENV/conda-meta" ]]; then
  printf '%s\n' 'Create the environment first: conda env create --prefix ./.conda-env --file environment.yml' >&2
  exit 1
fi
export CONDA_PREFIX="$KNOMI_ENV"
export PATH="$KNOMI_ENV/bin:$PATH"
export KNOMI_PYTHON="${KNOMI_PYTHON:-$KNOMI_ENV/bin/python}"
if [[ ! -f "$KNOMI_ROOT/apps/knomi/dist/server.js" ]]; then
  printf '%s\n' 'Build KnoMi first: conda run --prefix ./.conda-env npm run build' >&2
  exit 1
fi
mkdir -p "$KNOMI_ROOT/runtime/config" "$KNOMI_ROOT/workspace"
if [[ ! -f "$KNOMI_ROOT/runtime/config/config.json" ]]; then
  (umask 077; cp "$KNOMI_ROOT/config.example.json" "$KNOMI_ROOT/runtime/config/config.json")
fi
exec "$KNOMI_ENV/bin/node" "$KNOMI_ROOT/apps/knomi/dist/server.js" --home "$KNOMI_ROOT/runtime" --workspace "$KNOMI_ROOT/workspace" "$@"
