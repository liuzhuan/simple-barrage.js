var barrage = new Barrage($('.barrage-area'), {
	numlines: 4,
	velocities: [-1, -1.5, -2.2, -3.3],
	x0: $(window).width(),
	dx: 20
});

barrage.start();

$('#start-btn').click(function(){
	barrage.start();
})

$('#stop-btn').click(function(){
	barrage.stop();
})

new Barrage($('.container2'),{
	numlines: 1,
	velocities: [-5],
	x0: $(window).width()
}).start();