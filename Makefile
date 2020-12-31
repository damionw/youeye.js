.PHONY: clean

all: build/static/youeye.js

build/static/youeye.js: src/*.js build/static
	@find src/*.js -exec cat {} \; -printf "\n" > $@

build/static:
	@mkdir -p $@

clean:
	-@rm -rf build checkouts downloads
