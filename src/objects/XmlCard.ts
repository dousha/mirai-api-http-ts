/**
 * XML 卡片
 *
 * @since 0.1.8
 */
import { MessageContentType, XmlMessage } from "./Message";

export class XmlCard {
	/**
	 * @constructor
	 * @param {string} title 标题
	 * @param {string} text 正文
	 * @param {string} coverUrl 封面 URL
	 * @param {XmlCardLayout} layout 样式，默认为 {@link XmlCardLayout.SHARE}
	 * @param {XmlCardControl} control 控件，默认为 {@link XmlCardControl.ALL}
	 */
	constructor(private readonly title: string, private readonly text: string, private readonly coverUrl: string, private readonly layout: XmlCardLayout = XmlCardLayout.SHARE, private readonly control: XmlCardControl = XmlCardControl.ALL) {
	}

	public get xmlChain(): XmlMessage {
		return {
			type: MessageContentType.XML,
			xml: this.xml
		};
	}

	public get xml(): string {
		return `<?xml version="1.0" encoding="utf-8" standalone="yes"?><msg flag="${this.control}" serviceID="1" brief=" templateID="1" action="plugin"><item layout="${this.layout}"><title><![CDATA[${this.title}]]></title><summary><![CDATA[${this.text}]]></summary><picture cover="${this.coverUrl}"/></item></msg>`;
	}
}

/**
 * XML 卡片的控件（转发、收藏）
 *
 * @enum {number}
 */
export enum XmlCardControl {
	ALL = 0,
	NO_FORWARDING = 1,
	NO_FAVORITE = 2,
	NONE = 3,
}

export enum XmlCardLayout {
	LINEAR = 0,
	RESERVED = 1,
	SHARE = 2,
	GALLERY = 3,
	SHARE_TITLE_ONY = 4,
	BACKDROP = 5,
	RESERVED_2 = 6,
}
