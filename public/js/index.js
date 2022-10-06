'use strict';


let invalidUrl = false;

/**
 * @function handleShortenerClick
 * @description Handles the click event on the shorten button and simulates the UI
 */
const handleShortenerClick = async () => {
    const result = document.getElementById("result");
    const loader = document.getElementById("loading");
    const urlInput = document.getElementById("urlInput");

    loader.style.display = "block";
    result.style.display = "none";

    invalidUrl = false

    const shortenInfo = await getShortenUrl(urlInput.value);

    // Remove the loader from the screen
    loader.style.display = "none";
    result.style.display = "block";

    if (shortenInfo === null) {
        result.textContent = 'This url is invalid..';
        invalidUrl = true;
        return;
    }

    const { newUrl } = shortenInfo;
    // result.querySelector('#text').textContent = window.location.href + newUrl;
    document.getElementById("urlResult").value = window.location.href + newUrl;
    result.querySelector('#action').classList.replace('d-none', 'd-flex');

    copyUrl()
};

/**
 * @function getShortenUrl
 * @description Shorten the URL.
 * @param {String} originalUrl - The original URL that needs to be shortened
 */
const getShortenUrl = async (originalUrl) => {
    let result;
    try {
        result = await axios.post('/api/shortener', { originalUrl });
    } catch (err) {
        return null;
    }
    return result.data;
};


/**
 * @function copyUrl
 * @description Copies the shortened link to the clipboard.
 */
const copyUrl = () => {
    if (invalidUrl) {
        return;
    }
    const result = document.querySelector("#result #text");
    navigator.clipboard.writeText(result.textContent);
    toastAlert();
};


/**
 * @function toastAlert
 * @description Toast alert when URL is copied.
 * @param {Number} timeoutInMiliseconds - The time in miliseconds to show the toast.
 */
const toastAlert = (timeoutInMiliseconds = 2000) => {
    const urlAlert = document.getElementById("urlAlert");
    urlAlert.classList.add('fade-in');
    urlAlert.classList.remove('collapse');

    setTimeout(() => {
        urlAlert.classList.remove('fade-in');
        urlAlert.classList.add('fade-out');

        setTimeout(() => {
            urlAlert.classList.add('collapse');
            urlAlert.classList.remove('fade-out');
        }, 500);
    }, timeoutInMiliseconds);
}

/**
 * @function openLink
 * @description Opens the shortened link in a new tab/window.
 */
const openLink = () => {
    const text = document.getElementById("urlResult").value;
    window.open(text, '_blank');
};