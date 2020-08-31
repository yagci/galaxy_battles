////////////////////////////////////////////////////////////////
// GENERAL UTILITY DECLARATIONS
// used as a pseudo database
// defaultSetting is used to setSettings, resetSettings, etc
var defaultSetting = {
  difficulty: 'easy',
  speed: 'slow',
  bgmusic: 'on',
  bganimation: 'on'
};
// defaultSetting.difficulty is used as a key to get values of difSet
// game can be modified easily and doesn't require many if..else structures
var difSet = {
  easy: [0.3, 2000],
  hard: [0.1, 1000]
};
// defaultSetting.speed is used as a key to get values of spdSet
// same as above
var spdSet = {
  slow: [10, 1000],
  fast: [20, 500]
}
// asset type is used as a key to get values of aType
// this is used when spawning the svg image element (spawnAsset())
// this set up makes it easy to add more creatures (boss battle, etc) in future
var aType = {
  gift: ['asset gift', 'img/svg/017-rocket-1.svg'],
  enemy: ['asset enemy', 'img/svg/003-monster.svg']
}

////////////////////////////////////////////////////////////////
// set checked true on correct radio buttons in form
function updateSettingForm() {
    // not using localStorage length or key index to iterate
    // because it could have more items that aren't in the form
    for (var d in defaultSetting) {
      // select input with name=KEY and value=VALUE and set checked to TRUE
      $('input[name='+d+'][value='+localStorage.getItem(d)+']')[0].checked = true;
    };
};

////////////////////////////////////////////////////////////////
// reset settings
// by overriding localstorage values with defaultSetting
// and setting checked true on defaultSetting values
function resetSettings() {
  for (var d in defaultSetting) {
    localStorage.setItem(d, defaultSetting[d]);
    $('input[name='+d+'][value='+defaultSetting[d]+']')[0].checked = true;
  };
  applySettings();
};

////////////////////////////////////////////////////////////////
// listening to changes in form (USER INPUT)
// takes name and value and adds it to localStorage
$('input').change(function() {
  localStorage.setItem(this.name, this.value);
  applySettings();
});

////////////////////////////////////////////////////////////////
// turns music and animation on/off based on settings
// is called when settings are changed
function applySettings() {
  // enable/disable background animations
  if (localStorage.getItem('bganimation') == 'on') {
    $('.bg-svg').addClass('animate__animated');
  } else {
    $('.bg-svg').removeClass('animate__animated');
  };

  // enable/disable background music
  if (localStorage.getItem('bgmusic') == 'on') {
    if (bgMusic.playing() == false) {
      bgMusic.play();
    }
  } else {
    bgMusic.stop();
  };
};
