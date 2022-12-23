const { chat } = require('./gpt');
const { encode } = require('gpt-3-encoder');
const { getEmbedding } = require('./embeddings');
const { getChatHistory } = require('./db');
const { upsertEmbeddings, query } = require('./pinecone');

async function processChatDB(number) {
	let chatHistory = await getChatHistory(number);
	chatHistory = chatHistory.filter(msg => msg.text); // rather than removing nulls, maybe replace with "[Attachment]" etc.?
	return chatHistory.map(msg => {
		return `${msg.is_from_me ? '* ME:' : `* YOU:`} ${msg.text}`;
	});
}

async function processConvo(chatHistory, namespace) {
	let chunks = chunkize(chatHistory).filter(x=>x);
	console.log(`${chunks.length} chunk(s)`);

	let reqSize = 1000; // axios ECONNRESET if reqSize is too large

	let embeddings = chunks.map(x => { return {text: x, embedding: null} });
	for (let i = 0; i < chunks.length; i += reqSize) {
		let res = await getEmbedding(chunks.slice(i, i + reqSize));
		for (let j = i; j < i + reqSize && j < chunks.length; j++) {
			embeddings[j].embedding = res[j - i];
		}
	}

	let timestamp = Date.now();
	embeddings = embeddings.map((x, i) => {
		return {
			id: i.toString(),
			metadata: {
				text: x.text,
				model: 'text-embedding-ada-002',
				chunkize: 'simple-100-max',
				timestamp
			},
			values: x.embedding
		};
	});

	await upsertEmbeddings(namespace, embeddings);
}

async function getPrePrompt(namespace, message) {
	const kTopK = 30;

	let messageEmbedding = (await getEmbedding(message))[0];
	
	let res = await query(namespace, {
		topK: kTopK,
		vector: messageEmbedding,
		includeMetadata: true
	});

	return res.matches.map(x => x.metadata.text).join('\n\n');
}

// Improve this!
function chunkize(arr) {
	let maxSize = 100//1500;
	let chunks = [''];
	for (let i in arr) {
		let entry = arr[i];
		let newChunk = chunks[chunks.length - 1] + '\n' + entry;
		try {
			if (encode(newChunk).length > maxSize) {
				if (encode(entry).length <= maxSize)
					chunks.push(entry);
				// else: entry over maxSize, deal with this
			}
			else chunks[chunks.length - 1] = newChunk;
		} catch (e) {
			// error tokenizing, look into
		}
	}
	return chunks;
}

module.exports = { getPrePrompt };
