.PHONY: clean

ORDERED_COMPONENTS_LIST := \
	src/ui-base.js \
	src/ui-configuration.js \
	src/ui-messenger.js \
	src/ui-frame.js \
	src/ui-button.js \
	src/ui-pane.js \
	src/ui-transient.js \
	src/ui-textfield.js \
	src/ui-toolbar.js

all: build/static/youeye.js

build/static/youeye.js: src/*.js build/static
	@(echo '"use strict"'";\n"; for name in $(ORDERED_COMPONENTS_LIST); do cat $${name}; echo '\n'; done) > $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
