# Local dev for gkirgizov.github.io.
# Wraps Jekyll in Docker so no local Ruby is needed. The long flags are just
# Docker plumbing (mount the repo, map your user, cache gems, forward ports) —
# the actual command is plain `jekyll serve` / `jekyll build`.
#
#   make serve   → dev server with live reload at http://localhost:4000
#   make build   → one-off static build into _site/
#   make stop    → stop the dev server

IMAGE  := ruby:3.3
DOCKER := docker run --rm -u "$$(id -u):$$(id -g)" -e HOME=/tmp \
	-e BUNDLE_PATH=/site/vendor/bundle -e BUNDLE_APP_CONFIG=/site/.bundle \
	-v "$$(pwd):/site" -w /site

.PHONY: serve build stop

serve:
	$(DOCKER) -it --name gk-jekyll -p 4000:4000 -p 35729:35729 $(IMAGE) \
		bash -lc "bundle install && bundle exec jekyll serve --host 0.0.0.0 --livereload"

build:
	$(DOCKER) $(IMAGE) bash -lc "bundle install && bundle exec jekyll build"

stop:
	-docker stop gk-jekyll
