# simple-barrage.js
A simple javascript library for barrage effects. It depends on jQuery library.

# Usage

```
var barrage = new Barrage($('.barrage-area'));
barrage.start();
```

You can configure this effect by pass in a optional `options` parameter:

```
var barrage = new Barrage($('.barrage-area'), {
	numlines: 4,
	velocities: [-1, -1.5, -2.2, -3.3],
	x0: $(window).width(),
	dx: 20
});
barrage.start();
```