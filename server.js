const { chat } = require('./gpt');
const { processChatDB, processConvo } = require('./utils')

const express = require('express');
const app = express();
const port = 3000;

let activeNS;

app.use(express.static('public'));
// app.use(express.json());
app.use(express.json({limit: '10mb'}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/completion', async (req, res) => {
	let { input } = req.body;
	if (!input) return res.sendStatus(400);

	// let output = await chat('test_namespace_john_1', input);
	let output = await chat(activeNS, input);
	return res.send({response: output});
});

app.post('/embed', async (req, res) => {
	let { chats, number } = req.body;
	if (!chats || !number) return res.sendStatus(400);

	await processConvo(chats, number);
	activeNS = number;
	console.log(`active namespace: ${activeNS}`);

	return res.send({success: true});
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// let from = '+16305452222';
// let to = '+16305452223';
// let snowflake = `${to}-${from}-${Date.now()}`;

(async () => {
	// let chatHistory = await processChatDB('+16302403773');
	// await processConvo(chatHistory, "emma")
	// let res = await chat('test_namespace_john_1', `is golf a sport lmao`);
	// console.log("done");
})();
