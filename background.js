// background.js
chrome.runtime.onInstalled.addListener(function() {
    // Array of icon file names
    let icons = [
        'meditation.svg',
	'bigbrain.svg',
        // Add more icon names as needed
    ];

    // Store the icons in chrome.storage.sync
    chrome.storage.sync.set({ availableIcons: icons }, function() {
        console.log('The icons have been saved.');
    });
});
console.log('background.js loaded');
