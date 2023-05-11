// Create a container for the button
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.bottom = '20px';
buttonContainer.style.right = '20px';
buttonContainer.style.width = '50px';
buttonContainer.style.height = '50px';

// Create a div for the background
const buttonBackground = document.createElement('div');
buttonBackground.style.position = 'absolute';
buttonBackground.style.borderRadius = '50%';  // Makes the div circular
buttonBackground.style.border = '3px solid gold';  // Sets the div border to be gold
buttonBackground.style.width = '100%';  // Sets the div width
buttonBackground.style.height = '100%';  // Sets the div height
buttonBackground.style.backgroundColor = 'black';  // Sets the initial background color to black

// Create an img for the logo
const buttonLogo = document.createElement('img');
buttonLogo.src = chrome.runtime.getURL('images/icon128.png');
buttonLogo.style.position = 'absolute';
buttonLogo.style.borderRadius = '50%';  // Makes the img circular
buttonLogo.style.width = '80%';  // Sets the img width to be slightly less than the div's
buttonLogo.style.height = '80%';  // Sets the img height to be slightly less than the div's
buttonLogo.style.top = '10%';  // Center the logo
buttonLogo.style.left = '10%';  // Center the logo
buttonLogo.style.webkitFilter = 'drop-shadow(0 0 0.1rem black)';  // Apply the shadow filter
buttonLogo.style.filter = 'drop-shadow(0 0 0.1rem black)';  // Apply the shadow filter

// Add the divs to the container
buttonContainer.appendChild(buttonBackground);
buttonContainer.appendChild(buttonLogo);

// Add the container to the webpage
document.body.appendChild(buttonContainer);

// Add an event listener for the 'click' event
buttonContainer.addEventListener('click', function() {
    // Check if the div's background color is black
    if (buttonBackground.style.backgroundColor === 'black') {
        // If it is, change the background color to rosy beige
        buttonBackground.style.backgroundColor = '#FFC1A1';
    } else {
        // If it's not, change the background color back to black
        buttonBackground.style.backgroundColor = 'black';
    }
});