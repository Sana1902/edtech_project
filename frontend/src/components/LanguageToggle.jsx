import React, { useState, useEffect } from 'react';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState('en');

  // Initialize Google Translate
  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,mr',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };
    
    document.head.appendChild(script);
    
    // Initialize language from localStorage
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLang(savedLang);
    document.documentElement.setAttribute('lang', savedLang);
    
    // Apply saved language after Google Translate loads
    setTimeout(() => {
      if (savedLang !== 'en') {
        const select = document.querySelector('select.goog-te-combo');
        if (select) {
          select.value = savedLang;
          select.dispatchEvent(new Event('change'));
        }
      }
    }, 1000);
  }, []);

  const switchLanguage = (langCode) => {
    console.log('Switching to language:', langCode);
    
    // Update state
    setCurrentLang(langCode);
    
    // Save to localStorage
    localStorage.setItem('selectedLanguage', langCode);
    
    // Set document language attribute
    document.documentElement.setAttribute('lang', langCode);
    
    // Use Google Translate to change language
    const select = document.querySelector('select.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback: reload page
      window.location.reload();
    }
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