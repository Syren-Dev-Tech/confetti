SHELL := /bin/bash

.PHONY: publish check-published tag-version

PACKAGE_NAME := $(shell node -e "const pkg=require('./package.json'); process.stdout.write(pkg.name)")
PACKAGE_VERSION := $(shell node -e "const pkg=require('./package.json'); process.stdout.write(pkg.version)")
TAG := v$(PACKAGE_VERSION)
REGISTRY := https://npm.pkg.github.com/
NPM_VIEW_FLAGS := --registry="$(REGISTRY)"
ifdef GITHUB_TOKEN
NPM_VIEW_FLAGS += --//npm.pkg.github.com/:_authToken=$(GITHUB_TOKEN)
endif

sync:
	git fetch origin --prune --prune-tags

check-published: sync
	@set -e; \
	if npm view "$(PACKAGE_NAME)@$(PACKAGE_VERSION)" $(NPM_VIEW_FLAGS) version --silent >/dev/null 2>&1; then \
		echo "$(PACKAGE_NAME) version $(PACKAGE_VERSION) is already published."; \
	else \
		echo "$(PACKAGE_NAME) version $(PACKAGE_VERSION) is not published."; \
	fi

tag-version: sync
	@set -e; \
	if git rev-parse -q --verify "refs/tags/$(TAG)" >/dev/null 2>&1; then \
		echo "Tag $(TAG) already exists."; \
	else \
		git tag "$(TAG)"; \
		echo "Created tag $(TAG)."; \
	fi

publish: check-published
	@set -e; \
	if npm view "$(PACKAGE_NAME)@$(PACKAGE_VERSION)" $(NPM_VIEW_FLAGS) version --silent >/dev/null 2>&1; then \
		echo "Nothing to do; $(PACKAGE_NAME) version $(PACKAGE_VERSION) is already published."; \
	else \
		$(MAKE) tag-version; \
		echo "Tag $(TAG) is ready for release."; \
	fi

up-deps:
	@if ! command -v jq >/dev/null 2>&1; then \
		echo "Error: jq is required but not installed." >&2; \
		exit 1; \
	fi
	@echo "Extracting dependencies from package.json..."
	@DEPS=$$(jq -r '.dependencies // {} | keys | .[]' package.json); \
	if [ -z "$$DEPS" ]; then \
		echo "No dependencies found."; \
	else \
		for dep in $$DEPS; do \
			echo "Upgrading $$dep..."; \
			yarn up "$$dep"; \
		done; \
	fi

up-devdeps:
	@if ! command -v jq >/dev/null 2>&1; then \
		echo "Error: jq is required but not installed." >&2; \
		exit 1; \
	fi
	@echo "Extracting dev dependencies from package.json..."
	@DEPS=$$(jq -r '.devDependencies // {} | keys | .[]' package.json); \
	if [ -z "$$DEPS" ]; then \
		echo "No dev dependencies found."; \
	else \
		for dep in $$DEPS; do \
			echo "Upgrading $$dep..."; \
			yarn up "$$dep"; \
		done; \
	fi