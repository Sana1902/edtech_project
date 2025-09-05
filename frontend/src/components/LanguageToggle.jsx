import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const [lang, setLang] = useState('en');
  const [widgetReady, setWidgetReady] = useState(false);
  const initializedRef = useRef(false);
  const pollRef = useRef(null);

  // Initialize language from cookie, localStorage, or default
  useEffect(() => {
    const getCurrentLanguage = () => {
      try {
        // First try cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'googtrans' && value && value !== 'undefined') {
            const parts = value.split('/');
            if (parts.length >= 3 && parts[2] && parts[2] !== 'undefined') {
              console.log('Found language cookie:', parts[2]);
              return parts[2]; // Target language
            }
          }
        }
        
        // Fallback to localStorage
        const storedLang = localStorage.getItem('googtrans');
        if (storedLang && storedLang !== 'undefined') {
          const parts = storedLang.split('/');
          if (parts.length >= 3 && parts[2] && parts[2] !== 'undefined') {
            console.log('Found language in localStorage:', parts[2]);
            return parts[2];
          }
        }
      } catch (error) {
        console.log('Error reading language preference:', error);
      }
      console.log('No valid language preference found, defaulting to English');
      return 'en'; // Default to English
    };
    
    const currentLang = getCurrentLanguage();
    setLang(currentLang);
    document.documentElement.setAttribute('lang', currentLang);
    console.log('Initial language set to:', currentLang);
  }, []);

  // Function to remove Google Translate elements (but preserve hidden select)
  const removeGoogleTranslateElements = () => {
    // Elements to completely remove (UI elements)
    const elementsToRemove = [
      '.goog-te-banner-frame',
      '.goog-te-gadget',
      '.goog-te-gadget-simple',
      '.goog-te-gadget-icon',
      '.goog-te-ftab',
      '.goog-te-ftab-link',
      '.goog-te-menu-value',
      'iframe[src*="translate.google.com"]',
      'iframe[src*="translate.googleapis.com"]',
      'div[class*="skiptranslate"]'
    ];

    elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    });

    // Hide but don't remove the select element (needed for functionality)
    const selectElement = document.querySelector('select.goog-te-combo');
    if (selectElement) {
      selectElement.style.display = 'none';
      selectElement.style.visibility = 'hidden';
      selectElement.style.position = 'absolute';
      selectElement.style.left = '-9999px';
      selectElement.style.top = '-9999px';
    }

    // Hide the main translate element container but don't remove it
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement) {
      translateElement.style.display = 'none';
      translateElement.style.visibility = 'hidden';
      translateElement.style.position = 'absolute';
      translateElement.style.left = '-9999px';
      translateElement.style.top = '-9999px';
    }

    // Remove any body classes added by Google Translate
    document.body.classList.remove('goog-te-banner-frame');
    document.body.style.top = '0';
    document.body.style.marginTop = '0';
    document.body.style.paddingTop = '0';
  };

  // Inject Google Translate script once
  useEffect(() => {
    if (initializedRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    window.googleTranslateElementInit = () => {
      try {
        console.log('Initializing Google Translate...');
        const container = document.createElement('div');
        container.id = 'google_translate_element';
        container.style.position = 'fixed';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.height = '0';
        container.style.width = '0';
        container.style.zIndex = '0';
        document.body.appendChild(container);
        
        // eslint-disable-next-line no-undef
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,mr',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
          gaTrack: false,
          gaId: null
        }, 'google_translate_element');
        
        console.log('Google Translate initialized');
        
        // Immediately remove any visible elements
        setTimeout(removeGoogleTranslateElements, 100);
        
        // Poll for the select to become available
        pollRef.current = window.setInterval(() => {
          const select = document.querySelector('select.goog-te-combo');
          if (select) {
            console.log('Google Translate select element found');
            window.clearInterval(pollRef.current);
            pollRef.current = null;
            setWidgetReady(true);
            // Remove elements again when select is ready
            removeGoogleTranslateElements();
          }
          // Continuously remove any new elements that appear
          removeGoogleTranslateElements();
        }, 300);
      } catch (error) {
        console.log('Error initializing Google Translate:', error);
      }
    };
    document.body.appendChild(script);
    initializedRef.current = true;
    
    // Set up continuous monitoring to remove elements
    const monitorInterval = setInterval(removeGoogleTranslateElements, 1000);
    
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      clearInterval(monitorInterval);
    };
  }, []);

  const setCookieLanguage = (code) => {
    try {
      const from = 'en';
      const to = code;
      const cookieVal = `/${from}/${to}`;
      
      // Try multiple cookie setting methods for better compatibility
      const cookieOptions = [
        `googtrans=${cookieVal};path=/;SameSite=Lax`,
        `googtrans=${cookieVal};path=/;SameSite=None;Secure`,
        `googtrans=${cookieVal};path=/`,
        `googtrans=${cookieVal};domain=${window.location.hostname};path=/;SameSite=Lax`
      ];
      
      cookieOptions.forEach(option => {
        try {
          document.cookie = option;
          console.log('Set cookie:', option);
        } catch (error) {
          console.log('Failed to set cookie:', option, error);
        }
      });
      
      // Also store in localStorage as backup
      try {
        localStorage.setItem('googtrans', cookieVal);
        console.log('Stored in localStorage:', cookieVal);
      } catch (error) {
        console.log('Failed to store in localStorage:', error);
      }
    } catch (error) {
      console.log('Error setting language cookie:', error);
    }
  };

  const switchLanguage = (code) => {
    console.log('Switching language to:', code); // Debug log
    
    // Update state immediately for UI feedback
    setLang(code);
    document.documentElement.setAttribute('lang', code);
    
    // Update cookie first
    setCookieLanguage(code);
    
    // Try multiple methods to trigger translation
    const select = document.querySelector('select.goog-te-combo');
    if (select) {
      try {
        console.log('Found select element, setting value to:', code);
        select.value = code;
        
        // Try different event types
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Also try direct Google Translate API if available
        if (window.google && window.google.translate) {
          try {
            window.google.translate.TranslateElement.getInstance().showBanner(false);
          } catch (e) {
            console.log('Google Translate API not available');
          }
        }
        
        // Remove any translate elements that might appear
        setTimeout(removeGoogleTranslateElements, 100);
        return;
      } catch (error) {
        console.log('Error with select method:', error);
      }
    }
    
    // Alternative method: Direct Google Translate API call
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      try {
        console.log('Using Google Translate API directly');
        const translateElement = window.google.translate.TranslateElement.getInstance();
        if (translateElement) {
          translateElement.showBanner(false);
        }
      } catch (error) {
        console.log('Error with Google Translate API:', error);
      }
    }
    
    // Fallback: reload to apply cookie-based translation
    console.log('Using fallback reload method');
    removeGoogleTranslateElements();
    window.setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const content = (
    <div className="lang-toggle lang-top-right" onClick={(e) => e.stopPropagation()}>
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
        aria-label="Switch to English"
        title="Switch to English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
        onClick={() => switchLanguage('mr')}
        aria-label="Switch to Marathi"
        title="Switch to Marathi"
      >
        मराठी
      </button>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default LanguageToggle;
