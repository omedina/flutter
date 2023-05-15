function loadCSS() {
  const css = document.createElement('link');
  css.href = chrome.runtime.getURL('styles.css');
  css.rel = 'stylesheet';
  document.head.appendChild(css);
}

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

function createDropdownElement() {
  let dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  return dropdown;
}

function createTransformationElement() {
  let transformationElement = document.createElement('div');
  transformationElement.className = 'transformationElement';
  return transformationElement;
}

function createImageContainer() {
  const imageContainer = document.createElement('div');
  return imageContainer;
}

function createImageElement(transformation) {
  const imageElement = document.createElement('img');
  imageElement.src = chrome.runtime.getURL(`images/icons/${transformation.icon}`);
  return imageElement;
}

function createNameSpan(transformation) {
  const nameSpan = document.createElement('span');
  nameSpan.textContent = transformation.name; // Use the name property of the transformation
  return nameSpan;
}

function addEventListenersToTransformationElement(transformationElement, dropdown, transformation) {
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
}

function createDropdown(transformations) {
  let dropdown = createDropdownElement();

  for (let transformation of transformations) {
    let transformationElement = createTransformationElement();

    const imageContainer = createImageContainer();
    transformationElement.appendChild(imageContainer);

    const imageElement = createImageElement(transformation);
    imageContainer.appendChild(imageElement);

    const nameSpan = createNameSpan(transformation);
    transformationElement.appendChild(nameSpan);

    addEventListenersToTransformationElement(transformationElement, dropdown, transformation);

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
  dropdown.style.left = `${rect.left + window.scrollX - dropdown.offsetWidth + 45}px`;

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

document.readyState === 'loading' ? 
    document.addEventListener('DOMContentLoaded', main) : 
    main();

function main() {
    console.log('DOM loaded2');
    loadCSS();
    // Define a variable to store the current tweet ancestor
    let currentTweetAncestor;

    // Function to add a button to a tweet
    function addButtonToTweet(tweet) {
      let buttonContainer = document.createElement('div');
      buttonContainer.className = 'buttonContainer';
    
      const buttonBackground = document.createElement('div');
      buttonBackground.className = 'buttonBackground';
    
      const buttonLogo = document.createElement('img');
      buttonLogo.src = chrome.runtime.getURL('images/icon128.png');
      buttonLogo.className = 'buttonLogo';
    
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
    let tweets = document.querySelectorAll('article[data-testid="tweet"] div.css-1dbjc4n.r-1joea0r');
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
        // Check if the added node itself is a tweet
        if (node.nodeName === "ARTICLE" && node.getAttribute("data-testid") === "tweet") {
          addButtonsToTweets();
        }
        // Also check if the added node contains any tweets
        else if (node.querySelectorAll) {
          let tweetNodes = node.querySelectorAll('article[data-testid="tweet"]');
          if (tweetNodes.length > 0) {
            addButtonsToTweets();
          }
        }
      }
    }
  }
});

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
}