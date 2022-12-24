const { openai } = require('./config');
const { getPrePrompt } = require('./utils');

async function chat(namespace, message) {
	let prompt = `The following is a series of conversations between two people labeled "YOU" and "ME". The person labeled "YOU" is always the same person, so all of their messages should carry the same tone and style.\n\n`;

	let searchQuery = message.split('* ME:').slice(-1)[0].trim();
	console.log('SEARCH QUERY:', searchQuery);
	prompt += await getPrePrompt(namespace, searchQuery);
	prompt += `\n\n* ME: ${message}\n* YOU:`;
	console.log(prompt);
	const response = await openai.createCompletion({
		model: process.env.OPENAI_COMPLETION_MODEL,
		prompt,
		max_tokens: 100,
		temperature: 0.7,//0
		stop: '* ME:'
	});

	return response.data.choices[0].text;
}

module.exports = { chat };
