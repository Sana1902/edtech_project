import React, { useState, useEffect } from 'react';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState('en');

  // Initialize Google Translate
  useEffect(() => {
    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      initializeTranslate();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="translate.google.com"]')) {
      // Wait for existing script to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkGoogle);
          initializeTranslate();
        }
      }, 100);
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    window.googleTranslateElementInit = () => {
      initializeTranslate();
    };
    
    document.head.appendChild(script);

    function initializeTranslate() {
      // Check if element already exists
      const existingElement = document.getElementById('google_translate_element');
      if (existingElement && existingElement.children.length > 0) {
        return; // Already initialized
      }

      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,mr',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
      
      console.log('Google Translate initialized');
    }
    
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang === 'mr') {
      // If Marathi was previously selected, set the cookie
      document.cookie = 'googtrans=/en/mr; path=/; SameSite=Lax';
      setCurrentLang('mr');
      document.documentElement.setAttribute('lang', 'mr');
      console.log('Restoring Marathi translation');
    } else {
      // Default to English
      setCurrentLang('en');
      document.documentElement.setAttribute('lang', 'en');
      // Clear any translation cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('Setting English as default');
    }
  }, []);

  const switchLanguage = (langCode) => {
    console.log('Switching to language:', langCode);
    
    // Update state
    setCurrentLang(langCode);
    
    // Save to localStorage
    localStorage.setItem('selectedLanguage', langCode);
    
    // Set document language attribute
    document.documentElement.setAttribute('lang', langCode);
    
    // Simple approach: reload page with language preference
    if (langCode === 'mr') {
      // Set cookie for Marathi translation
      document.cookie = 'googtrans=/en/mr; path=/; SameSite=Lax';
      console.log('Setting Marathi translation cookie');
    } else {
      // Clear cookie for English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('Clearing translation cookie for English');
    }
    
    // Reload page to apply language change
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Language toggle buttons */}
      <div className="lang-toggle lang-top-right">
      <button
          className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
        aria-label="Switch to English"
        title="Switch to English"
      >
        EN
      </button>
      <button
          className={`lang-btn ${currentLang === 'mr' ? 'active' : ''}`}
        onClick={() => switchLanguage('mr')}
        aria-label="Switch to Marathi"
        title="Switch to Marathi"
      >
        मराठी
      </button>
    </div>
    </>
  );
};

export default LanguageToggle;