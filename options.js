document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;

    const handleSaveResult = () => {
      chrome.storage.sync.get(['apiKey'], (result) => {
        const message = document.getElementById('message');
        if (result.apiKey === apiKey) {
          message.textContent = 'API key saved successfully!';
          message.style.display = 'block';
          message.style.color = 'green';
        } else {
          message.textContent = 'Failed to save the API key.';
          message.style.display = 'block';
          message.style.color = 'red';
        }

        // Hide the message after 3 seconds
        setTimeout(() => {
          message.style.display = 'none';
        }, 3000);
      });
    };

    chrome.storage.sync.set({ apiKey }, handleSaveResult);
  });

  // Load the saved API key when the page loads
  chrome.storage.sync.get(['apiKey'], (result) => {
    if (result.apiKey) {
      document.getElementById('apiKey').value = result.apiKey;
    }
  });
});