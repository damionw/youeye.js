.PHONY: clean demo_support

ORDERED_COMPONENTS_LIST := \
	src/ui-base.js \
	src/ui-configuration.js \
	src/ui-messenger.js \
	src/ui-frame.js \
	src/ui-button.js \
	src/ui-pane.js \
	src/ui-transient.js \
	src/ui-edgeframe.js \
	src/ui-textfield.js \
	src/ui-toolbar.js

all: build/static/youeye.js

demo_support: all build/static/font-awesome.min.css build/static/d3.min.js
	@cp examples/* build/static/

build/static/d3.min.js: build/static
	@curl -q -s https://d3js.org/d3.v4.min.js -o $@

build/static/youeye.js: src/*.js build/static
	@(echo '"use strict"'";\n"; for name in $(ORDERED_COMPONENTS_LIST); do cat $${name}; echo '\n'; done) > $@

build/static/font-awesome.min.css: build/static build/static/fontawesome-webfont.eot build/static/fontawesome-webfont.woff2 build/static/fontawesome-webfont.ttf
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css | sed -e 's/\.\.\/fonts//g' > $@

build/static/fontawesome-webfont.eot: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot -o $@

build/static/fontawesome-webfont.woff2: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2 -o $@

build/static/fontawesome-webfont.ttf: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf -o $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
