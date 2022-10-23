import confetti from 'canvas-confetti';
import { Store } from '../../routes';
import { ISocialMedia } from './types/social-media';

function confettiAnimate() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 0,
      y: 0.8,
    },
  });
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 1,
      y: 0.8,
    },
  });
}

export function copyUrl(state: Store) {
  const result = document.querySelector('#result #text');
  navigator.clipboard.writeText(result!.textContent!);

  if (!state.showAlert) {
    state.showAlert = true;
  }
}

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string) => {
  let result;
  try {
    result = await fetch('/api/v1/shortener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl }),
    });
  } catch (err) {
    return null;
  }
  return result.json();
};

export function openLink() {
  const text = document.querySelector('#result #text')!.textContent;
  window.open(text!, '_blank');
}

export async function handleShortener({ state }: any) {
  const result = document.getElementById('result');
  const loader = document.getElementById('loading');
  const urlInput = normalizeUrl(state.inputValue);
  loader!.classList.replace('hidden', 'block');
  result!.classList.replace('block', 'hidden');

  const { newUrl } = await getShortenUrl(urlInput);

  // Remove the loader from the screen
  loader!.classList.replace('block', 'hidden');
  result!.classList.replace('hidden', 'block');

  state.inputValue = '';
  if (!newUrl) {
    result!.querySelector('#error')!.textContent = 'This url is invalid..';
    result!.querySelector('#text')!.textContent = '';
    result!.querySelector('#action')!.classList.replace('block', 'hidden');
    return;
  }

  result!.querySelector('#error')!.textContent = '';
  result!.querySelector('#text')!.textContent = window.location.href.split('#')[0] + newUrl;
  result!.querySelector('#action')!.classList.replace('hidden', 'block');

  state.showAlert = true;
  copyUrl(state);
  confettiAnimate();
}

/**
 * Share on social media
 * @param {String} socialMedia - Social network name
 */
export function shareOnSocialMedia(socialMedia:string) {
  const shorten_url = document.querySelector('#result #text')!.textContent;
  if(!shorten_url) return
  switch (socialMedia) {
    case "twitter":
      let base_url = "https://twitter.com/share?";
      const params:ISocialMedia = {
        text: "My url has just reduced!\nCheck out:",
        url: shorten_url ,
        hashtags: "reducedto,shortenurl",
      }
      for(const prop in params) {
        const index_value = params[`${prop}`]
        if(!index_value) continue
        base_url += `&${prop}=${encodeURIComponent(index_value)}`
      }
      window.open(base_url, '', 'left=0,top=auto,width=550,height=450');
      break;
    default:
      break;
  }
}

/**
 * Normalize input url
 *  - add protocol 'http' if missing.
 *  - correct protocol http/https if mistyped one character.
 * @param {String} url
 * @returns {String} Normalized url
 */
const normalizeUrl = (url: string): string => {
  const regexBadPrefix = new RegExp(/^(:\/*|\/+|https:\/*)/); // Check if starts with  ':', '/' and 'https:example.com' etc.
  const regexBadPrefixHttp = new RegExp(/^http:\/*/); // Check if 'http:example.com', 'http:/example.com' etc.
  const regexProtocolExists = new RegExp(/^(.+:\/\/|[^a-zA-Z])/); // Check if starts with '*://' or special chars.
  const regexMistypedHttp = new RegExp(
    /^([^hH][tT][tT][pP]|[hH][^tT][tT][pP]|[hH][tT][^tT][pP]|[hH][tT][tT][^pP])/
  );

  url = url
    .replace(regexMistypedHttp, 'http')
    .replace(regexBadPrefix, 'https://')
    .replace(regexBadPrefixHttp, 'http://');

  return (regexProtocolExists.test(url) ? '' : 'https://') + url;
};
