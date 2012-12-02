test:
	./node_modules/.bin/mocha \
		--ui exports \
		--reporter list \
		--growl

.PHONY: test