// ==UserScript==
// @name         Summarize selected text in one phrase/sentence/paragraph
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  max_tokens adj
// @author       leok
// @match      *://*/*
// @icon         https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/chatgpt-icon.svg
// @connect      openai-1-we.openai.azure.com
// @connect      leokpublicsawe.table.core.windows.net
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// Select text on any page and press Ctrl+Shift+S or  Ctrl+Alt+S or  Ctrl+Shift+Alt+S

(function() {
    'use strict';

    document.addEventListener('keydown', (event) => {
        if (event.code == 'KeyS' && event.ctrlKey)
        {
            let selectedText = window.getSelection().toString();

            if (selectedText)
            {
                // the problem is that we must submit max_tokens parameter (otherwise default value is 15). It specifies length of completion. But prompt length + completion length must not exceed 4097 tokens. And to know how much tokens in text we should use some JS lib.
                // the logner our summary the shorter should be input...
                let max_tokens = 50; // the following text is 25 tokens: No salary increases for full-time salaried employees, but maintaining bonus and stock awards and emphasizing pay for performance differentiation.
                let sumTo = 'phrase';

                if (event.altKey && event.shiftKey)
                {
                    max_tokens = 200;
                    sumTo = 'paragraph';
                }
                else if (event.altKey)
                {
                    max_tokens = 100;
                    sumTo = 'sentence';
                }
                else if(!event.shiftKey)
                {
                    return;
                }

                let prompt = `Summarize the text after === in one ${sumTo}\r\n===\r\n${selectedText}`;
                let msg = `Prompt length ${prompt.length} chars (not tokens), max_tokens=${max_tokens}, prompt:\r\n${prompt}`;
                if (!confirm(msg))
                {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                const apiKey = '<paste our own key>'

                if (!apiKey)
                {
                    alert ("you need to edit script source code and set apiKey and url variables with values from Azure AI Studio (open from Azure portal). Also check @connect directive.");
                    return;
                }

                const url = '<paste you own url, e.g. https://openai-1-we.openai.azure.com/openai/deployments/text-davinci-003-depl/completions?api-version=2022-12-01>';

                let data = {
                    "prompt": prompt,
                    "temperature": 0,
                    "top_p": 0.5,
                    "frequency_penalty": 0,
                    "presence_penalty": 0,
                    "max_tokens": max_tokens,
                    "best_of": 1,
                    "stop": null
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        'api-key': `${apiKey}`
                    },
                    data: JSON.stringify(data),
                    responseType: 'json',
                    onload: function(response) {
                        //document.zzCompletionResp = response;
                        let retMsg = ""
                        if (response.response.choices)
                        {
                            retMsg = response.response.choices[0].text;
                        }
                        else if (response.response.error.message)
                        {
                            retMsg = response.response.error.message;
                        }
                        else
                        {
                            retMsg = JSON.stringify(response.response);
                        }

                        alert(retMsg);
                    }
                });

                // this was it does not work on pages that are using Content Security Policy, e.g. Outlook Web
                // GM_xmlhttpRequest allows to bypass Content Security Policy

                /*
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': `${apiKey}`,
                    },
                    body: JSON.stringify(data),
                }).then((response) => {
                    response.json().then((respObj) => {
                        //document.zzrespObj=respObj;
                        let retMsg = respObj.choices[0].text;
                        alert (retMsg);
                    });
                })
                .catch((err) => {
                    //document.zzerr = err;
                    alert(err);
                });*/

                // telemetry just to analyze usage
                const telemetryUrl = 'https://leokpublicsawe.table.core.windows.net/tmjssummarizescriptusage';
                const telemetryRecord = {
                    PartitionKey: '1',
                    RowKey: self.crypto.randomUUID(),
                    url: url
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: telemetryUrl + '?' + atob('c3A9YSZzdD0yMDIzLTA1LTI5VDIyOjIwOjE1WiZzZT0yMTAwLTA1LTMwVDIyOjIwOjAwWiZzcHI9aHR0cHMmc3Y9MjAyMi0xMS0wMiZzaWc9M0JLZktPWWl1em1VRTVQWnZMVmo3V1VDMzBnbkQ3VmNoN2E2ejVzZXVOayUzRCZ0bj10bWpzc3VtbWFyaXplc2NyaXB0dXNhZ2U='),
                    headers: {
                        'Content-Type': 'application/json;odata=nometadata',
                        'Accept': 'application/json;odata=nometadata',
                    },
                    data: JSON.stringify(telemetryRecord),
                    onload: function(response) {
                        //alert(response.responseText);
                    }
                });
            }
        }
    });
})();