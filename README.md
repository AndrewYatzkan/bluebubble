# BlueBubble

Website: [bluebubble.ai](https://bluebubble.ai/)

## How it works
BlueBubble creates a realistic continuation of iMessage conversations using OpenAI's GPT-3 model in concert with their embeddings API to feed relevant information into the pre-prompt.

## To-do
- Misc
	- [ ] Share URL to let others chat with your bot
		- Important feature because you can't currently train a chat from your phone, and we want mobile users to be able to use this
		- Note: with some prompt injection, you could leak the preprompt
			- Responses would be truncated, and the injection would be part of the search query, so would be difficult to extract a meaningful chunk of conversation history in practice, but nonetheless a security risk
			- Make this risk clear to the user
	- [ ] Investigate incomplete chat.db's (seemingly random messages missing)
		- [Useful Reddit thread](https://www.reddit.com/r/osx/comments/uevy32/texts_are_missing_from_mac_chatdb_file_despite/) (macOS Ventura problem?)
	- [ ] Use cl100k_base tokenizer for embeddings (low priority)
		- Using GPT-3 tokenizer as a proxy, which overestimates the number of tokens
		- Probably wouldn't ever want to max out single embedding size anyway
- UI/UX
	- [ ] Padding on up/down arrows
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
