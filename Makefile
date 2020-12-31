.PHONY: clean

all: build/static/youeye.js

build/static/youeye.js: src/*.js build/static
	@cat src/*.js > $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
