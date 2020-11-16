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
	if (msg.message.type === MessageType.FRIEND_MESSAGE || msg.message.type === MessageType.GROUP_MESSAGE) {
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
