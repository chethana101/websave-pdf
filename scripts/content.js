let targetElement = document.querySelector("html");

chrome.runtime.onMessage.addListener(async function (request, sender, callback) {
    if (request.getList) {
        targetElement = document.querySelector("html");
        let selection = true;
        let accessPrint = false;

        if (request.type === "all") {
            selection = false;
        }

        if (request.download) {
            selection = false;
            accessPrint = false;
            var today = new Date();
            var dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getTime();

            await $(targetElement).printThis({
                pageTitle: "WebSave-PDF-" + dateTime + ".pdf",
                importCSS: true,
                importStyle: true,
                printContainer: true,
                copyTagStyles: true,
                copyTagClasses: true,
                canvas: true,
                removeScripts: false,
                afterPrint: function () {
                    callback({success: true, element: targetElement});
                },
            });
        }

        // Add a click event listener to the document
        if (selection) {
            document.addEventListener('mouseover', selectionFunction);
            accessPrint = true;
        } else {
            document.removeEventListener('mouseover', selectionFunction);
        }

        $("body").on("click", async () => {
            if (accessPrint) {
                selection = false;
                accessPrint = false;
                targetElement.style.border = '';

                var today = new Date();
                var dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() +
                    '-' + today.getTime();

                var opt = {
                    margin: request.options.margin,
                    filename: 'WebSave-PDF-' + dateTime + '.pdf',
                    html2canvas: {
                        scale: 2
                    },
                    jsPDF: {
                        unit: 'cm',
                        format: request.options.format,
                        orientation: request.options.orientation
                    },
                    enableLinks: true
                };
                html2pdf().set(opt).from(targetElement).save();

                document.removeEventListener('mouseover', selectionFunction);
                callback({success: true, element: targetElement});
            }
        });
    }
})

// Select function
function selectionFunction(event) {
    // Get the hovered element
    targetElement = event.target;

    // Add a border to the element on hover
    targetElement.style.border = '1px solid red';

    // Remove the border when the mouse moves away from the element
    targetElement.addEventListener('mouseout', function () {
        targetElement.style.border = '';
    });
}
