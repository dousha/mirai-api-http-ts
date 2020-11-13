import { GroupMessageSender, Message, MessageHeader, MessageType, PrivateMessageSender } from './Message';
import { OutboundMessagingService } from '../services/OutboundMessagingService';
import { OutboundMessageChain } from './OutboundMessageChain';
import { AxiosResponse } from 'axios';
import { BasicResponse } from './ServerResponse';
import { TODO } from '../utils/TodoUtils';

export class InboundMessage {
	constructor(message: Message, srvc: OutboundMessagingService) {
		this.message = message;
		this.srvc = srvc;
	}

	public revoke() {
		if (this.message.type !== MessageType.GROUP_MESSAGE) {
			return Promise.reject('Cannot revoke a message of others');
		} else {
			return this.srvc.revokeMessage(this.id);
		}
	}

	public reply(chain: OutboundMessageChain): Promise<AxiosResponse<BasicResponse>> {
		switch (this.message.type) {
			case MessageType.GROUP_MESSAGE:
				return this.srvc.sendToGroup(((this.message.sender) as GroupMessageSender).group.id, chain);
			case MessageType.FRIEND_MESSAGE:
				return this.srvc.sendToFriend(this.message.sender.id, chain);
			case MessageType.TEMP_MESSAGE:
				return this.srvc.sendToTemp(((this.message.sender) as GroupMessageSender).group.id, this.message.sender.id, chain);
			default:
				return Promise.reject('');
		}
	}

	public toMiraiCode(): string {
		TODO();
		return '';
	}

	public readonly message: Message;
	private readonly srvc: OutboundMessagingService;

	public get header(): MessageHeader {
		return this.message.messageChain[0] as MessageHeader;
	}

	public get id() {
		return this.header.id;
	}

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
