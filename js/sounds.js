////////////////////////////////////////////////////////////////
// loads sound file with howler js for easy usage
// takes link and options
// currently only used: loop and volume
// but more are possible (autoplay, etc)
// function is created like this to easily iterate over options should game be expanded
function createHowl(link, options) {
  var options = options || {};
  var loop = options.loop || false;
  var vol = options.volume || 0.5;

  return new Howl({
    src: link,
    loop: loop,
    volume: vol
  });
};

////////////////////////////////////////////////////////////////
// sound effects
// general
var bgMusic = createHowl('sfx/bg.mp3', {loop: true, volume: 0.1});
var btnClick = createHowl('sfx/nav.wav', {volume: 0.1});
// for game play
var playerMove = createHowl('sfx/nav.wav', {volume: 0.1}); // change pls
var getHit = createHowl('sfx/death.wav');
var catchGift = createHowl('sfx/gift.wav');
var shootLaser = createHowl('sfx/shoot.wav');
var enemyHit = createHowl('sfx/hit.wav');
var gameOver = createHowl('sfx/loose.wav');

////////////////////////////////////////////////////////////////
// eventlistener button click
// each time element with class BTN is clicked, sound effect plays
$('.btn').click(function() {
  btnClick.play();
})
