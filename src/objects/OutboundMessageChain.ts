import {
	Emoticon,
	IdBasedOutboundImage,
	Mention,
	MentionAll,
	Message,
	MessageContent,
	MessageContentType,
	PlainText,
	UrlBasedOutboundImage,
	Voice,
} from './Message';
import { XmlCard } from './XmlCard';

/**
 * 出方向消息链
 */
export class OutboundMessageChain {
	/**
	 * 在头部加入内容。
	 *
	 * @param {MessageContent} x 消息内容块
	 * @since 0.0.1
	 */
	public prepend(x: MessageContent): OutboundMessageChain {
		this.content.unshift(x);
		return this;
	}

	/**
	 * 在尾部加入内容。
	 *
	 * @param {MessageContent} x 消息内容块
	 * @since 0.0.1
	 */
	public append(x: MessageContent): OutboundMessageChain {
		this.content.push(x);
		return this;
	}

	/**
	 * 追加文字消息。
	 *
	 * @param {string} msg 要追加的消息
	 * @since 0.1.3
	 */
	public appendText(msg: string): OutboundMessageChain {
		this.append({
			type: MessageContentType.TEXT,
			text: msg,
		} as PlainText);
		return this;
	}

	/**
	 * 合并两条消息链。这个合并会返回新的消息链，原有的两条消息链不做更改。
	 *
	 * @param {OutboundMessageChain} xs 要被合并的消息链，追加在本消息链之后
	 * @since 0.0.1
	 */
	public concat(xs: OutboundMessageChain): OutboundMessageChain {
		this.content = this.content.concat(xs.content);
		return this;
	}

	/**
	 * 构建一个纯文字出站消息链。
	 *
	 * @param {string} msg 要发送的文字
	 * @since 0.0.1
	 */
	public static ofText(msg: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const obj: PlainText = {
			type: MessageContentType.TEXT,
			text: msg,
		};
		out.append(obj);
		return out;
	}

	/**
	 * 构建一个图片出站消息链。从网络获取图片。
	 *
	 * @param {string} imageUrl 图片 URL
	 * @since 0.0.1
	 */
	public static ofInternetImage(imageUrl: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const obj: UrlBasedOutboundImage = {
			type: MessageContentType.IMAGE,
			url: imageUrl,
		};
		out.append(obj);
		return out;
	}

	/**
	 * 构建一个提到他人的消息链。
	 *
	 * @param {number} id 被提到的人的 QQ 号
	 * @since 0.1.3
	 */
	public static ofMention(id: number): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const obj: Mention = {
			type: MessageContentType.MENTION,
			target: id,
			display: '', // 出站时忽略
		};
		out.append(obj);
		return out;
	}

	/**
	 * 从入站消息构建消息链。
	 *
	 * @param {Message} msg 入站消息
	 * @since 0.1.6
	 */
	public static ofMessage(msg: Message): OutboundMessageChain {
		const out = new OutboundMessageChain();
		out.content = msg.messageChain;
		return out;
	}

	/**
	 * 构建一个 XML 消息链。
	 *
	 * @param {XmlCard} card XML 卡片实例
	 * @since 0.1.8
	 */
	public static ofXmlCard(card: XmlCard): OutboundMessageChain {
		const out = new OutboundMessageChain();
		out.append(card.xmlChain);
		return out;
	}

	/**
	 * 从多个消息内容构建消息链。
	 *
	 * @param {MessageContent} content 消息内容，不定参数
	 * @since 0.1.8
	 */
	public static ofMultiple(...content: MessageContent[]): OutboundMessageChain {
		const out = new OutboundMessageChain();
		out.content = content;
		return out;
	}

	/**
	 * 从消息链数组构建消息链。
	 *
	 * @param {MessageContent[]} content 消息内容
	 * @since 0.1.8
	 */
	public static ofChain(content: MessageContent[]): OutboundMessageChain {
		const out = new OutboundMessageChain();
		out.content = content;
		return out;
	}

	/**
	 * 解析 Mirai 码。如果明文中包含方括号，则需要用反斜杠转义。
	 * 可以使用 {@link escapeMirai} 方法。
	 * <br>
	 * 由于上游文档的不一致性，部分在文档中的内容也不会进行转义。
	 * 这些内容包括 `PokeMessage` ({@link InteractMessage}) 和 `VipFace` (未在 `mirai-api-http` 中实现).
	 * <br>
	 * 解析器会忽略 `source` 标签。
	 * <br>
	 * 解析器将不抛出异常，除非遇到数字转换失败，其他任何的错误都将会被安静地忽略。
	 * 如果解析遇到不能理解或尚未实现的标签，则会保留原标签内容。
	 * 解析器会最大限度地从不合法的输入中恢复，但可能会出现不可预料的后果。
	 * <br>
	 * 注意：参数将不会 `trim()`. 任何白字符将会被保留。
	 *
	 * @param {string} str Mirai 码
	 * @since 0.1.7
	 * @see {@link https://github.com/mamoe/mirai/blob/dev/docs/mirai-code-specification.md 规范文档}
	 */
	public static ofMiraiCode(str: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const iter = str[Symbol.iterator]();
		let escapeNext = false, inTag = false;
		let item = iter.next();
		let buf = '', paramBuf = '';
		const params: Array<string> = [];
		while (!item.done) {
			if (item.value === '\\') {
				if (escapeNext) {
					buf += '\\';
				} else {
					escapeNext = true;
				}
			} else if (item.value === '[') {
				if (escapeNext) {
					buf += '[';
				} else {
					if (inTag) {
						// malformed tag
						buf += paramBuf + '[';
						paramBuf = '';
						inTag = false;
					} else {
						// flush previous block
						if (buf.length > 0) {
							out.appendText(buf);
							buf = '';
						}
						paramBuf = '';
						inTag = true;
					}
				}
			} else if (item.value === ']') {
				if (escapeNext) {
					if (inTag) {
						paramBuf += ']';
					} else {
						buf += ']';
					}
				} else {
					// flush the last part
					params.push(paramBuf);
					// assemble tags
					// the first part must be mirai:*
					const identifier = params[0];
					const identifierParts = identifier.split(':');
					if (identifierParts[0] !== 'mirai' || identifierParts.length < 2) {
						// bad tag
						buf += '[' + params.join(',') + ']';
					} else {
						if (identifierParts.length > 2) {
							const firstParam = identifierParts[2];
							switch(identifierParts[1]) {
								case 'at':
									out.append({
										type: MessageContentType.MENTION,
										target: Number(firstParam),
										display: ''
									} as Mention);
									break;
								case 'face':
									out.append({
										type: MessageContentType.EMOTICON,
										faceId: Number(firstParam)
									} as Emoticon);
									break;
								case 'flash':
									out.append({
										type: MessageContentType.TRANSIENT_IMAGE,
										imageId: firstParam,
									} as IdBasedOutboundImage);
									break;
								case 'image':
									out.append({
										type: MessageContentType.IMAGE,
										imageId: firstParam,
									} as IdBasedOutboundImage);
									break;
								case 'voice':
									out.append({
										type: MessageContentType.VOICE,
										voiceId: firstParam
									} as Voice);
									break;
								case 'source':
									// this tag is ignored
									break;
								default:
									// unidentified tag
									buf += '[' + params.join(',') + ']';
									break;
							}
						} else {
							switch(identifierParts[1]) {
								case 'atall':
									out.append({
										type: MessageContentType.MENTION_ALL
									} as MentionAll);
									break;
								default:
									// unidentified tag
									buf += '[' + params.join(',') + ']';
									break;
							}
						}
					}
					inTag = false;
				}
			} else {
				if (inTag) {
					if (item.value === ',') {
						if (escapeNext) {
							paramBuf += ',';
						} else {
							params.push(paramBuf);
							paramBuf = '';
						}
					}
				} else {
					buf += item.value;
				}
			}
			escapeNext = false;
			item = iter.next();
		}
		return out;
	}

	private content: MessageContent[] = [];

	/**
	 * 获取消息链
	 */
	public get chain(): MessageContent[] {
		return this.content;
	}
}
