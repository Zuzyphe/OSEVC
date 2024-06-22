let darkMode = false;

document.getElementById('toggle-button').addEventListener('click', toggleTheme);

function toggleTheme() {
  darkMode =!darkMode;

  var styleLink = document.querySelector('link[href*="/css/style.css"]');
  var darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

  if (darkMode) {
    styleLink.media = "not all";
    darkmodeLink.media = "all";
  } else {
    styleLink.media = "all";
    darkmodeLink.media = "not all";
  }
}