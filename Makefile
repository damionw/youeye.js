.PHONY: clean demo_support

ORDERED_COMPONENTS_LIST := \
	src/ui-base.js \
	src/ui-configuration.js \
	src/ui-frame.js \
	src/ui-button.js \
	src/ui-pane.js \
	src/ui-transient.js \
	src/ui-edgeframe.js \
	src/ui-form.js \
	src/ui-textfield.js \
	src/ui-calendar.js \
	src/ui-canvas.js \
	src/ui-tabular.js \
	src/ui-toolbar.js \
	checkouts/pubber/build/static/pubber.js

all: build/static/youeye.js

demo_support: all build/static/font-awesome.min.css
	@cp examples/* build/static/

build/static/youeye.js: src/*.js build/static checkouts/pubber/build/static/pubber.js
	@(echo '"use strict"'";\n"; for name in $(ORDERED_COMPONENTS_LIST); do cat $${name}; echo '\n'; done) > $@

build/static/font-awesome.min.css: build/static build/static/fontawesome-webfont.eot build/static/fontawesome-webfont.woff2 build/static/fontawesome-webfont.ttf
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css | sed -e 's/\.\.\/fonts//g' > $@

build/static/fontawesome-webfont.eot: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot -o $@

build/static/fontawesome-webfont.woff2: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2 -o $@

build/static/fontawesome-webfont.ttf: build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf -o $@

checkouts/pubber/build/static/pubber.js: checkouts/pubber
	@make -C $<

checkouts/pubber: checkouts
	@git clone https://github.com/damionw/pubber.git $@

build/static checkouts:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
