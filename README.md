# BlueBubble

Website: [--not yet registered--](https://bluebubble.ai/)

## How it works
BlueBubble creates a realistic continuation of iMessage conversations using OpenAI's GPT-3 model in concert with their embeddings API to feed relevant information into the pre-prompt.

## To-do
- Misc
	- [ ] Investigate incomplete chat.db's (seemingly random messages missing)
	- [ ] Use cl100k_base tokenizer for embeddings (low priority)
		- Using GPT-3 tokenizer as a proxy, which overestimates the number of tokens
		- Probably wouldn't ever want to max out single embedding size anyway
- UI/UX
	- [ ] Remove extra space when word wraps in text ([example](https://i.stack.imgur.com/fWKfj.png))
	- [ ] Scroll to next/prev page
	- [ ] UI options to adjust temperature and `topK`
	- [ ] Share with [iMessage link preview](https://scottbartell.com/2019/03/05/implementing-imessage-link-previews/)
- Scaling
	- [x] Use vector search engine -- used Pinecone
	- [ ] Queue
	- [ ] Payment system (or self-supply OpenAI key)
- Security
	- [ ] Only store raw text client-side
	- [ ] Client-side SQLite with arbitrary levels of sanitization
- Model quality
	- [ ] Experiment with different prompts
	- [ ] Better chunkizer
		- Don't create a new chunk in the middle of a conversation (you have timestamps!)
		- Ideally each chunk would be (1) "conversation"
			- larger => more context, smaller => better search
			- what about small embeddings then fetching the larger conversation?
	- [ ] Use embeddings to include diverse convos in pre-prompt
		- Could develop a better understanding of the person

## Future features
- [ ] Support for group chats
- [ ] iMessage wrapped
