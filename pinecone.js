require('dotenv').config();

const { PineconeClient } = require('pinecone-client');

async function upsertEmbeddings(namespace, vectors) {
	const pinecone = new PineconeClient({ namespace });
	await pinecone.upsert({vectors}); // TODO: mess with batchSize
}

async function query(namespace, params) {
	const pinecone = new PineconeClient({ namespace });
	return await pinecone.query(params);
}

module.exports = { upsertEmbeddings, query };
