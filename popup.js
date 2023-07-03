$(document).ready(function () {
    var downloadButton = document.getElementById('downloadButton');
    var entireContent = document.getElementById("entire-content");
    var selectedElement = document.getElementById("selected-element");
    var startSelectButton = document.getElementById("startSelectButton");
    var advancedContent = document.getElementById("advanced-content");
    let format = "a4";
    let orientation = "portrait";
    let margin = 0;

    selectedElement.addEventListener("click", () => {
        let input = selectedElement.querySelector("input");
        if (input.checked) {
            downloadButton.style.display = "none";
            startSelectButton.style.display = "block";
            advancedContent.style.display = "block";
        }
    });

    entireContent.addEventListener("click", () => {
        let input = entireContent.querySelector("input");
        if (input.checked) {
            downloadButton.style.display = "block";
            startSelectButton.style.display = "none";
            advancedContent.style.display = "none";
        }
    });

    // When download button is clicked
    downloadButton.addEventListener('click', function () {
        downloadButton.disabled = true;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                getList: 1,
                type: "all",
                download: true,
                options: {
                    format: format,
                    orientation: orientation,
                    margin: margin,
                }
            }, function (response) {
                // Process the response
                if (response.success) {
                    downloadButton.disabled = false;
                }
            });
        });
        window.close();
    });

    // When start selecting button is clicked
    startSelectButton.addEventListener('click', function () {
        startSelectButton.disabled = true;
        startSelectButton.textContent = "Selecting Started";
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                getList: 1,
                type: "select",
                download: false,
                options: {
                    format: document.getElementById("format").value,
                    orientation: document.getElementById("orientation").value,
                    margin: parseInt(document.getElementById("margin").value),
                }
            }, function (response) {
                // Process the response
                startSelectButton.disabled = false;
            });
        });
    });
});
