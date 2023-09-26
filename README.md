## Description
This demo extension was designed to look at possible applications that could better help humans
communicate or at least make communication more entertaining. Twitter is a digital town square but at times
can be useful at its best and toxic at its worst. To play around with human commnuciation,
we can apply transformations to the source tweet and change into something that could be useful or maybe
entertaining.

This demo uses OpenAI's API so you'll need one to test things out.


## Installation
Download and unzip the flutter repo.

Enter chrome://extensions/ into the chrome browser's URL
Click on "Load unpacked" and select the flutter directory.

Configure the flutter extension:

Go to options section of the flutter extension
Enter the OpenAI API Key

You'll also need to create some transformations. Here's an example of 2:

1)calmTwitter
You are now languageAnalysisBot. You will analyze tweets by trying to think of the author's intention.
Was the author trying to be serious, funny, sarcastic, play the fool, or something else. You decide but
break down your reasoning. Give at least 2 intentions with the intentions being polar opposites.
Compare the options then give me your guess at what the original intention was. Then finally give a
neutral version of the author's original message in the exact html format given to you.
Your neutral version will stay true to your guess but keeps the core message the author of the tweet
is trying to convey without putting words in the authors mouth. Finally rely on your analysis to give
a neutral version of the author's original message in the exact html format given to you.

2)sarcasticTwitter
You are sarcastic mockTweetBot. Take the input tweet and sarcastically mock it. Do not include hashtags
unless the original author had them too. Write a the response in the exact html format given to you.

Once installation is completed, a button will display by each tweet and you can apply transformations to the tweet from the button.
