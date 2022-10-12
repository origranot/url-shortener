import { component$, createContext, useContextProvider, useRef, useStore, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ShortenerAlert } from '~/components/alert/alert';
import { GithubButton } from '~/components/github-button/github-button';
import { copyUrl, downloadQRCode, generateQRCode, handleShortener, openLink } from '~/components/shortener-input/handleShortener';
import { ShortenerInput } from '~/components/shortener-input/shortener-input';
import { Waves } from '~/components/waves/waves';
import animations from '../assets/css/animations.css?inline';
import loader from '../assets/css/loader.css?inline';
import styles from './index.css?inline';

export const InputContext = createContext('input');

export interface Store {
  showAlert: false
}

export default component$(() => {
  useStylesScoped$(animations)
  useStylesScoped$(styles)
  useStylesScoped$(loader)

  const shortenerInputRef = useRef();

  const state = useStore<Store>({
    showAlert: false
  });

  useContextProvider(InputContext, state);
  
  return (
      <div class="mx-auto container grid grid-cols-12">
        <div class="col-span-2"></div>
        <div class="col-span-8">
          <div className="flex flex-col">
            <div className="flex justify-end my-5">
            <GithubButton type="Star" user="origranot" repo="url-shortener" isLarge showCount label="Star"></GithubButton>
          </div>
          <article class="prose mx-auto max-w-4xl pb-16">
            <h1>
              URL Shortener
            </h1>
            <p>
              Add your very long <b>URL</b> in the input bellow and click on the button to make it shorter
            </p>    
          </article>
          <ShortenerInput
            ref={shortenerInputRef}
            onKeyUp$={(event) => { 
              if (event.key.toLowerCase() === 'enter') {
                handleShortener({ state })
              }
              
            }}
          ></ShortenerInput>
          <div id="loading" class="hidden fade-in">
            <div class="lds-dual-ring"></div>
          </div>
          <div id="result" class="hidden">
            <p id="error" className="fade-in"></p>
            <p id="text" className="fade-in" onClick$={() => copyUrl({state})}></p>
            <div id="action" className="hidden btn-group">
              <button type="button" className="btn hover:btn-primary" onClick$={() => copyUrl({state})}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              </button>
              <button type="button" className="btn hover:btn-primary" onClick$={() => openLink()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>
              <button type="button" className="btn hover:btn-primary" onClick$={() => generateQRCode()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
              </button>
            </div>
          </div>
          <div id="qrcode" className="hidden flex-column align-items-center">
            <canvas className='m-2'></canvas>
            <a href="#qrcode" className="text-center text-white" onClick$={() => downloadQRCode()}>Download QRCode</a>
          </div>
          <ShortenerAlert/>
          <Waves/>
          </div>
        </div>
	      <div class="col-span-2"></div>
        
      </div>
  );
});

export const head: DocumentHead = {
  title: 'URL Shortener',
};
