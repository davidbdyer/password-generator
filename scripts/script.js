const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

const lengthKey = 'pw_gen_length';
const upperKey = 'pw_gen_uppercase';
const lowerKey = 'pw_gen_lowercase';
const numberKey = 'pw_gen_numbers';
const symbolKey = 'pw_gen_symbols';

let password = '';

// Utility Functions
const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// setting local storage values
lengthEl.addEventListener('change', () => {
	localStorage.setItem(lengthKey, lengthEl.value);
	lengthEl.nextElementSibling.value = lengthEl.value;
});

uppercaseEl.addEventListener('change', () => {
	localStorage.setItem(upperKey, uppercaseEl.checked);
});

lowercaseEl.addEventListener('change', () => {
	localStorage.setItem(lowerKey, lowercaseEl.checked);
});

numbersEl.addEventListener('change', () => {
	localStorage.setItem(numberKey, numbersEl.checked);
});

symbolsEl.addEventListener('change', () => {
	localStorage.setItem(symbolKey, symbolsEl.checked);
});

// get and apply local storage values
window.addEventListener('load', () => {
	lengthEl.value = localStorage.getItem(lengthKey);
	lengthEl.nextElementSibling.value = lengthEl.value;

	const isChecked = (elm, localStorKey) => {
		if (localStorage.getItem(localStorKey) !== null) {
			elm.checked = localStorage.getItem(localStorKey) == 'true' ? true : false;
		}
	};

	isChecked(uppercaseEl, upperKey);
	isChecked(lowercaseEl, lowerKey);
	isChecked(numbersEl, numberKey);
	isChecked(symbolsEl, symbolKey);
});

//Copy To Clipboard
clipboardEl.addEventListener('click', async () => {
	if (!password) {
		return;
	}

	navigator.clipboard.writeText(password);
	resultEl.value = 'Copied!';
	await setTimeout(() => {resultEl.value = password}, 1500);
});

generateEl.addEventListener('click', () => {
	const length = parseInt(lengthEl.value);
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numbersEl.checked;
	const hasSymbol = symbolsEl.checked;

	password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
	resultEl.value = password;
});

const shuffleString = (string) => {
	const array = string.split('');
	let counter = array.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);

		counter--;

		const temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array.join('');
};

function getRandomLower() {
	const charRange = Math.floor(Math.random() * 26 + 97);
	return String.fromCharCode(charRange);
}

function getRandomUpper() {
	const charRange = Math.floor(Math.random() * 26 + 65);
	return String.fromCharCode(charRange);
}

function getRandomNumber() {
	const charRange = Math.floor(Math.random() * 10 + 48);
	return String.fromCharCode(charRange);
}

function getRandomSymbol() {
	const symbols = '!@#$%^&*(){}[]=<>/,.';
	const idx = Math.floor(Math.random() * symbols.length);
	return symbols[idx];
}

function generatePassword(lower, upper, number, symbol, length) {
	let generatedPassword = '';
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter((item) => Object.values(item)[0]);

	if (typesCount === 0) {
		return 'select something';
	}

	for (let i = 0; i < length; i++) {
		typesArr.forEach((type) => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}

	const shuffledPassword = shuffleString(generatedPassword);
	const finalPassword = shuffledPassword.slice(0, length);
	return finalPassword;
}
