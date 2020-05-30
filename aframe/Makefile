watch: build
	fswatch -0 src/*.js ../three.js/src/*/*.js | xargs -0 -n 1 -I {} make build

.PHONY: build

build-default:
	(cd ../three.js/ && make build-main)
	cat 	../three.js/build/ar.js	\
		src/component-anchor.js	\
		src/component-hit-testing.js	\
		src/location-based/*.js \
		src/system-arjs.js	\
		> build/aframe-ar.js

build-nft:
	(cd ../three.js/ && make build-main-nft)
	cat 	../three.js/build/ar-nft.js	\
		src/component-anchor-nft.js	\
		src/component-hit-testing.js	\
		src/location-based/*.js \
		src/system-arjs.js	\
		> build/aframe-ar-nft.js

build-location-only:
	cat src/location-based/*.js > build/aframe-ar-location-only.js

build: build-default build-nft
