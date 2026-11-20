#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_dir="$(mktemp -d)"
trap 'rm -rf -- "$runtime_dir"' EXIT

export XDG_DATA_HOME="$runtime_dir/data"
export XDG_CACHE_HOME="$runtime_dir/cache"
export XDG_CONFIG_HOME="$runtime_dir/config"
"${GODOT_BIN:-godot}" --headless --path "$root_dir/godot-fps" --script res://tests/station_route_test.gd
