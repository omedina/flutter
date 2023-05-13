document.addEventListener('DOMContentLoaded', () => {
  const addTransformationButton = document.getElementById('addTransformationButton');

  // Load the available icons into the dropdown when the page loads
  chrome.storage.sync.get(['availableIcons'], (result) => {
    if (result.availableIcons) {
      const iconDropdown = document.getElementById('iconDropdown');
      for (let icon of result.availableIcons) {
        const option = document.createElement('option');
        option.value = icon;
        option.textContent = icon;
        iconDropdown.appendChild(option);
      }
    }
  });

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

// Load transformations and populate the list when the page loads
chrome.storage.sync.get(['transformations'], (result) => {
  if (result.transformations) {
    const transformationsList = document.getElementById('transformationsList');
    for (let i = 0; i < result.transformations.length; i++) {
      const transformation = result.transformations[i];
      const li = document.createElement('li');
      li.textContent = `${transformation.name} - ${transformation.icon}`;

      // Add an "Edit" button to each transformation
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        // Populate the form fields with the current values
        document.getElementById('transformationName').value = transformation.name;
        document.getElementById('transformationPrompt').value = transformation.prompt;
        document.getElementById('iconDropdown').value = transformation.icon;

        // Update the "Add Transformation" button to say "Save Changes"
        const addTransformationButton = document.getElementById('addTransformationButton');
        addTransformationButton.textContent = 'Save Changes';

        // Store the index of the transformation being edited
        addTransformationButton.dataset.editingIndex = i;
      });

      li.appendChild(editButton);
      transformationsList.appendChild(li);
    }
  }
});

  // Handle the click event of the "Add Transformation" button
  addTransformationButton.addEventListener('click', () => {
    const transformationName = document.getElementById('transformationName').value;
    const transformationPrompt = document.getElementById('transformationPrompt').value;
    const selectedIcon = document.getElementById('iconDropdown').value;

    chrome.storage.sync.get(['transformations', 'availableIcons'], (result) => {
      let transformations = result.transformations || [];
      let availableIcons = result.availableIcons || [];

      // Check if we're editing an existing transformation or adding a new one
      const editingIndex = addTransformationButton.dataset.editingIndex;
      if (editingIndex !== undefined) {
        // We're editing an existing transformation
        transformations[editingIndex] = {
          name: transformationName,
          prompt: transformationPrompt,
          icon: selectedIcon
        };

        // Reset the button text and remove the editing index
        addTransformationButton.textContent = 'Add Transformation';
        delete addTransformationButton.dataset.editingIndex;
      } else {
        // We're adding a new transformation
        transformations.push({
          name: transformationName,
          prompt: transformationPrompt,
          icon: selectedIcon
        });

        // Remove the selected icon from the available icons
        availableIcons = availableIcons.filter(icon => icon !== selectedIcon);
      }

      chrome.storage.sync.set({ transformations, availableIcons }, () => {
        // Reload the page to reflect the changes
        location.reload();
      });
    });
  });
});