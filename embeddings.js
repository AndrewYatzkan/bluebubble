const { openai } = require('./config');

async function getEmbedding(input) {
	const response = await openai.createEmbedding({
		model: 'text-embedding-ada-002',
		input
	});
	return response.data.data.map(x => x.embedding);
}

module.exports = { getEmbedding };
