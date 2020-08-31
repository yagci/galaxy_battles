////////////////////////////////////////////////////////////////
// points and # of lives are declared outside of startGame()
var points = 0;
var lives = 3;

////////////////////////////////////////////////////////////////
// names of interval are declared outside of startGame()
var spawn;
var move;

////////////////////////////////////////////////////////////////
// starts game by
// creating player, sets up loop for spawning and moving assets
// writes current points into UI
// (!) more info inside the function
function startGame() {

  // place player svg on gameboard
  createPlayer();

  // get current setting from localStorage
  // value is used as key for difSet and spdSet created in settings.js
  dKey = localStorage.getItem('difficulty');
  sKey = localStorage.getItem('speed');

  // use settings to continously spawn and move assets
  // XX[XX][0] is given into the function
  // XX[XX][1] is the time in ms to repeat function
  spawn = setInterval(function() {
    spawnAsset(difSet[dKey][0])
  }, difSet[dKey][1]);

  move = setInterval(function() {
    moveAssets(spdSet[sKey][0])
  }, spdSet[sKey][1]);

  // points are rewritten
  // then added onto the UI by element ID
  points = 0;
  lives = 3;
  $('#score')[0].innerHTML = points;
  $('#lives')[0].innerHTML = '<i class="fas fa-heart"></i>'.repeat(lives);
}

////////////////////////////////////////////////////////////////
// called when lives < 1
// clears interval of spawn and move
// updates final score
// triggers pop up page that shows GAME OVER
// option: new game (reloads window for ease)
// after 5 seconds window gets reloaded anyways
function stopGame() {
  clearInterval(spawn);
  clearInterval(move);

  $('#final-score')[0].innerHTML = points;
  $('#gave-over').modal('show');

  setTimeout(function() {
    window.location.reload();
  }, 5000);
}

////////////////////////////////////////////////////////////////
// creates player svg and appends to the viewbox
// image svg element can't be created with document.createElement
// so createElementNS is used
// sets attributes: all fixed, except X is randomized (0-460)
function createPlayer(){
  var player = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  player.setAttribute('width', '64px');
  player.setAttribute('x', getRandomInt(460));
  player.setAttribute('y', 180);
  player.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'svg/037-moon-rover.svg');
  player.setAttribute('class', 'player');
  player.setAttribute('id', 'player');

  var gameboard = $('#gameboard');
  gameboard.append(player);
};

////////////////////////////////////////////////////////////////
// eventlistener to detect key press
// left and right arrow keys are for player movement
// spacebar is to shoot enemies
// calc is the value for player movements (-10 goes left, +10 goes right)
function checkKey(e) {
  e = e || window.event;
  var calc = 0;

  if (e.keyCode == '32') {
    // space bar
    shootEnemy();
  } else {
    if (e.keyCode == '37') {
      // left arrow
      calc = -10;

    } else if (e.keyCode == '39') {
      // right arrow
      calc = 10;
    }
    moveplayer(calc);
  };
};

////////////////////////////////////////////////////////////////
// trigered each time left or right arrow keys are pressed
// calc is either -10 or +10 to determine direction
// if player svg is within the viewbox and moving is still possible, it is moved
// sound effect plays each time to show movement
function moveplayer(calc){
  // sound effect declared in sounds.js
  playerMove.play();

  // gets current position of player and then adds movement
  var x = calc + parseInt(player.getAttribute('x'))

  // if valid move => applies new X
  if (x > 0 && x < 440) {
    player.setAttribute('x', x);
  };
};

////////////////////////////////////////////////////////////////
// creates and adds asset to viewbox
// asset can either be an ENEMY or GIFT
// (determined via probability from difficulty settings) => see settings.js
function spawnAsset(i){
  // determines the type of asset that's going to be spawned
  // there are two types of assets: GIFT (rocket svg) or ENEMY (monster svg)
  // if random number between 0-1 is smaller than probabilily set by difSet
  // then its a gift. else it is an enemy.
  if (Math.random() < i) {
    var aKey = 'gift';
  } else {
    var aKey = 'enemy';
  }

  // returns svg/img object of asset based on asset type
  var asset = createAsset(aKey);

  // adds new asset to viewbox
  $('#gameboard').append(asset);
};

////////////////////////////////////////////////////////////////
// creates svg image element and returns to spawnAsset()
// mostly same as create player
// aKey is used to get values from aType depending on asset type
// aType is declared in settings.js (like difSet, spdSet)
function createAsset(aKey) {
  // creates svg image object
  var asset = document.createElementNS('http://www.w3.org/2000/svg', 'image');

  // sets relevant attributes for svg image object
  // static attributes (same for both asset types)
  asset.setAttribute('width', '32px');
  asset.setAttribute('y', 0);
  var unique = aKey.substring(0,1) + Date.now().toString();
  asset.setAttribute('id', unique);
  // randomised x
  asset.setAttribute('x', getRandomInt(460));
  // depending on asset type
  asset.setAttribute('class', aType[aKey][0]);
  asset.setAttributeNS('http://www.w3.org/1999/xlink', 'href', aType[aKey][1]);

  // returns svg image to spawnAsset()
  return asset;
};

////////////////////////////////////////////////////////////////
function moveAssets(speed){
  var assets = $('.asset');

  if (assets.length > 0) {
    for (var i = 0; i < assets.length; i++) {
      var y = assets[i].getAttribute('y');
      y = parseInt(y);

      if (y > 155) {
        var x = parseInt(assets[i].getAttribute('x'));
        var playerX = parseInt($('#player')[0].getAttribute('x'));

        if (x > playerX-50 && x < playerX+50) {
          assets[i].remove();
          if (assets[i].getAttribute('class').includes('gift')) {
            catchGift.play();
            points += 10;
            $('#score')[0].innerHTML = points;
          } else {
            getHit.play();
            lives -= 1;
            $('#lives')[0].innerHTML = '<i class="fas fa-heart"></i>'.repeat(lives);

            if (lives <= 0) {
              gameOver.play();
              stopGame();
              //reset gameboard
              // save points to leaderboard
            }
          }
        } else {
          assets[i].remove();
        }

      } else {
        var ny = y + speed;
        assets[i].setAttribute('y', ny);
      }
    }
  };
};

////////////////////////////////////////////////////////////////
function shootEnemy(){
  // play sound effect
  // only shot not hit
  shootLaser.play();

  // get location of player (x)
  var x = parseInt(player.getAttribute('x'));

  // get range of location
  // spawn is random but movement is always ten pixel
  // so there needs to be a few pixel on each side that get counted too
  var min = x - 5;
  var max = x + 20;

  // get locations of assets (x)
  var assets = $('.asset');
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].getAttribute('class').includes('enemy')) {
      var assetX = parseInt(assets[i].getAttribute('x'));

      // check if asset in range of shot
      if (assetX > min && assetX < max) {
        assets[i].remove();
        enemyHit.play();
        points += 10;
        $('#score')[0].innerHTML = points;
      };
    };
  };
};
