const { chat } = require('./gpt');
const { processChatDB, processConvo } = require('./utils')

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/completion', async (req, res) => {
	let { input } = req.body;
	if (!input) return res.sendStatus(400);

	// let output = await chat('test_namespace_john_1', input);
	let output = await chat('smtz', input);
	return res.send({response: output});
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// let from = '+16305452222';
// let to = '+16305452223';
// let snowflake = `${to}-${from}-${Date.now()}`;

// (async () => {
// 	let chatHistory = await processChatDB('+12242450947');
// 	await processConvo(chatHistory, "test_namespace_john_1")
// 	let res = await chat('test_namespace_john_1', `is golf a sport lmao`);
// 	console.log(res);
// })();
