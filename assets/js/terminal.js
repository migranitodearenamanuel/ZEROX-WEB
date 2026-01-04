/**
 * ZEROX Terminal Typer
 * Efecto de escritura tipo 'hacker' para elementos de texto.
 */
class TerminalTyper {
    constructor(selector, words, wait = 3000) {
        this.element = document.querySelector(selector);
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        if (!this.element) return;

        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="wrap">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Init Typewriter if element exists
    if (document.querySelector('.txt-type')) {
        const words = JSON.parse(document.querySelector('.txt-type').getAttribute('data-words'));
        new TerminalTyper('.txt-type', words);
    }
});
