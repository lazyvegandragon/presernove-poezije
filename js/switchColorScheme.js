// Function to get the current color scheme
function getColorScheme() {
  return getComputedStyle(document.documentElement).getPropertyValue('color-scheme');
}

// Function to set the icon, nav-btn, and sort-icon color based on the color scheme
function setIconAndNavBtnColor() {
  let schemeIcon = document.getElementById('scheme-icon');
  let navBtns = document.getElementsByClassName('nav-btn');
  let sortIcon = document.getElementById('sort-icon');  // Get the sort-icon element
  
  if (getColorScheme().includes('dark')) {
      schemeIcon.src = 'img/sun.png';
      for(let i = 0; i < navBtns.length; i++) {
          navBtns[i].style.backgroundColor = 'black';
      }
      sortIcon.style.filter = 'invert(1)';  // Apply the invert filter to the sort-icon when the color scheme is dark
  } else {
      schemeIcon.src = 'img/moon.png';
      for(let i = 0; i < navBtns.length; i++) {
          navBtns[i].style.backgroundColor = 'white';
      }
      sortIcon.style.filter = 'none';  // Remove the filter from the sort-icon when the color scheme is light
  }
}

// Function to toggle color scheme
function toggleColorScheme() {
  if (getColorScheme().includes('dark')) {
      document.documentElement.style.setProperty('color-scheme', 'light');
  } else {
      document.documentElement.style.setProperty('color-scheme', 'dark');
  }
  setIconAndNavBtnColor();  // Update the icon and nav-btn color after toggling the color scheme
}

// Function to set the initial color scheme based on user preference
function setInitialColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.style.setProperty('color-scheme', 'dark');
  } else {
      document.documentElement.style.setProperty('color-scheme', 'light');
  }
  setIconAndNavBtnColor();  // Update the icon and nav-btn color after setting the initial color scheme
}

// Set the icon and nav-btn color at page load
window.onload = setInitialColorScheme;

// Add event listener to the scheme switcher
let schemeSwitcher = document.getElementById('scheme-switcher');
schemeSwitcher.addEventListener('click', toggleColorScheme);

// Get the sort-icon element
let sortIcon = document.getElementById('sort-icon');

// Add event listener to the sort-icon
sortIcon.addEventListener('click', function() {
    // Check the current image source and change it
    if (sortIcon.src.includes('sort-group.png')) {
        sortIcon.src = 'img/sort-alpha.png';
    } else {
        sortIcon.src = 'img/sort-group.png';
    }
});
