function Barrage($container, options) {
	options = options || {};

	var $atoms = $container.find('.atom');
	this.containerW = $container.width();
	this.containerH = $container.height();
	this.numlines = options.numlines || 4;
	this.x0 = options.x0 || 320;
	this.dx = options.dx || 100;
	this.y0 = options.y0 || 50;
	this.dy = options.dy || 90;
	this.atomsByLine = []; // store last item divided by line
	this.lastLineIdx = 0;
	this.lineVelocities = options.velocities || [-1, -1.5, -1, -2, -1.6, -2, -1.1];
	
	this.deadAtoms = [];
	this.atoms = [];
	this.tid;
	this.running = false;

	var _deadAtoms = this.deadAtoms;
	var _theAtoms = this.atoms

	function Atom($el, x, y, vx) {
		this.$el = $el;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.dead = false;

		this.w = $el.outerWidth();
		this.h = $el.height();
		this.end = -this.w;	
	}

	Atom.prototype.tick = function(){
		if (this.dead) return;

		this.x += this.vx;
		if (this.x < this.end) {
			this.dead = true;
			_deadAtoms.push(this);
		}

		this.render();
	}

	Atom.prototype.render = function(){
		this.$el.css({
			transform: "translate3d(" + this.x + "px, "+ this.y + "px, 0px)"
		});
	}

	Atom.prototype.reset = function(newX, newY, vx) {
		this.x = newX;
		this.y = newY;
		this.vx = vx;
		this.dead = false;

		this.render();
	}

	$atoms.each(function(idx){
		_theAtoms.push(new Atom($(this), 0, 0, -1));
	})

	this.reset();
}

Barrage.prototype.start = function(){
	if (this.running) return;

	this.reset();
	this.layout(this.atoms, 0);
	this.render();
	this.running = true;
}

Barrage.prototype.reset = function(){
	var x0 = this.x0;
	var y0 = this.y0;
	this.atoms.forEach(function(item){
		item.reset(x0, y0, 0);
	})
}

Barrage.prototype.layout = function(layoutAtoms, firstLineIndex){

	var atoms = layoutAtoms
	var numlines = this.numlines;
	var atomsByLine = this.atomsByLine;
	var x0 = this.x0, y0 = this.y0;
	var dx = this.dx, dy = this.dy;
	var tx, ty;
	var lastAtomInLine;
	var lineIdx = firstLineIndex; // if not assigned some value and the atoms length is 0, the lineIdx will be null
	var lineVelocities = this.lineVelocities;
	var numVs = lineVelocities.length;

	for (var i = 0, len = atoms.length; i < len; i = i + 1) {
		var atom = atoms[i];
		lineIdx = (i + firstLineIndex) % numlines;

		if (lastAtomInLine = atomsByLine[lineIdx]) {
			tx = lastAtomInLine.x + lastAtomInLine.w + r(dx/10, dx);
		} else {
			tx = x0 + r(dx/10, dx);
		}

		tx = Math.max(tx, x0);

		ty = lineIdx * dy + y0;
		atom.reset(tx, ty, lineVelocities[lineIdx%numVs]);

		atomsByLine[lineIdx] = atom;
	}

	this.lastLineIdx = (lineIdx + 1)%numlines;
}

Barrage.prototype.render = function(){

	var atoms = this.atoms;
	
	atoms.forEach(function(item){
		item.tick();
	})

	if (this.deadAtoms.length > 0) {
		this.layout(this.deadAtoms, this.lastLineIdx);
		this.deadAtoms.length = 0;
	}

	var _this = this;
	this.tid = requestAnimationFrame(function(){ _this.render(); })
}

Barrage.prototype.stop = function(){
	if (this.running == true) {
		cancelAnimationFrame(this.tid);
		this.running = false;
	}
}

function r(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());