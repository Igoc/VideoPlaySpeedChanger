/* IMPORT CSS */

import './assets/css/style.css';
import './assets/css/header.css';
import './assets/css/content.css';

/* IMPORT UTILITY */

import Utility from './utility/utility.js';

/* IMPORT CONFIG */

import { BACKEND_CONFIG } from './assets/config/backend.js';

/* IMPORT CONSTANT */

import { MAX_VIDEO_BYTES }   from './assets/constant/video.js';
import { VIDEO_SPEEDS }      from './assets/constant/video.js';
import { DEMO_VIDEO_SPEEDS } from './assets/constant/video.js';

/* DECLARE DOCUMENT ELEMENTS */

const uploadBox                  = document.getElementById('upload-box');
const videoPlaySpeedRadioButtons = [document.getElementById('video-play-speed-radio-button-1'), document.getElementById('video-play-speed-radio-button-2'), document.getElementById('video-play-speed-radio-button-3')];
const videoFile                  = document.getElementById('video-file');

const progressBox  = document.getElementById('progress-box');
const progress     = document.getElementById('progress');
const cancelButton = document.getElementById('cancel-button');

const downloadBox    = document.getElementById('download-box');
const downloadButton = document.getElementById('download-button');
const returnButton   = document.getElementById('return-button');

const demoVideo                      = document.getElementById('demo-video');
const demoVideoPlaySpeedRadioButtons = [document.getElementById('demo-video-play-speed-radio-button-1'), document.getElementById('demo-video-play-speed-radio-button-2'), document.getElementById('demo-video-play-speed-radio-button-3'), document.getElementById('demo-video-play-speed-radio-button-4')];

/* DECLARE GLOBAL VARIABLES */

let xmlHttpRequest = new XMLHttpRequest();
let formData       = new FormData();

let videoSpeed = VIDEO_SPEEDS[1];

let progressOpacityTimer = null;

/* ADD VIDEO PLAY SPEED RADIO BUTTONS EVENT LISTENER */

for (let index = 0; index < videoPlaySpeedRadioButtons.length; index++) {
    videoPlaySpeedRadioButtons[index].onclick = () => {
        videoSpeed = VIDEO_SPEEDS[index];
    };
}

/* ADD VIDEO FILE EVENT LISTENER */

videoFile.onchange = () => {
    const video     = videoFile.files[0];
    const videoSize = video.size;

    if (videoSize > MAX_VIDEO_BYTES) {
        alert('Video has exceeded the max size allowed to upload (' + Utility.convertBytesToSize(MAX_VIDEO_BYTES) + ')');

        return;
    }

    let progressOpacity = 1.0;

    uploadBox.style.display   = 'none';
    progressBox.style.display = 'flex';
    downloadBox.style.display = 'none';

    xmlHttpRequest = new XMLHttpRequest();
    formData       = new FormData();

    formData.append('file', video);
    formData.append('speed', videoSpeed);

    xmlHttpRequest.open('POST', BACKEND_CONFIG.host + BACKEND_CONFIG.routers.upload);

    xmlHttpRequest.onload = () => {
        if (progressOpacityTimer != null) {
            clearInterval(progressOpacityTimer);
        }

        switch (xmlHttpRequest.status) {
        case 200:
            uploadBox.style.display   = 'none';
            progressBox.style.display = 'none';
            downloadBox.style.display = 'flex';

            downloadButton.href = BACKEND_CONFIG.host + BACKEND_CONFIG.routers.download + '?file=' + xmlHttpRequest.response;

            break;

        default:
            alert('Failed to change video play speed');

            uploadBox.style.display   = 'flex';
            progressBox.style.display = 'none';
            downloadBox.style.display = 'none';

            break;
        }

        progress.style.opacity = 1.0;

        videoFile.value = '';
    };

    xmlHttpRequest.upload.onprogress = (event) => {
        progress.value = event.loaded / event.total * 100;

        if (progress.value == 100) {
            progressOpacityTimer = setInterval(() => {
                if (progressOpacity == 1.0) {
                    progressOpacity = 0.875;
                }
                else {
                    progressOpacity = 1.0;
                }

                progress.style.opacity = progressOpacity;
            }, 500);
        }
    };

    xmlHttpRequest.send(formData);
};

/* ADD CANCEL BUTTON EVENT LISTENER */

cancelButton.onclick = () => {
    if (progressOpacityTimer != null) {
        clearInterval(progressOpacityTimer);
    }

    uploadBox.style.display   = 'flex';
    progressBox.style.display = 'none';
    downloadBox.style.display = 'none';

    progress.style.opacity = 1.0;

    videoFile.value = '';

    xmlHttpRequest.abort();
};

/* ADD DOWNLOAD BUTTON EVENT LISTENER */

downloadButton.onclick = () => {
    uploadBox.style.display   = 'flex';
    progressBox.style.display = 'none';
    downloadBox.style.display = 'none';
};

/* ADD RETURN BUTTON EVENT LISTENER */

returnButton.onclick = () => {
    uploadBox.style.display   = 'flex';
    progressBox.style.display = 'none';
    downloadBox.style.display = 'none';
};

/* ADD DEMO VIDEO PLAY SPEED RADIO BUTTONS EVENT LISTENER */

for (let index = 0; index < demoVideoPlaySpeedRadioButtons.length; index++) {
    demoVideoPlaySpeedRadioButtons[index].onclick = () => {
        demoVideo.playbackRate = DEMO_VIDEO_SPEEDS[index];
    };
}