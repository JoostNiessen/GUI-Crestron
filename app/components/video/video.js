/*jslint es6 */
/*global document, window, appModule, translateModule */
var videoModule = (function () {
    'use strict';

    var videoScrollElement = document.getElementById('videoScrollerPanel');
    var videoNavbar = document.getElementById('videoNavbar');
    var selectedSubscriptions = new Array;
    var previousItemsCount = 0;
    const CAMERA_SELECT = 'CameraList.SetSelectedCameraIndex';
    const CAMERA_INDEX = 'CameraList.IndexOfSelectedCamera';
    const CAMERA_LIST = 'CameraList.NumberOfCameras';

    /**
     * This method is for open sidebar in smaller divice
     */
    function videoNavbarOpen() {
        videoNavbar.classList.add('open');
        event.stopPropagation();
    }

    /**
     * This method will invoke camera list in smaller screens on body click
     */
    document.body.addEventListener('click', function () {
        videoNavbar.classList.remove('open');
    });

    /**
     * Adding event listeners for all the camera list items
     * @param {number} numberOfCameras Camera list
     */
    function addClickListeners() {
        videoScrollElement.addEventListener('click', function (event) {
            let clickedItem;
            clickedItem = Number(event.target.id.replace('video-list-item-', ''));
            if (!isNaN(clickedItem)) {
                CrComLib.publishEvent('n', CAMERA_SELECT, clickedItem);
            }
        });
    }

    /**
     * Remove the subscriptions when contact list size changes and decreases
     * @param {number} previousItemsCount previous number of items
     * @param {number} noItems current items
     */
    function removeSubscriptions(previousItemsCount, noItems) {
        for (let idx = previousItemsCount - 1; idx >= noItems; idx--) {
            // unsubscribe to selected state
            CrComLib.unsubscribeState('n', CAMERA_INDEX, selectedSubscriptions[idx]);
            selectedSubscriptions.splice(idx, 1);
        }
    }

    /**
     * Add the subsriptions when contact list changes and size increases
     * @param {number} previousItemsCount  previous number of items
     * @param {number} noOfCameras current items
     */
    function addSubscriptions(previousItemsCount, noOfCameras) {
        for (let idx = previousItemsCount; idx < noOfCameras; idx++) {
            // subscribe to selected state
            selectedSubscriptions[idx] = selectedSubscriptions[idx] = CrComLib.subscribeState('n', CAMERA_INDEX, function (selectedIndex) {
                let listItem = document.getElementById('video-list-item-' + selectedIndex);
                if (!!listItem) {
                    const activeNode = videoScrollElement.getElementsByClassName('active')[0];
                    if (!!activeNode) activeNode.classList.remove('active'); // remove active list item
                    listItem.classList.add('active');
                }
            });
        }
    }

    /**
     * Initialize once during the page or emulator load
     */
    function videoInit() {
        // Subscribe camera count
        CrComLib.subscribeState('n', CAMERA_LIST, function (noOfCameras) {
            previousItemsCount < noOfCameras ? addSubscriptions(previousItemsCount, noOfCameras) : removeSubscriptions(previousItemsCount, noOfCameras);
            previousItemsCount = noOfCameras;
        });

        // Add click listener for the video list
        addClickListeners();
    }


    var offSet1 = 0;
    var offSet2 = 0;
    var offSet3 = 0;
    var receivedstatelabel = 12;

    function countOffset1() {
        offSet1 = offSet1 + 1;
        return offSet1;
    }

    
    function countOffset2() {
        offSet2 = offSet2 + 1;
        return offSet2;
    }

    
    function countOffset3() {
        offSet3 = offSet3 + 1;
        return offSet3;
    }

    // Function creates button that adds buttons to a button list
    // countOffSet counts from starting number.
    function createButton() {
        var listContainer = document.getElementById("list-item");
        listContainer.insertAdjacentHTML('afterbegin', '<ch5-button class="app-button" receiveStateShow="' + countOffset1() + '" receivestatelabel="' + countOffset2() + '" sendeventonclick="' + countOffset3() + '" receivestateiconclass="WatchSource.Sources[4].IconClassOfSource" ></ch5-button>');
    };


    
    (function fillButtonList() {
        var array = [];
        array.length = 22;

        for (let i = 0; i < array.length; i++) {
            const element = array[i];

            createButton();                                                                        
        }

    })();

    var iconArray = [
        'fa'
        
    ]



    // TRIGGERVIEW For All Sources
    var demo = document.getElementById('demo');
var prev = document.getElementById('prev');
var next = document.getElementById('next');

prev.addEventListener('click', function() {
	demo.previousViewChild(); 
});

next.addEventListener('click', function() {
	demo.nextViewChild(); 
});

demo.addEventListener('select', function(e) {
    console.log('select event with detail: ', e.detail );
    switch (e.detail) {
        case 0:
            prev.disabled = true;
            next.disabled = false;
        break;
        case 2:
            prev.disabled = false;
            next.disabled = true;
        break;
        default:
            prev.disabled = false;
            next.disabled = false;
        break;
    }
});



    /**
     * All public or private methods which need to call on init
     */
    var videoPage = document.querySelector('.video-page');
    videoPage.addEventListener('afterLoad', videoInit);

    /**
     * All public method and properties exporting here
     */
    return {
        videoNavbarOpen: videoNavbarOpen
    };
}());

