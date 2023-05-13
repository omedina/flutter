// Define a variable to store the current tweet ancestor
let currentTweetAncestor;

// Function to create a dropdown
function createDropdown(transformations) {
  let dropdown = document.createElement('div');
                        dropdown.style.position = 'absolute';
                        dropdown.style.top = '0';
                        dropdown.style.left = '0';
                        dropdown.style.width = '200px';
                        dropdown.style.height = '100px';
                        dropdown.style.transform = 'scale(0, 0)';
                        dropdown.style.transformOrigin = 'top right';
                        dropdown.style.transition = 'transform 0.5s';
                        dropdown.style.backgroundColor = 'white';
                        dropdown.style.zIndex = '1';
                        dropdown.style.borderRadius = '10px';
                        dropdown.style.padding = '0';
                        dropdown.style.overflowY = 'scroll';
                        dropdown.style.overflowX = 'hidden';
                        dropdown.style.display = 'flex';
                        dropdown.style.flexDirection = 'column';
                        dropdown.style.justifyContent = 'center';
                        dropdown.style.alignItems = 'center';
                        dropdown.style.textAlign = 'center';
                        dropdown.style.fontFamily = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
                        dropdown.style.fontSize = '1rem';
                        dropdown.style.color = 'black';
                        dropdown.style.fontWeight = 'bold';
                        dropdown.style.textAlign = 'center';
                        dropdown.style.lineHeight = '1.5';
                        dropdown.style.cursor = 'pointer';
                        dropdown.style.userSelect = 'none';
                        dropdown.style.webkitUserSelect = 'none';
                        dropdown.style.msUserSelect = 'none';
                        dropdown.style.MozUserSelect = 'none';
                        dropdown.style.webkitTouchCallout = 'none';
                        dropdown.style.webkitTapHighlightColor = 'transparent';
                        dropdown.style.border = '1px solid #ccc'; // Add border style
                        dropdown.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

  for (let transformation of transformations) {
    let transformationElement = document.createElement('div');
                            transformationElement.style.width = '100%';
                            transformationElement.style.height = '100%';
                            transformationElement.style.margin = '0';
                            transformationElement.style.padding = '10px'; // Adjust the padding as needed
                            transformationElement.style.display = 'flex';
                            transformationElement.style.flexDirection = 'row';
                            transformationElement.style.justifyContent = 'flex-start';
                            transformationElement.style.alignItems = 'center';
                            transformationElement.style.textAlign = 'left';
                            transformationElement.style.boxSizing = 'border-box';

                            //Create a container div for the image
                            const imageContainer = document.createElement('div');
                            imageContainer.style.width = '24px';
                            imageContainer.style.height = '24px';
                            imageContainer.style.marginRight = '10px'; // Adjust the margin as needed
                            transformationElement.appendChild(imageContainer);
                        
                            // Create an img element for the image
                            const imageElement = document.createElement('img');
                            imageElement.src = chrome.runtime.getURL(`images/icons/${transformation.icon}`);
                            imageElement.style.width = '100%';
                            imageElement.style.height = '100%';
                            imageContainer.appendChild(imageElement);
                        
                            // Create a span for the transformation name
                            const nameSpan = document.createElement('span');
                            nameSpan.textContent = transformation.name; // Use the name property of the transformation
                            transformationElement.appendChild(nameSpan);
                        

    transformationElement.addEventListener('click', async function (e) {
      e.stopPropagation();  
      dropdown.remove();
      if (currentTweetAncestor) {
        console.log('Transformation clicked for tweet:', currentTweetAncestor);

        let tweetTextObject = currentTweetAncestor.querySelectorAll('div[data-testid="tweetText"]');
        console.log('Tweet text div:', tweetTextObject);
        
        // Convert tweetTextObject to string
        let tweetTextHTML = '';
        tweetTextObject.forEach((div) => {
        tweetTextHTML += div.outerHTML + ' ';
        });

        let apiKey = await getAPIKey();

        if (!apiKey) {
          console.error('API key not found in storage');
          return;
        }

        let systemMessage = transformation.prompt;
        console.log('System message:', systemMessage);

        // Add the spinner to the tweet text
        let spinner = createLoadingSpinner();
        currentTweetAncestor.appendChild(spinner);

        let response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                  role: 'system',
                  content: systemMessage
                },
                {
                  role: 'user',
                  content: tweetTextHTML
                }
              ]
            })
          });
          // Remove the spinner after getting the response
            spinner.remove();
          let data = await response.json();
          // If there is a valid response, replace the tweetText
            if (data.choices && data.choices.length > 0 && typeof data.choices[0].message.content === 'string') {
                let newTweetText = data.choices[0].message.content;
                console.log('New tweet text:', newTweetText);
        
                let parser = new DOMParser();
                let newTweetHTML = parser.parseFromString(newTweetText, "text/html").querySelector('div[data-testid="tweetText"]');

               // Replace the original tweet with the new tweet
               tweetTextObject.forEach(node => {
                node.replaceWith(newTweetHTML.cloneNode(true)); 
                });
            } else {
                console.error('Unexpected OpenAI API response:', JSON.stringify(data, null, 2));
            }
      dropdown.remove();

        } else {
          console.log('No ancestor with data-testid="tweet" found: 1'+currentTweetAncestor);
        }
  
        dropdown.remove();
      });
  
      transformationElement.addEventListener('mouseenter', function () {
        transformationElement.style.backgroundColor = 'lightgray';
      });
  
      transformationElement.addEventListener('mouseleave', function () {
        transformationElement.style.backgroundColor = 'transparent';
      });
  
      dropdown.appendChild(transformationElement);
    }
  
    return dropdown;
  }
  
  // Function to setup button event listener
  function setupButtonEventListener(button, dropdown) {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
  
      let tweetAncestor = button.closest('article[data-testid="tweet"]');
      console.log('Tweet ancestor:', tweetAncestor);
      if (tweetAncestor) {
        currentTweetAncestor = tweetAncestor;
  
  document.body.appendChild(dropdown);

  // Get the position of the buttonContainer
  let rect = button.getBoundingClientRect();

  // Set the position of the dropdown
  dropdown.style.top = `${rect.top + window.scrollY}px`;
  dropdown.style.left = `${rect.left + window.scrollX - dropdown.offsetWidth}px`;

  setTimeout(() => {
    dropdown.style.transform = 'scale(1, 1)';
  }, 100);

  document.addEventListener('mousedown', function (event) {
    if (!dropdown.contains(event.target)) {
      dropdown.style.transform = 'scale(0, 0)';
      setTimeout(() => {
        dropdown.remove();
      }, 500);
    }
  }, { once: true });
} else {
        console.log('No ancestor with data-testid="tweet" found: 2');
      }
    });
  }
  
  // Function to add a button to a tweet
  function addButtonToTweet(tweet) {
    let buttonContainer = document.createElement('div');
    buttonContainer.style.zIndex = '9997';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.bottom = '0px';
    buttonContainer.style.left = '-45px';
    buttonContainer.style.width = '25px';
    buttonContainer.style.height = '25px';
  
    const buttonBackground = document.createElement('div');
    buttonBackground.style.position = 'absolute';
    buttonBackground.style.borderRadius = '50%';
    buttonBackground.style.border = '1px solid gold';
    buttonBackground.style.width = '100%';
    buttonBackground.style.height = '100%';
    buttonBackground.style.backgroundColor = 'black';
  
    const buttonLogo = document.createElement('img');
    buttonLogo.src = chrome.runtime.getURL('images/icon128.png');
    buttonLogo.style.position = 'absolute';
    buttonLogo.style.zIndex = '9999';  // Give it a higher z-index
    buttonLogo.style.borderRadius = '50%'; // Makes the img circular
    buttonLogo.style.width = '80%'; // Sets the img width to be slightly less than the div's
    buttonLogo.style.height = '80%'; // Sets the img height to be slightly less than the div's
    buttonLogo.style.top = '10%'; // Center the logo
    buttonLogo.style.left = '10%'; // Center the logo
    buttonLogo.style.webkitFilter = 'drop-shadow(0 0 0.1rem black)'; // Apply the shadow filter
    buttonLogo.style.filter = 'drop-shadow(0 0 0.1rem black)'; // Apply the shadow filter
  
    buttonContainer.appendChild(buttonBackground);
    buttonContainer.appendChild(buttonLogo);

    console.log('Tweet:', tweet);
  
    console.log('ButtonContainer appended to tweet');
  
    chrome.storage.sync.get(['transformations'], function (result) {
      let transformations = result.transformations;
  
      let dropdown = createDropdown(transformations, currentTweetAncestor);
  
      setupButtonEventListener(buttonContainer, dropdown);
  
    });
    tweet.appendChild(buttonContainer);
  }
  
  // Call addButtonToTweet for each tweet element on the page
  function addButtonsToTweets() {
  console.log("Attempting to add button to tweet");
  let tweets = document.querySelectorAll('article[data-testid="tweet"]  div.css-1dbjc4n.r-1joea0r');
    console.log("Number of Tweets: " + tweets.length);
  tweets.forEach(addButtonToTweet);
}

// Invoke addButtonsToTweets initially
setTimeout(addButtonsToTweets, 2000);

// MutationObserver to add buttons when new tweets are loaded dynamically
const observer = new MutationObserver(function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let node of mutation.addedNodes) {
        if (node.nodeName === "ARTICLE" && node.getAttribute("data-testid") === "tweet") {
          addButtonToTweet(node);
        }
      }
    }
  }
});

function getAPIKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('apiKey', function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            } else {
                resolve(result.apiKey);
            }
        });
    });
}

function createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.border = '16px solid #f3f3f3'; 
    spinner.style.borderTop = '16px solid #3498db'; 
    spinner.style.borderRadius = '50%'; 
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.animation = 'spin 2s linear infinite';
    spinner.style.position = 'absolute';
    spinner.style.left = '50%';
    spinner.style.top = '50%';
    spinner.style.zIndex = '9999';
    spinner.style.margin = '-25px 0 0 -25px'; // to center the spinner
    return spinner;
  }
  
  // Spinner CSS
  const spinnerStyle = document.createElement('style');
  spinnerStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  `;
  document.head.appendChild(spinnerStyle);

// Start observing the document body for changes in the subtree
observer.observe(document.body, { childList: true, subtree: true });
