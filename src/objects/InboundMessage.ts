import {
	GroupMessageSender,
	Mention,
	Message,
	MessageContent,
	MessageContentType,
	MessageHeader,
	MessageType,
	PlainText,
	PrivateMessageSender,
	Quote,
} from './Message';
import { OutboundMessagingService } from '../services/OutboundMessagingService';
import { OutboundMessageChain } from './OutboundMessageChain';
import { AxiosResponse } from 'axios';
import { BasicResponse } from './ServerResponse';
import { TODO } from '../utils/TodoUtils';

/**
 * 入站消息
 */
export class InboundMessage {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param {Message} message 消息
	 * @param {OutboundMessagingService} srvc 发送服务
	 */
	constructor(public readonly message: Message, private readonly srvc: OutboundMessagingService) {
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
	 * @see OutboundMessageChain
	 * @since 0.0.1
	 */
	public reply(chain: OutboundMessageChain): Promise<AxiosResponse<BasicResponse>> {
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
		chain.prepend(quoteBlock);
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
		for (let msg of this.message.messageChain) {
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
			.join('\n');
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
	 * 将消息转为 Mirai 码。
	 *
	 * @todo 正在实现，现在调用会立刻抛出异常
	 */
	public toMiraiCode(): string {
		TODO();
		return '';
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
	public get id() {
		return this.header.id;
	}

	/**
	 * 获取发送方
	 *
	 * @returns {PrivateMessageSender | GroupMessageSender}
	 * @since 0.0.1
	 */
	public get sender() {
		switch (this.message.type) {
			case MessageType.FRIEND_MESSAGE:
				return this.message.sender as PrivateMessageSender;
			case MessageType.TEMP_MESSAGE:
			case MessageType.GROUP_MESSAGE:
				return this.message.sender as GroupMessageSender;
			default:
				throw new Error('Unknown message type ' + this.message.type);
		}
	}
}
