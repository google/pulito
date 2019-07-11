login:
	npm login --registry https://wombat-dressing-room.appspot.com/pulito/_ns

publish:
	npm publish --registry https://wombat-dressing-room.appspot.com/pulito/_ns

update-major:
	npm version major
	echo "Don't forget to publish."

update-minor:
	npm version minor
	echo "Don't forget to publish."

update-patch:
	npm version patch
	echo "Don't forget to publish."

zip:
	-rm -rf ./example/dist
	-rm -rf ./example/node_modules
	-rm ./example/package-lock.json
	-rm skeleton.zip
	cd example; zip -r ../skeleton.zip .

