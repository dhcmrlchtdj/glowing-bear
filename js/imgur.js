(function() {
'use strict';

var weechat = angular.module('weechat');

weechat.factory('imgur', ['$rootScope', function($rootScope) {

    var process = function(image, callback) {
        // Is it an image?
        if (!image || !image.type.match(/image.*/)) return;

        upload(image, callback);
    };

    // Upload image to imgur from base64
    var upload = function( img, callback ) {
        // Progress bars container
        var progressBars = document.getElementById("imgur-upload-progress"),
            currentProgressBar = document.createElement("div");

        // Set progress bar attributes
        currentProgressBar.className='imgur-progress-bar';
        currentProgressBar.style.width = '0';

        // Append progress bar
        progressBars.appendChild(currentProgressBar);

        // Create new form data
        var fd = new FormData();
        fd.append("smfile", img); // Append the file

        // Create new XMLHttpRequest
        var xhttp = new XMLHttpRequest();

        // Post request to imgur api
        xhttp.open("POST", "https://sm.ms/api/upload", true);

        // Handler for response
        xhttp.onload = function() {

            // Remove progress bar
            currentProgressBar.parentNode.removeChild(currentProgressBar);

            // Check state and response status
            if(xhttp.status === 200) {

                // Get response text
                var response = JSON.parse(xhttp.responseText);

                // Send link as message
                if( response.data && response.data.url ) {

                    if (callback && typeof(callback) === "function") {
                        callback(response.data.url);
                    }

                } else {
                    showErrorMsg();
                }

            } else {
                showErrorMsg();
            }

        };

        if( "upload" in xhttp ) {

            // Set progress
            xhttp.upload.onprogress = function (event) {

                // Check if we can compute progress
                if (event.lengthComputable) {
                    // Complete in percent
                    var complete = (event.loaded / event.total * 100 | 0);

                    // Set progress bar width
                    currentProgressBar.style.width = complete + '%';
                }
            };

        }

        // Send request with form data
        xhttp.send(fd);
    };

    var showErrorMsg = function() {
        // Show error msg
        $rootScope.uploadError = true;
        $rootScope.$apply();

        // Hide after 5 seconds
        setTimeout(function(){
            // Hide error msg
            $rootScope.uploadError = false;
            $rootScope.$apply();
        }, 5000);
    };

    return {
        process: process
    };

}]);

})();
