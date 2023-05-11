// Define a function to add a button to a Tweet
function addButtonToTweet(tweet) {
    // Create a container for the button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.left = '-40px'; // Adjust as needed
    buttonContainer.style.width = '25px';
    buttonContainer.style.height = '25px';
    buttonContainer.classList.add('new-button');

    // Create a div for the background
    const buttonBackground = document.createElement('div');
    buttonBackground.style.position = 'absolute';
    buttonBackground.style.borderRadius = '50%'; // Makes the div circular
    buttonBackground.style.border = '1px solid gold'; // Sets the div border to be gold
    buttonBackground.style.width = '100%'; // Sets the div width
    buttonBackground.style.height = '100%'; // Sets the div height
    buttonBackground.style.backgroundColor = 'black'; // Sets the initial background color to black

    // Create an img for the logo
    const buttonLogo = document.createElement('img');
    buttonLogo.src = chrome.runtime.getURL('images/icon128.png');
    buttonLogo.style.position = 'absolute';
    buttonLogo.style.borderRadius = '50%'; // Makes the img circular
    buttonLogo.style.width = '80%'; // Sets the img width to be slightly less than the div's
    buttonLogo.style.height = '80%'; // Sets the img height to be slightly less than the div's
    buttonLogo.style.top = '10%'; // Center the logo
    buttonLogo.style.left = '10%'; // Center the logo
    buttonLogo.style.webkitFilter = 'drop-shadow(0 0 0.1rem black)'; // Apply the shadow filter
    buttonLogo.style.filter = 'drop-shadow(0 0 0.1rem black)'; // Apply the shadow filter

    // Add the divs to the container
    buttonContainer.appendChild(buttonBackground);
    buttonContainer.appendChild(buttonLogo);

    // Add the container to the tweet
    tweet.appendChild(buttonContainer);

// Define the new button's click action here
buttonContainer.addEventListener('click', function(e) {
    e.stopPropagation();  // Stop the event from propagating up
    console.log('Button clicked.');  // Debugging output
    // Find the closest ancestor with 'data-testid="tweet"'
    let tweetAncestor = tweet.closest('article[data-testid="tweet"]');
    console.log(tweetAncestor)
    if (tweetAncestor) {
        // Find the span containing the tweet text within this ancestor
        let tweetTextSpan = tweetAncestor.querySelector('div[data-testid="tweetText"] span');
        // If the span was found, display its text content in an alert
        if (tweetTextSpan) {
            console.log('Tweet text found:', tweetTextSpan.textContent);  // Debugging output
            alert(tweetTextSpan.textContent);
        } else {
            console.log('Tweet text not found.');  // Debugging output
        }
    } else {
        console.log('No ancestor with data-testid="tweet" found.');  // Debugging output
    }
});
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Define a function to check for new tweets and add buttons
let checkForNewTweets = debounce(function() {
    let tweets = document.querySelectorAll('article[data-testid="tweet"]  div.css-1dbjc4n.r-1joea0r');
    for (let tweet of tweets) {
        // Add a condition to check if the new button exists
        if (!tweet.querySelector('.new-button')) {
            addButtonToTweet(tweet);
        }
    }
}, 500); // Wait for 500ms before calling the function

// Create a MutationObserver instance
let observer = new MutationObserver(checkForNewTweets);

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });
