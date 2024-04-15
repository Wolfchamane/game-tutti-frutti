/**
 * (C) 2024 - Arturo Martínez
 */

let tuttiFruttiGameSingleton;

class TuttiFruttiGame {
    #RANDOM_INTEGER_DELAY = 250;
    #CSS_ANIMATIONS_LONG_DELAY = 2000;
    #CSS_ANIMATIONS_LARGE_DELAY = 400;
    #CSS_ANIMATIONS_SHORT_DELAY = 300;

    static $i(locale = {}) {
        tuttiFruttiGameSingleton = tuttiFruttiGameSingleton || new TuttiFruttiGame(locale);

        return tuttiFruttiGameSingleton;
    }

    constructor(locale = {}) {
        this.ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');
        this.PLAYED_LETTERS = [];
        this.AVAILABLE_LETTERS = this.ALL_LETTERS;
        this.GAME_STARTED = false;
        this.SPECIAL_CHARACTERS = new Set([...['X', 'Y', 'Z'], ...locale.getText('specialCharacters')]);

        this._bindResetButton();
        this._bindRandomLetterButton();
        this._bindSpecialCharactersCheckbox();
        this._renderLetters();
        this._toggleGameOverlay();
        this._toggleAppOverlay();
    }

    _setLetterInGame(letter = '', cb) {
        document.querySelector('#letter-in-game .app-main__letter-in-game-letter').innerText = letter;
        if (letter) {
            document.querySelector(`#letter-${letter.toLowerCase()}`).classList.toggle('ready');
        }

        if (cb instanceof Function) {
            setTimeout(() => cb(), this.#CSS_ANIMATIONS_LARGE_DELAY);
        }
    }

    _toggleLetterInGame() {
        document.querySelector('#letter-in-game .app-main__letter-in-game-letter').classList.toggle('hide');
    }

    _toggleGameStatus(force = false) {
        this.GAME_STARTED = force || !this.GAME_STARTED;
        const specialCharactersCheckbox = document.querySelector('#special-characters');
        if (this.GAME_STARTED) {
            specialCharactersCheckbox.setAttribute('disabled', 'disabled');
        } else {
            specialCharactersCheckbox.removeAttribute('disabled');
        }
    }

    _reset() {
        this.PLAYED_LETTERS = [];
        this.AVAILABLE_LETTERS = this.ALL_LETTERS;

        document.querySelector('#generate-random-letter').removeAttribute('disabled');
        document.querySelector('#reset-game').setAttribute('disabled', 'disabled');
        document.querySelector('#no-more-letters-error p').classList.remove('show');
        Array.from(document.querySelectorAll('.letter')).forEach((node) => node.classList.add('ready'));
        document.querySelector('#generate-random-letter-row').classList.toggle('hide');
        document.querySelector('#special-characters-row').classList.toggle('hide');
        document.querySelector('#reset-game-row').classList.toggle('hide');
        this._setLetterInGame('');
        this._toggleGameStatus();
    }

    _randomInteger(max = 0, min = 0) {
        return new Promise((resolve) => {
            setTimeout(
                () => resolve(Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1) + Math.floor(min))),
                this.#RANDOM_INTEGER_DELAY
            );
        });
    }

    _randomLetter(letters = []) {
        return new Promise(async (resolve) => {
            const max = Number(letters.length - 1);
            const index = await this._randomInteger(max);
            resolve(letters[index]);
        });
    }

    _toggleGameOverlay() {
        const overlay = document.querySelector('#overlay');
        const isDisplayed = !overlay.classList.contains('hidden');

        if (isDisplayed) {
            overlay.classList.add('toggle');
            setTimeout(() => overlay.classList.add('hidden'), this.#CSS_ANIMATIONS_LARGE_DELAY);
        } else {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('toggle'), this.#CSS_ANIMATIONS_SHORT_DELAY);
        }
    }

    _renderLetters() {
        const allLetters = document.querySelector('#all-letters');
        Array.from(document.querySelectorAll('.letter')).forEach((node) => node.remove());

        this.ALL_LETTERS.forEach((letter) => {
            const letterSpan = document.createElement('SPAN');
            letterSpan.classList.add('letter');
            letterSpan.classList.add('ready');
            letterSpan.setAttribute('id', `letter-${letter.toLowerCase()}`);
            letterSpan.innerText = letter;
            allLetters.appendChild(letterSpan);
        });
    }

    _bindResetButton() {
        document.querySelector('#reset-game').addEventListener('click', this._reset);
    }

    _evalPlayedLetters() {
        if (this.PLAYED_LETTERS.length === this.ALL_LETTERS.length) {
            document.querySelector('#generate-random-letter').setAttribute('disabled', 'disabled');
            document.querySelector('#reset-game').removeAttribute('disabled');
            document.querySelector('#no-more-letters-error p').classList.toggle('show');
            document.querySelector('#generate-random-letter-row').classList.toggle('hide');
            document.querySelector('#special-characters-row').classList.toggle('hide');
            document.querySelector('#reset-game-row').classList.toggle('hide');
        }
    }

    _bindRandomLetterButton() {
        document.querySelector('#generate-random-letter').addEventListener('click', async (e) => {
            if (e instanceof Event) {
                e.preventDefault();
                e.stopPropagation();

                this._toggleLetterInGame();
                this._toggleGameStatus(true);
                this._toggleGameOverlay();

                this._randomLetter(this.AVAILABLE_LETTERS).then((letter = '') => {
                    this.PLAYED_LETTERS.push(letter);
                    this.AVAILABLE_LETTERS = this.ALL_LETTERS.filter((letter) => !this.PLAYED_LETTERS.includes(letter));

                    this._setLetterInGame(letter, () => {
                        this._toggleGameOverlay();
                        this._evalPlayedLetters();
                        this._toggleLetterInGame();
                    });
                });
            }
        });
    }

    _bindSpecialCharactersCheckbox() {
        const specialCharactersCheckbox = document.querySelector('#special-characters');
        specialCharactersCheckbox.addEventListener('change', (e) => {
            if (e instanceof Event) {
                e.preventDefault();
                e.stopPropagation();

                const { target } = e;
                const { checked } = target;

                if (checked) {
                    this.ALL_LETTERS.push(...this.SPECIAL_CHARACTERS);
                    this.ALL_LETTERS.sort();
                } else {
                    this.SPECIAL_CHARACTERS.forEach((char) => {
                        const indexOfChar = this.ALL_LETTERS.indexOf(char);
                        this.ALL_LETTERS.splice(indexOfChar, 1);
                    });
                }

                this._renderLetters();
            }
        });
    }

    _toggleAppOverlay() {
        const appOverlay = document.querySelector('#app-overlay');
        appOverlay.classList.toggle('app-overlay--slide');
        setTimeout(() => appOverlay.classList.toggle('hide'), this.#CSS_ANIMATIONS_LONG_DELAY);
    }
}

export { TuttiFruttiGame };
