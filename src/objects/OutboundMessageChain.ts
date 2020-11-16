import { MessageContent, MessageContentType, PlainText, UrlBasedOutboundImage } from './Message';
import { TODO } from '../utils/TodoUtils';

export class OutboundMessageChain {
	public prepend(x: MessageContent): OutboundMessageChain {
		this.content.unshift(x);
		return this;
	}

	public append(x: MessageContent): OutboundMessageChain {
		this.content.push(x);
		return this;
	}

	public concat(xs: OutboundMessageChain): OutboundMessageChain {
		this.content = this.content.concat(xs.content);
		return this;
	}

	public static ofText(msg: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const obj: PlainText = {
			type: MessageContentType.TEXT,
			text: msg,
		};
		out.append(obj);
		return out;
	}

	public static ofInternetImage(imageUrl: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		const obj: UrlBasedOutboundImage = {
			type: MessageContentType.IMAGE,
			url: imageUrl,
		};
		out.append(obj);
		return out;
	}

	public static ofMiraiCode(str: string): OutboundMessageChain {
		const out = new OutboundMessageChain();
		TODO();
		return out;
	}

	private content: MessageContent[] = [];

	public get chain(): MessageContent[] {
		return this.content;
	}
}
