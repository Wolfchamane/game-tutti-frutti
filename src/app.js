import { LocaleEngine } from './js/locale.js';
import { TuttiFruttiGame } from './js/game.js';

window.addEventListener('DOMContentLoaded', () => {
    TuttiFruttiGame.$i(LocaleEngine.$i());
});
