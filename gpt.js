const { openai } = require('./config');
const { getPrePrompt } = require('./utils');

async function chat(namespace, message) {
	let prompt = await getPrePrompt(namespace, message);
	prompt += `\n\n* ME: ${message}\n* YOU:`;
	console.log(prompt);
	const response = await openai.createCompletion({
		model: process.env.OPENAI_COMPLETION_MODEL,
		prompt,
		max_tokens: 100,
		temperature: 0.7//0
	});

	return response.data.choices[0].text;
}

module.exports = { chat };
