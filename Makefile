.PHONY: clean demo_support

TABULATOR_MODE := bootstrap5
# FONTAWESOME_VERSION := 4.7.0
FONTAWESOME_VERSION := 6.4.2
CHARTS_VERSION := 3.8.2

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
	src/ui-toolbar.js \
	checkouts/pubber/build/static/pubber.js

DEMO_DEPENDENCIES :=\
	build/static/font-awesome.css \
	build/static/Chart.js \
	build/static/pureknob.js \
	build/static/quill.min.js \
	build/static/quill.snow.css \
	build/static/tabulator.css \
	build/static/tabulator.js

FONTAWESOME_URL := https://cdnjs.cloudflare.com/ajax/libs/font-awesome/$(FONTAWESOME_VERSION)

all: build/static/youeye.js

auto: build/bin/monitored_runner
	$< "make demo_support" ./

demo_support: all $(DEMO_DEPENDENCIES)
	@cp examples/* build/static/

build/static/youeye.js: src/*.js build/static checkouts/pubber/build/static/pubber.js
	@(echo '"use strict"'";\n"; for name in $(ORDERED_COMPONENTS_LIST); do cat $${name}; echo '\n'; done) > $@

build/static/font-awesome.css: build/static/all.min.css
	@sed -e 's/url/\nurl/g' < $< | \
	grep '^url' | \
	sed -e 's/[\)][\ ]*.*$$//g' \
		-e "s/^url[\(][\']*//g" \
		-e 's/[\?].*$$//g' \
		-e "s|^\.\.\/|$(FONTAWESOME_URL)/|g" | \
 		while read url; do wget --quiet $$url -O $(dir $@)/$$(basename $$url); done

	@sed -e "s|\(url[\(][\']*\)\.\.\/webfonts\/\([^\/)]*\)\([\']*[\)]\)|\1\2\3|g" \
		< $< \
		> $@

	-@rm $<

build/static/all.min.css: build/static
	@curl -q -s $(FONTAWESOME_URL)/css/all.min.css -o $@

# See: https://www.chartjs.org/docs/latest/getting-started/
build/static/Chart.js: | build/static
	@curl -q -s https://cdnjs.cloudflare.com/ajax/libs/Chart.js/$(CHARTS_VERSION)/chart.min.js -o $@

# See: https://quilljs.com/
build/static/quill.min.js: checkouts/quill build/static
	@cp $</$(notdir $@) $@

# See: https://quilljs.com/
build/static/quill.snow.css: checkouts/quill build/static
	@cp $</$(notdir $@) $@

# See: https://tabulator.info/
build/static/tabulator.js: build/static
	@wget --quiet -nd -nH -O $@ https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator.min.js

# See: https://tabulator.info/
build/static/tabulator.css: build/static
	@wget --quiet -nd -nH -O $@ https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator$(if $(TABULATOR_MODE),_,)$(TABULATOR_MODE).min.css

# See: https://github.com/andrepxx/pure-knob
build/static/pureknob.js: checkouts/pureknob | build/static
	@install $</$(notdir $@) $@

build/bin/monitored_runner: checkouts/recipes build/bin
	@install -m 755 $</bash/$(notdir $@) $@

checkouts/pubber/build/static/pubber.js: checkouts/pubber
	@make -C $<

checkouts/recipes: | checkouts
	@(cd "$@" >/dev/null 2>&1 && git pull) || git clone https://github.com/damionw/recipes.git $@

checkouts/pubber: | checkouts
	@(cd "$@" >/dev/null 2>&1 && git pull) || git clone https://github.com/damionw/pubber.git $@

checkouts/pureknob: | checkouts
	@(cd "$@" >/dev/null 2>&1 && git pull) || git clone https://github.com/andrepxx/pure-knob $@

checkouts/quill: checkouts
	@(cd "$<" && wget --quiet -nc -nd -nH -O - https://github.com/quilljs/quill/releases/download/v0.20.1/quill.tar.gz | tar xfz -)

build/static build/bin checkouts:
	@install -d $@

clean:
	-@rm -rf build checkouts downloads
