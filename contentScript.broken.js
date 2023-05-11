// Define a function to add a button to a Tweet
function addButtonToTweet(tweet) {



// Create a container for the button
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'relative';
buttonContainer.style.bottom = '-10px';
buttonContainer.style.left = '-35px';
buttonContainer.style.width = '25px';
buttonContainer.style.height = '25px';

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

// Add the container to the webpage
tweet.appendChild(buttonContainer);


    let newButton = document.createElement('button');
    newButton.innerText = 'x';
    newButton.style.position = 'absolute';
    newButton.style.left = '-35px';
    newButton.style.top = '0';

    // Create a new wrapper div
    let wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'relative';

    // Move the target div's contents to the wrapper div
    while (tweet.firstChild) {
        wrapperDiv.appendChild(tweet.firstChild);
    }

    // Append the button and the original contents to the target div
    tweet.appendChild(wrapperDiv);
    //tweet.appendChild(newButton);
}

// Define a function to check for new tweets and add buttons
function checkForNewTweets() {
    let tweets = document.querySelectorAll('article[data-testid="tweet"]  div.css-1dbjc4n.r-1joea0r');
    for (let tweet of tweets) {
        if (!tweet.querySelector('button')) {
            addButtonToTweet(tweet);
        }
    }
}

// Create a MutationObserver instance
let observer = new MutationObserver(checkForNewTweets);

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });




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
buttonBackground.style.borderRadius = '50%'; // Makes the div circular
buttonBackground.style.border = '3px solid gold'; // Sets the div border to be gold
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

// Add the container to the webpage
document.body.appendChild(buttonContainer);

// Add an event listener for the 'click' event
buttonContainer.addEventListener('click', async function() {
  // Check if the div's background color is black
  if (buttonBackground.style.backgroundColor === 'black') {
    // If it is, change the background color to rosy beige
    buttonBackground.style.backgroundColor = '#FFC1A1';

    chrome.storage.sync.get(['apiKey'], async function(result) {
      console.log(result);
      let apiKey = result.apiKey;

      if (!apiKey) {
        console.error('API key not found in storage');
        return;
      }

      // Fetch all tweets from the page
      let tweetElements = document.querySelectorAll('article [data-testid="tweetText"]');
      let tweets = Array.from(tweetElements).map(el => el.textContent);

      console.log('Number of tweets:', tweetElements.length);

      // For each tweet, send a request to the OpenAI API and replace the tweet text with the neutralized version
      for (let tweet of tweets) {
        let response = await fetch('https://ap.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
              role: 'system',
              content: 'You are calmTweetBot, an AI designed to neutralize and translate tweets into unbiased, objective summaries. You take in tweets that might contain strong emotions, bias, or potentially inflammatory language and output a neutral version of the tweet, maintaining the core ideas the tweet is trying to communicate. Stay in the first-person perspective, as if the neutralized tweet is from the original author. Remember, your goal is to foster understanding and reduce hostility among readers.'
            }, {
              role: 'user',
              content: tweet
            }]
          })
        });

        let data = await response.json();
        console.log("Received data from OpenAI API:", data);

        if (data.choices && data.choices.length > 0 && typeof data.choices[0].message.content === 'string') {
          let neutralizedTweet = data.choices[0].message.content.trim();

          // Find the original tweet in the DOM and replace it with the neutralized version
	  let counter = 0;
          for (let tweetElement of tweetElements) {
	    counter++; // Increment the counter
            console.log('Processed tweet number:', counter);
            console.log("Original tweet: ", tweetElement.textContent);
            console.log("Tweet to match: ", tweet);
            if (tweetElement.textContent === tweet) {
              tweetElement.textContent = neutralizedTweet;
              console.log("Tweet replaced with: ", neutralizedTweet);
              break;
            }
          }
        } else {
          console.error('Unexpected OpenAI API response:', JSON.stringify(data, null, 2));
        }
      }
    });
  } else {
    // If it's not black, reset the color back to black
    buttonBackground.style.backgroundColor = 'black';
  }
console.log("FINISHED")
});
