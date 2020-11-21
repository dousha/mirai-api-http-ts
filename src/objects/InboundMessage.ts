import {
	Emoticon,
	GroupMessageSender,
	Image,
	Mention,
	Message,
	MessageContent,
	MessageContentType,
	MessageHeader,
	MessageSender,
	MessageType,
	PlainText,
	Quote,
	Voice,
} from './Message';
import { OutboundMessagingService } from '../services/OutboundMessagingService';
import { OutboundMessageChain } from './OutboundMessageChain';
import { AxiosResponse } from 'axios';
import { BasicResponse } from './ServerResponse';
import { escapeMirai } from '../utils/TextUtils';

/**
 * 入站消息
 */
export class InboundMessage<T extends Message> {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param {Message} message 消息
	 * @param {OutboundMessagingService} srvc 发送服务
	 */
	constructor(public readonly message: T, private readonly srvc: OutboundMessagingService) {
	}

	/**
	 * 撤销这条消息。
	 *
	 * 当该消息为好友消息或临时消息时，尝试撤销会导致 Promise 被立刻拒绝。
	 *
	 * 如果机器人没有权限撤销成员消息，那么返回的 {BasicResponse} 的 `code` 为非 0 值，具体见 {@link StatusCode}
	 *
	 * @since 0.0.1
	 */
	public revoke(): Promise<AxiosResponse<BasicResponse>> {
		if (this.message.type !== MessageType.GROUP_MESSAGE) {
			return Promise.reject('Cannot revoke a message of others');
		} else {
			return this.srvc.revokeMessage(this.id);
		}
	}

	/**
	 * 回复这条消息。
	 *
	 * @param {OutboundMessageChain} chain 消息链
	 * @param {boolean} useAt 回复时提到该消息的发送人。对于非群消息则该参数被忽略。默认为否。（自从 0.1.4 版本添加）
	 * @see OutboundMessageChain
	 * @since 0.0.1
	 */
	public reply(chain: OutboundMessageChain, useAt = false): Promise<AxiosResponse<BasicResponse>> {
		const header = this.header;
		const sender = this.message.sender;
		const quoteBlock: Quote = {
			type: MessageContentType.QUOTE,
			id: header.id,
			groupId: this.message.type === MessageType.GROUP_MESSAGE ? ((sender) as GroupMessageSender).group.id : 0,
			senderId: sender.id,
			targetId: sender.id,
			origin: this.message.messageChain,
		};
		chain.prepend(quoteBlock); // FIXME: it doesn't quite work as intended.
		if (useAt && this.message.type === MessageType.GROUP_MESSAGE) {
			const mentionBlock: Mention = {
				type: MessageContentType.MENTION,
				target: sender.id,
				display: '',
			};
			chain.append(mentionBlock);
		}
		switch (this.message.type) {
			case MessageType.GROUP_MESSAGE:
				return this.srvc.sendToGroup((sender as GroupMessageSender).group.id, chain);
			case MessageType.FRIEND_MESSAGE:
				return this.srvc.sendToFriend(sender.id, chain);
			case MessageType.TEMP_MESSAGE:
				return this.srvc.sendToTemp((sender as GroupMessageSender).group.id, this.message.sender.id, chain);
			default:
				return Promise.reject('Cannot reply to an event!');
		}
	}

	/**
	 * 这条消息是否为纯文字消息。
	 *
	 * @remarks 如果消息包含表情，则也会被判定为非纯文字消息。
	 * @since 0.0.1
	 */
	public isPlainTextMessage(): boolean {
		const firstPiece = this.getFirstPieceOfMessageContent();
		return firstPiece != null && firstPiece.type === MessageContentType.TEXT;
	}

	/**
	 * 这条消息是否为图片消息。
	 *
	 * @since 0.0.1
	 */
	public isImageMessage(): boolean {
		const firstPiece = this.getFirstPieceOfMessageContent();
		return firstPiece != null && firstPiece.type === MessageContentType.IMAGE;
	}

	/**
	 * 这条消息是否提到了机器人。
	 *
	 * @since 0.1.3
	 */
	public isMentioned(): boolean {
		return this.message.messageChain
			.filter(it => it.type === MessageContentType.MENTION && (it as Mention).target === this.srvc.account)
			.length > 0;
	}

	/**
	 * 获取消息中第一个由发送者产生的内容。这会跳过消息头和引用部分（如果有）。
	 *
	 * 如果发送者没有生产任何内容，则返回 undefined.
	 *
	 * @returns {MessageContent} 消息中第一个由发送者产生的内容
	 * @see MessageContent
	 * @since 0.0.1
	 */
	public getFirstPieceOfMessageContent(): MessageContent | undefined {
		for (const msg of this.message.messageChain) {
			if (msg.type === MessageContentType.MESSAGE_HEADER || msg.type === MessageContentType.QUOTE) {
				continue;
			}
			return msg;
		}
		return undefined;
	}

	/**
	 * 提取消息中的文字。
	 *
	 * 当消息中包含多个内容时，文字将会被滤出并用连接符连接。
	 *
	 * @param {string} joiner 连接符，默认为换行
	 * @since 0.1.3
	 */
	public extractText(joiner = '\n'): string {
		return this.message.messageChain
			.filter(it => it.type === MessageContentType.TEXT)
			.map(it => it as PlainText)
			.map(it => it.text)
			.join(joiner);
	}

	/**
	 * 获取消息中的文字。
	 *
	 * @deprecated 使用 {@link InboundMessage#extractText} 代替。
	 * @since 0.0.1
	 */
	public getPlainText(): string {
		return this.message.messageChain
			.filter(it => it.type === MessageContentType.TEXT)
			.map(it => it as PlainText)
			.map(it => it.text)
			.join('\n');
	}

	/**
	 * 将消息转为 Mirai 码。不可被转换的部分（未在规范中指明的部分）会被替换为 `[mirai:not-specified:${type}]`.
	 * 特殊的，回复引用部分将被丢弃。
	 * <br>
	 * 由于上游文档的不一致性，部分在文档中的内容也会被替换为 `[mirai:not-specified:...]`.
	 * 这些内容包括 `PokeMessage` ({@link InteractMessage}) 和 `VipFace` (未在 `mirai-api-http` 中实现).
	 * <br>
	 * 对于可以推测的内容，将转换为可能的形式，如 {@link Voice} 会被转换为 `[mirai:voice:${voiceId}]` 的形式。
	 * 消息头则按照 `mirai-console` 内的实现转换为 `[mirai:source:${id}]`. 如果不希望保留消息头，则传入 `true`.
	 *
	 * @param {boolean} discardHeader 是否去除消息头，默认为否
	 * @since 0.1.4
	 * @see {@link https://github.com/mamoe/mirai/blob/dev/docs/mirai-code-specification.md 规范文档}
	 */
	public toMiraiCode(discardHeader = false): string {
		return this.message.messageChain
			.map(it => {
				switch (it.type) {
					case MessageContentType.TEXT:
						return escapeMirai((it as PlainText).text);
					case MessageContentType.MENTION_ALL:
						return '[mirai:atall]';
					case MessageContentType.MENTION:
						return `[mirai:at:${(it as Mention).target},${escapeMirai((it as Mention).display)}]`;
					case MessageContentType.EMOTICON:
						return `[mirai:face:${(it as Emoticon).faceId}]`;
					case MessageContentType.TRANSIENT_IMAGE:
						return `[mirai:flash:${(it as Image).imageId}]`;
					case MessageContentType.IMAGE:
						return `[mirai:image:${(it as Image).imageId}]`;
					case MessageContentType.VOICE:
						return `[mirai:voice:${(it as Voice).voiceId}]`;
					case MessageContentType.SOURCE:
						return discardHeader ? '' : `[mirai:source:${(it as MessageHeader).id}]`;
					case MessageContentType.QUOTE:
						return '';
					default:
						return `[mirai:not-specified:${it.type}]`;
				}
			})
			.join('');
	}

	/**
	 * 获取消息头
	 *
	 * @returns {MessageHeader}
	 * @since 0.0.1
	 */
	public get header(): MessageHeader {
		return this.message.messageChain[0] as MessageHeader;
	}

	/**
	 * 获取发送方 ID
	 *
	 * @since 0.0.1
	 */
	public get id(): number {
		return this.header.id;
	}

	/**
	 * 获取发送方
	 *
	 * @returns {PrivateMessageSender | GroupMessageSender}
	 * @since 0.0.1
	 */
	public get sender(): MessageSender {
		return this.message.sender;
	}
}
