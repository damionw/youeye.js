.PHONY: clean

ORDERED_COMPONENTS := \
	src/ui-base.js \
	src/ui-configuration.js \
	src/ui-messenger.js \
	src/ui-button.js \
	src/ui-pane.js \
	src/ui-frame.js

all: build/static/youeye.js

build/static/youeye.js: src/*.js build/static
	@(echo "'use strict';\n"; for name in $(ORDERED_COMPONENTS); do cat $${name}; echo '\n'; done) > $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
