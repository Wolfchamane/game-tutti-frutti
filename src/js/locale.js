const enEN = {
    labels: {
        newLetter: 'New letter',
        reset: 'Reset',
        generatingNewLetter: 'Generating new random letter ...',
        specialCharacters: 'Special Characters'
    },
    errors: {
        noMoreLetters: 'No more letters to play, please reset game to start again.'
    },
    specialCharacters: ['W']
};

const esES = {
    labels: {
        newLetter: 'Nueva letra',
        reset: 'Reiniciar',
        generatingNewLetter: 'Generando letra aleatoria ...',
        specialCharacters: 'Carácteres especiales'
    },
    errors: {
        noMoreLetters: 'No hay más letras disponibles, reinicia para empezar de nuevo.'
    },
    specialCharacters: ['CH', 'LL', 'Ñ', 'W']
};

let localeEngineSingleton;

class LocaleEngine {
    #LOCALE;

    static $i() {
        localeEngineSingleton = localeEngineSingleton || new LocaleEngine();

        return localeEngineSingleton;
    }

    constructor() {
        this.noMoreLettersErrorText = document.querySelector('#no-more-letters-error__text');
        this.specialCharactersText = document.querySelector('#special-characters__text');
        this.generateRandomLetterText = document.querySelector('#generate-random-letter__text');
        this.resetGameText = document.querySelector('#reset-game__text');
        this.appGameOverlayText = document.querySelector('.app-main__overlay-text');
        this.#LOCALE = this._getLocales();
        this._setDocumentLang();

        this.render();
    }

    get locale() {
        return this.#LOCALE;
    }

    get lang() {
        return this._getWindowLang();
    }

    _setDocumentLang() {
        document.children[0].setAttribute('lang', window.navigator.language.replace(/-\w+$/, ''));
    }

    _getWindowLang() {
        return window.navigator.language;
    }

    _getLocales() {
        return {
            es: esES,
            'es-ES': esES,
            en: enEN,
            'en-US': enEN,
            'en-GB': enEN
        }[this.lang];
    }

    _getter(ref = {}, key = '', sep = '.') {
        let value;

        if (key.lastIndexOf('.') !== -1) {
            const parts = key.split(sep);
            const first = parts.shift();

            value = Array.isArray(ref) && /\d+/.test(first) ? ref[Number(first)] : ref[first];

            if (value && typeof value === 'object') {
                value = this._getter(value, parts.join(sep));
            }
        } else {
            value = ref[key];
        }

        return value;
    }

    render() {
        this.noMoreLettersErrorText.innerText = this._getter(this.#LOCALE, 'errors.noMoreLetters');
        this.specialCharactersText.innerText = this._getter(this.#LOCALE, 'labels.specialCharacters');
        this.generateRandomLetterText.innerText = this._getter(this.#LOCALE, 'labels.newLetter');
        this.resetGameText.innerText = this._getter(this.#LOCALE, 'labels.reset');
        this.appGameOverlayText.innerText = this._getter(this.#LOCALE, 'labels.generatingNewLetter');
    }

    getText(key = '') {
        return this._getter(this.#LOCALE, key);
    }
}

export { LocaleEngine };
