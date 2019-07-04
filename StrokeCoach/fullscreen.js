//Initialisieren der Checkbox
var fullscreen = document.getElementById('fullscreen');
fullscreen.addEventListener('change', changeFullscreen);

var selected = false;

function changeFullscreen() {
    if (selected == true) {
        exitFullscreen();
    } else if (selected == false) {
        openFullscreen(document.documentElement);
    }
}

/* Function to open fullscreen mode */
function openFullscreen(elem) {  
    selected = true;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    selected = false;
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
}



const requestor = document.querySelector('div');

requestor.addEventListener('fullscreenerror', (event) => {
    alert("Your Browser doesn't allow fullscreen mode");
    selected = false;
    console.error('an error occurred changing into fullscreen');
    console.log(event);
});