#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
output_path="${1:-$project_root/SiteGervas-Hostinger-Node-ready.zip}"
release_dir="${RUNNER_TEMP:-/tmp}/sitegervas-hostinger-release"

case "$release_dir" in
  ""|"/"|"$project_root")
    echo "Unsafe release directory: $release_dir" >&2
    exit 1
    ;;
esac

rm -rf -- "$release_dir"
mkdir -p "$release_dir/frontend"

cp -R "$project_root/dist" "$release_dir/dist"
cp -R "$project_root/server" "$release_dir/server"
cp -R "$project_root/frontend/public" "$release_dir/frontend/public"
cp -R "$project_root/frontend/src" "$release_dir/frontend/src"

for file in .gitignore .oxlintrc.json index.html package-lock.json package.json README.md vite.config.js; do
  cp "$project_root/frontend/$file" "$release_dir/frontend/$file"
done

for file in .env.example HOSTINGER.md package-lock.json package.json README.md; do
  cp "$project_root/$file" "$release_dir/$file"
done

rm -f -- "$output_path"
if command -v python3 >/dev/null 2>&1 && python3 --version >/dev/null 2>&1; then
  python_bin=python3
else
  python_bin=python
fi

(
  cd "$release_dir"
  "$python_bin" -m zipfile -c "$output_path" .
)

"$python_bin" -m zipfile -t "$output_path"