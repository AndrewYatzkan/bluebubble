const msgContainer = document.querySelector('.imessage');
const spacer = document.querySelector('p.spacer');
let teaser = document.querySelector('.teaser');
let uploadContainer = document.querySelector('.upload-container');
let about = document.querySelector('.about');
let downArrow = document.querySelector('.arrow.down');
let upArrow = document.querySelector('.arrow.up');

let navLock = false;
let page = 0;
let pages = [{
	up: {text: ''},
	down: {
		text: '\u00A0Get Started',
		hide: teaser,
		show: uploadContainer
	}
}, {
	up: {
		text: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Landing',
		hide: uploadContainer,
		show: teaser
	},
	down: {
		text: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0About',
		hide: uploadContainer,
		show: about
	}
}, {
	up: {
		text: '\u00A0\u00A0\u00A0Get Started',
		hide: about,
		show: uploadContainer
	},
	down: {text: ''}
}];

function changePage(e) {
	if (navLock) return;
	navLock = true;
	let down = Array.from(e.target.classList).includes('down');
	let key = down ? 'down' : 'up';

	let { hide, show } = pages[page][key];
	hide.classList.remove('show-up', 'show-down');
	hide.style.display = 'flex';
	hide.classList.add('hidden-' + key);

	downArrow.classList.add('blink');
	upArrow.classList.remove('second-half');
	downArrow.classList.remove('second-half');
	if (!page) upArrow.classList.add('second-half');
	if (page === pages.length - 1) downArrow.classList.add('second-half');
	upArrow.classList.add('blink');
	setTimeout(() => {
		show.classList.remove('hidden-up', 'hidden-down', 'hidden');
		show.classList.add('show-' + key);

		page += down ? 1 : -1;
		let { text: downText } = pages[page].down;
		let { text: upText } = pages[page].up;

		upArrow.style.display = upText ? 'block' : 'none';
		downArrow.style.display = downText ? 'block' : 'none';

		downArrow.dataset.text = downText;
		upArrow.dataset.text = upText;
	}, 250);
	setTimeout(() => {
		hide.style.display = 'none';
		setTimeout(() => {
			show.classList.add('show');
			show.classList.remove('show-up', 'show-down');
			hide.classList.remove('hidden-up', 'hidden-down', 'show');
			hide.classList.add('hidden');
			navLock = false;
		}, 250)

		downArrow.classList.remove('blink');
		upArrow.classList.remove('blink');
	}, 500);
}

downArrow.addEventListener('click', changePage);
upArrow.addEventListener('click', changePage);

function addMessage(content, received, emoji, unsafe) {
	let p = document.createElement('p');
	p.classList.add(`from-${received ? 'them' : 'me'}`)
	if (received) p.classList.add('margin-b_none');
	if (emoji) p.classList.add('emoji', 'no-tail');
	p[unsafe ? 'innerHTML' : 'innerText'] = content;
	spacer.insertAdjacentElement('beforebegin', p);

	msgContainer.scroll(0, msgContainer.scrollHeight);
}

function clearChat() {
	abort();
	document.querySelectorAll('p.from-them:not(.spacer), p.from-me').forEach(x => x.remove());
}

let lock = false;
let welcomeCleared = false;
addMessage(`Welcome to <a href="https://bluebubble.ai">bluebubble.ai</a>!`, true, false, true);
addMessage(`Click "Get Started" on the right-hand side for instructions & FAQ`, false, false, true);
addMessage(`Join the <a href="https://discord.gg/kKkH5hDMaT" target="_blank">Discord</a> if you have further questions or visit the <a href="https://github.com/AndrewYatzkan/bluebubble" target="_blank">GitHub repo</a> to contribute!`, true, false, true);
addMessage(`????????????`, false, true);
addMessage(`Time to get chatting!`, false, false, true);

let input = document.querySelector('.message');
let sendBtn = document.querySelector('img.send');

input.focus();

let controller, signal;
abort();
function abort() {
	if (controller) controller.abort();
	controller = new AbortController();
	signal = controller.signal;
}

const EMOJI_REGEX = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){1,3}$/;

async function computeResponse(input, ns) {
	abort(); // abort previous requests
	let req = await fetch('/completion', {
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({input, ns}),
	    signal
	});
	let { response } = await req.json();
	return response;
}

async function sendMessage() {
	if (lock) return;

	let value = input.value;
	input.value = '';
	input.parentElement.style.height = `1rem`;

	if (value.trim() == '/clear') return clearChat();
	if (value.trim() == '') return;
	if (!welcomeCleared) {
		welcomeCleared = true;
		clearChat();
	}

	let emoji = EMOJI_REGEX.test(value.replace(/\s/g, ''));
	addMessage(value, false, emoji);

	let history = '';
	document.querySelectorAll('p.from-them:not(.spacer), p.from-me').forEach(x => {
	    let them = x.classList.contains('from-them');
	    history += `* ${them ? 'YOU' : 'ME'}: ${x.innerText}\n`;
	});

	let activeNS = localStorage.getItem('activeNS');
	let response = await computeResponse(history.trim().substr(6), activeNS);
	let messages = response.split('* YOU:');
	let delay = 1000;

	lock = true;
	let j = 0;
	for (let i in messages) {
		let message = messages[i].trim();
		if (!message && ++j) continue;
		let n = parseInt(i) - j;
		let emoji = EMOJI_REGEX.test(message.replace(/\s/g, ''));
		setTimeout(() => addMessage(message, true, emoji), n * delay);
	}
	setTimeout(() => lock = false, (messages.length - 1) * delay);
}

sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keydown', e => {
	if (e.keyCode === 13 && !e.shiftKey) {
		sendMessage();
		return e.preventDefault();
	}

});

// resize box
input.addEventListener('input', e => {
	let padding = parseInt(window.getComputedStyle(input).getPropertyValue('padding-top')) * 2;
	input.parentElement.style.height = `1rem`;
	let height = input.scrollHeight;
	if (height > 16 * 10) height = 16 * 10;
	input.parentElement.style.height = `${height - padding}px`;
});