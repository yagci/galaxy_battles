function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function loadStaticHTML() {
  $('#svg-container').load('static_html/game_title.html');
  $('#background').load('static_html/background.html');
  $('#footer').load('static_html/footer.html');
}
