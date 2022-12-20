const msgContainer = document.querySelector('.imessage');

// emoji true if message is exactly 1-3 emojis
function addMessage(content, received, emoji, unsafe) {
	let p = document.createElement('p');
	p.classList.add(`from-${received ? 'them' : 'me'}`)
	if (emoji) p.classList.add('emoji', 'no-tail');
	p[unsafe ? 'innerHTML' : 'innerText'] = content;
	msgContainer.insertAdjacentElement('beforeend', p);
}

addMessage(`Welcome to <a href="https://bluebubble.ai">bluebubble.ai</a>!`, true, false, true);
addMessage(`Click "next page" on the right-hand side for instructions & FAQ`, false, false, true);
addMessage(`Join the <a href="https://discord.gg/kKkH5hDMaT" target="_blank">Discord</a> if you have further questions or visit the <a href="https://github.com/AndrewYatzkan/bluebubble" target="_blank">GitHub repo</a> to contribute!`, true, false, true);
addMessage(`🔥🔥🔥`, false, true);
addMessage(`Time to get chatting!`, false, false, true);
