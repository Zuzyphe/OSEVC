// let darkMode = false;

// document.getElementById('toggle-button').addEventListener('click', toggleTheme);

// function toggleTheme() {
//   darkMode =!darkMode;

//   var styleLink = document.querySelector('link[href*="/css/style.css"]');
//   var darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

//   if (darkMode) {
//     styleLink.media = "not all";
//     darkmodeLink.media = "all";
//   } else {
//     styleLink.media = "all";
//     darkmodeLink.media = "not all";
//   }
// }


// works okay
// let systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
// let darkMode = systemDarkMode.matches;

// // Check if theme is stored in localStorage
// if (localStorage.getItem('theme')) {
//   darkMode = localStorage.getItem('theme') === 'dark';
// }

// document.getElementById('toggle-button').addEventListener('click', toggleTheme);

// function toggleTheme() {
//   darkMode =!darkMode;
//   localStorage.setItem('theme', darkMode? 'dark' : 'light');


//   var styleLink = document.querySelector('link[href*="/css/style.css"]');
//   var darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

//   if (darkMode) {
//     styleLink.media = "not all";
//     darkmodeLink.media = "all";
//   } else {
//     styleLink.media = "all";
//     darkmodeLink.media = "not all";
//   }
// }
// works okay

// const darkModeToggle = document.getElementById('dark-mode-toggle');

// darkModeToggle.addEventListener('click', toggleTheme);



// function toggleTheme() {
//   let darkMode = req.cookies.darkMode === 'true';
//   darkMode = !darkMode;
//   res.cookie('darkMode', darkMode);

//   const styleLink = document.querySelector('link[href*="/css/style.css"]');
//   const darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

//   if (darkMode) {
//     styleLink.media = "not all";
//     darkmodeLink.media = "all";
//   } else {
//     styleLink.media = "all";
//     darkmodeLink.media = "not all";
//   }
// }

// ///try

// let systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
// let darkMode = systemDarkMode.matches;

// // Check if theme is stored in localStorage
// if (localStorage.getItem('theme')) {
//   darkMode = localStorage.getItem('theme') === 'dark';
// }

// document.getElementById('toggle-button').addEventListener('click', toggleTheme);

// function toggleTheme() {
//   darkMode =!darkMode;
//   localStorage.setItem('theme', darkMode? 'dark' : 'light');

//   applyTheme();
// }

// function applyTheme() {
//   var styleLink = document.querySelector('link[href*="/css/style.css"]');
//   var darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

//   if (darkMode) {
//     styleLink.media = "not all";
//     darkmodeLink.media = "all";
//   } else {
//     styleLink.media = "all";
//     darkmodeLink.media = "not all";
//   }
// }

// // Apply the theme on page load
// applyTheme();

let systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
let darkMode = systemDarkMode.matches;

// Check if theme is stored in localStorage
if (localStorage.getItem('theme')) {
  darkMode = localStorage.getItem('theme') === 'dark';
} else {
  // If no theme is stored, use the system default
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
}

document.getElementById('toggle-button').addEventListener('click', toggleTheme);

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  applyTheme();
}

function applyTheme() {
  var styleLink = document.querySelector('link[href*="/css/style.css"]');
  var darkmodeLink = document.querySelector('link[href*="/css/darkmode.css"]');

  if (darkMode) {
    styleLink.rel = 'stylesheet alternate';
    darkmodeLink.rel = 'stylesheet';
  } else {
    styleLink.rel = 'stylesheet';
    darkmodeLink.rel = 'stylesheet alternate';
  }
}

// Apply the theme on page load
applyTheme();