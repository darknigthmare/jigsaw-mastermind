#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
project_dir="$root_dir/godot-fps"
output_dir="$root_dir/public/godot-station"
godot_bin="${GODOT_BIN:-godot}"

if [[ -n "${GODOT_RUNTIME_DIR:-}" ]]; then
  export XDG_DATA_HOME="$GODOT_RUNTIME_DIR/data"
  export XDG_CACHE_HOME="$GODOT_RUNTIME_DIR/cache"
  export XDG_CONFIG_HOME="$GODOT_RUNTIME_DIR/config"
fi

version="$("$godot_bin" --version)"
if [[ "$version" != 4.6.3.stable.* ]]; then
  printf 'Godot 4.6.3 stable expected, found %s\n' "$version" >&2
  exit 1
fi

temporary_dir="$(mktemp -d)"
trap 'rm -rf -- "$temporary_dir"' EXIT

"$godot_bin" --headless --path "$project_dir" --editor --import 2>&1 | tee "$temporary_dir/import.log"
"$godot_bin" --headless --path "$project_dir" --export-release Web "$temporary_dir/index.html" 2>&1 | tee "$temporary_dir/export.log"
if grep -Eq '(^|[[:space:]])(SCRIPT ERROR:|ERROR:)' "$temporary_dir/import.log" "$temporary_dir/export.log"; then
  printf '%s\n' 'Godot reported errors. The previous Web build is still available.' >&2
  exit 1
fi

files=(index.html index.js index.wasm index.pck index.audio.worklet.js index.audio.position.worklet.js)
for file in "${files[@]}"; do
  test -s "$temporary_dir/$file"
done
mkdir -p -- "$output_dir"
for file in "${files[@]}"; do
  install -m644 -- "$temporary_dir/$file" "$output_dir/$file"
done
install -m644 -- "$project_dir"/licenses/GODOT-*.txt "$output_dir"
