import { MiraiClient, OutboundMessageChain } from '../index';
import { MessageType } from '../src/objects/Message';

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

mirai.on(MessageType.GROUP_MESSAGE, msg => {
	msg.reply(OutboundMessageChain.ofText(msg.extractText())).catch(console.error);
});

mirai.on(MessageType.FRIEND_MESSAGE, msg => {
	msg.reply(OutboundMessageChain.ofText(msg.extractText())).catch(console.error);
});

mirai.on('connect', () => {
	console.log('Ready');
});
