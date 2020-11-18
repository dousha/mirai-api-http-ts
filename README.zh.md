# `mirai-api-http-ts` - 简单而符合直觉的 `mira-api-http` TypeScript 封装

简体中文 | [English](README.md)

注意：这个项目正在活跃开发。我们会尽力保持向下兼容性，但不兼容的更改可能随时被引入。我们使用[语义化版本号](https://semver.org/lang/zh-CN/)作为兼容性参考。

## 动机

我寻思着得有一个简单的 `mirai-api-http` 的 TypeScript 库。

## 用法

获取这个库：

```
$ yarn add @dousha99/mirai-api-http-ts
- 或者 -
$ npm i --save @dousha99/mirai-api-http-ts
```

文档啊，文档[在写了](https://dousha.github.io/mirai-api-http-ts)（指新建 `gh-pages`）。

## 样例

简单的复读机：

```ts
import { MiraiClient, OutboundMessageChiain, Message } from '@dousha99/mirai-api-http-ts';

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
	if (msg.message.type === Message.MessageType.FRIEND_MESSAGE) {
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
