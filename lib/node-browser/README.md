# node-browser

Bring node modules to your browser easily.

### Installation (Bower)
```
bower install --save node-browser
```

### Usage
```html
<script src="lib/node-browser/dist/all.js"></script>
```

```js
$scope.myObj = {
	location: $window.location
};

if(util.isObject(myObj.location)) {
	$scope.myUrl = url.format(myObj.location));
} else if(util.isString(myObj.location)) {
	$scope.myUrl = url.parse(myObj.location);
}
```

### Available NodeJS modules
- util
- path
- assert
- punycode
- querystring
- domain
- events
- url