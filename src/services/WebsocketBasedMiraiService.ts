import {MiraiService} from './MiraiService';
import {PluginInfo} from '../types/system/PluginInfo';
import {MiraiWebsocketConfig} from '../types/websocket/MiraiWebsocketConfig';
import {NotImplementedError} from '../types/MiraiException';
import {ResponseBase} from '../objects/Request';
import {GroupId} from '../objects/Group';
import {UserId} from '../objects/Friend';
import {MessageId} from '../objects/Message';
import {OutboundMessageChain} from '../objects/OutboundMessageChain';
import {MiraiClient} from '../../index';

export class WebsocketBasedMiraiService extends MiraiService {
	constructor(client: MiraiClient, private config: MiraiWebsocketConfig) {
		super(client, config.authKey, config.botId);
	}

	async fetchPluginInfo(): Promise<PluginInfo> {
		throw new NotImplementedError();
	}

	async setup(): Promise<void> {
		throw new NotImplementedError();
	}

	async teardown(): Promise<void> {
		throw new NotImplementedError();
	}

	fetchBotIds(): Promise<number[]> {
		return Promise.resolve([]);
	}

	respondToFriendRequest(response: ResponseBase): Promise<void> {
		return Promise.resolve(undefined);
	}

	respondToGroupInviteRequest(response: ResponseBase): Promise<void> {
		return Promise.resolve(undefined);
	}

	respondToGroupJoinRequest(response: ResponseBase): Promise<void> {
		return Promise.resolve(undefined);
	}

	revokeMessage(conversationId: GroupId | UserId, messageId: MessageId): Promise<void> {
		return Promise.resolve(undefined);
	}

	sendToFriend(id: UserId, msg: OutboundMessageChain): Promise<MessageId> {
		throw new NotImplementedError();
	}

	sendToGroup(groupId: GroupId, msg: OutboundMessageChain): Promise<MessageId> {
		throw new NotImplementedError();
	}

	sendToTemp(groupId: GroupId, id: UserId, msg: OutboundMessageChain): Promise<MessageId> {
		throw new NotImplementedError();
	}
}
