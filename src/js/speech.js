'use strict';

var is_available = ('speechSynthesis' in window);

var preferred_language = null;

var service = {};

if (is_available) {
    var voices = [];
    
    speechSynthesis.onvoiceschanged = function (event) {
        voices = speechSynthesis.getVoices();
    };
    
    var get_voice_for_language = function (language) {
        var voice_matches_language = function (v) { return v.lang === language};
        var voices_for_lang = voices.filter(voice_matches_language);
        var preferred_voice = voices_for_lang.slice(-1)[0];
        if (!preferred_voice) {
            console.warn('Could not select voice for "%s"', language);
        }
        return preferred_voice;
    };
    
    service.say =  function (text) {
        var utterance = new SpeechSynthesisUtterance(text);
        var voice = get_voice_for_language(preferred_language);
        if (voice) {
            utterance.voice = voice;
        } else {
            utterance.lang = preferred_language;
        }
        speechSynthesis.speak(utterance);
    };
}

Object.defineProperty(service, 'language', {
    get: function () { return preferred_language; },
    set: function (language) { preferred_language = language; },
    enumerable: true,
    configurable: true
});

module.exports = service;