const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');
// const copyModalEl = document.getElementById('copy-modal');

const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

clipboardEl.addEventListener('click', async () => {
	const password = resultEl.innerText;

	const close = async () => {
		await copyModalEl.close();
		copyModalEl.style.animation = '';
		copyModalEl.removeEventListener('animationend', close);
	};

	if (!password) {
		return;
	}

	navigator.clipboard.writeText(password);
	// copyModalEl.showModal();
	// await sleep(2000);
	// copyModalEl.style.animation = 'fade-out 1s';

	// copyModalEl.addEventListener('animationend', close);
});

generateEl.addEventListener('click', () => {
	const length = parseInt(lengthEl.value);
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numbersEl.checked;
	const hasSymbol = symbolsEl.checked;

	resultEl.textContent = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
});

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

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
