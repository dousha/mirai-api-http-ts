import { Mention, MessageContent, MessageContentType, PlainText, UrlBasedOutboundImage } from './Message';
import { TODO } from '../utils/TodoUtils';

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
	 * 解析 Mirai 码。
	 *
	 * @param {string} str Mirai 码
	 * @todo 正在开发，调用则会立刻抛出异常
	 */
	public static ofMiraiCode(str: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		TODO();
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
