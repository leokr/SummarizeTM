# SummarizeTM
A [tampermonkey](https://www.tampermonkey.net/) script (userscript) to call Azure OpenAI to summarize selection on a web page in one phrase/sentence/paragraph.

# Installation
- Install [tampermonkey](https://www.tampermonkey.net/) extension for your browser
- Click on tampermonkey extension icon, create new script, paste contents of [Summarize selected text in one phrase-sentence-paragraph.user.js](https://github.com/leokr/SummarizeTM/blob/main/Summarize%20selected%20text%20in%20one%20phrase-sentence-paragraph.user.js)
  - Update line 64 with your Azure OpenAI model deployment URL, update link 56 with corresponding api key.
  - Save

# Usage
Select text on any page and press Ctrl+Shift+S or Ctrl+Alt+S or Ctrl+Shift+Alt+S

# Context
That was my experiment usage of LLM via Azure OpenAI to summarize any part of content on any page with different instructions: in one phrase/sentence/paragraph.

I'd like to have similar UX link Google translate extension creates: once you select a text a button appears. If you click it then pop-up window with translation appears.

But since I don't have enough experience with CSS/JS and learning that was not my goal at this time I selected the quickest way I found: to register a hotkey handler.

 
