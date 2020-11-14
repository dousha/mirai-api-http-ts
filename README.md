# `mirai-api-http-ts` - Simple and Intuitive TypeScript Wrapper for `mira-api-http`

[简体中文](README.zh.md) | English

Note: This is an ongoing project. We will try our best to keep 
backward compatibility, but breaking changes can occur.
The version number conforms to [SemVer](https://semver.org/) as 
compatibility reference.

## Motivation

I just need a good enough TypeScript library for my bot. I guess 
you might need it too.

## Usage

Get the library:

```
$ yarn add @dousha99/mirai-api-http-ts
- or -
$ npm i --save @dousha99/mirai-api-http-ts
```

Documentation in progress...

## Examples

See `examples/` for working examples. Here is a simple echo bot example:

```ts
import { MiraiClient } from '../index';
import { MessageType } from '../src/objects/Message';
import { OutboundMessageChain } from '../src/objects/OutboundMessageChain';

const mirai = new MiraiClient({
	connection: {
		tls: false,
		host: 'localhost',
		httpPort: 8080,
		websocketPort: 8080,
		useWebsocket: true,
		pollPeriod: 5000,
		pollCount: 5,
	},
	account: {
		authKey: process.env['AUTH_KEY']!,
		account: Number(process.env['QQ']!),
	},
});
mirai.on('message', msg => {
	if (msg.message.type === MessageType.FRIEND_MESSAGE) {
		if (msg.isPlainTextMessage()) {
			const text = msg.getPlainText();
			msg.reply(OutboundMessageChain.ofText(text)).catch(e => console.error(e));
			if (text.trim() === 'stophammertime') {
				mirai.close();
			}
		}
	}
});
mirai.on('connect', () => {
	console.log('Ready');
});
```
