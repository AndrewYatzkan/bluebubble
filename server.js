const { chat } = require('./gpt');
const { processChatDB, processConvo } = require('./utils')

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json({limit: '10mb'}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/completion', async (req, res) => {
	let { input, ns } = req.body;
	if (!input || !ns?.trim()) return res.sendStatus(400);

	// let output = await chat('test_namespace_john_1', input);
	let output = await chat(ns, input);
	return res.send({response: output});
});

app.post('/embed', async (req, res) => {
	let { chats, number } = req.body;
	if (!chats || !number) return res.sendStatus(400);

	await processConvo(chats, number);
	return res.send({success: true});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
