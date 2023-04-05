import {Config} from './src/objects/Config';
import {EventEmitter} from 'events';
import {InboundMessage} from './src/objects/InboundMessage';
import {Friend} from './src/objects/Friend';
import {FriendListingResponse, GroupListingResponse, GroupMemberListingResponse} from './src/objects/ServerResponse';
import {GroupMember} from './src/objects/GroupMember';
import {Group} from './src/objects/Group';
import {Event, EventTypeLut} from './src/objects/Event';
import {Message, MessageTypeLut} from './src/objects/Message';
import {RequestBase, RequestTypeLut} from './src/objects/Request';
import {URL} from 'url';
import {InvalidDataError} from './src/types/MiraiException';
import {MiraiService} from './src/services/MiraiService';
import {HttpBasedMiraiService} from './src/services/HttpBasedMiraiService';
import {WebsocketBasedMiraiService} from './src/services/WebsocketBasedMiraiService';

export interface MiraiClient extends EventEmitter {
	on(type: 'connect', cb: () => void): this;

	on(type: 'message', cb: (msg: InboundMessage<Message>) => void): this;

	on<U extends keyof MessageTypeLut>(type: U, cb: (msg: InboundMessage<MessageTypeLut[U]>) => void): this;

	on(type: 'event', cb: (ev: Event) => void): this;

	on<U extends keyof EventTypeLut>(type: U, cb: (ev: EventTypeLut[U]) => void): this;

	on(type: 'request', cb: (ev: RequestBase) => void): this;

	on<U extends keyof RequestTypeLut>(type: U, cb: (req: RequestTypeLut[U]) => void): this;

	on(type: 'error', cb: (err?: Error) => void): this;
}

/**
 * 客户端核心类
 */
export class MiraiClient extends EventEmitter {
	private readonly service: MiraiService;

	/**
	 * @constructor
	 * @param {Config} config 客户端配置
	 */
	constructor(private readonly config: Config) {
		super();
		const url = new URL(config.connection.uri);
		const protocol = url.protocol.toLowerCase();
		if (protocol.startsWith('http')) {
			// use http
			this.service = new HttpBasedMiraiService(this, {
				baseUrl: config.connection.uri,
				timeout: config.connection.timeout,
				pollInterval: config.connection.pollPeriod,
				pollCount: config.connection.pollCount,
				authKey: config.account.authKey,
				botId: config.account.account
			});
		} else if (protocol.startsWith('ws')) {
			// use ws
			this.service = new WebsocketBasedMiraiService(this, {
				endpoint: config.connection.uri,
				authKey: config.account.authKey,
				botId: config.account.account
			});
		} else {
			throw new InvalidDataError(`Unknown protocol ${protocol}`);
		}

		this.installSignalHandler();
	}

	/**
	 * 停止服务
	 *
	 * @since 0.0.1
	 */
	public async close(): Promise<void> {
		await this.service.teardown();
	}

	public getService(): MiraiService {
		return this.service;
	}

	private installSignalHandler() {
		const cleanup = () => {
			this.close().finally(() => {
				process.exit(0);
			});
		};

		process.once('uncaughtException', cleanup);
		process.once('SIGTERM', cleanup);
		process.once('SIGINT', cleanup);
	}
}

/* Re-exporting necessary stuff */

export {
	Config,
	InboundMessage,
	Friend,
	Group,
	GroupMember,
	Event,
	FriendListingResponse,
	GroupListingResponse,
	GroupMemberListingResponse
};
export * as Message from './src/objects/Message';
export {MessageType, FriendMessage, GroupMessage, TempMessage} from './src/objects/Message';
export {XmlCard} from './src/objects/XmlCard';
export {
	EventType, BotEventType, RequestType, GroupMemberEventType, GroupPolicyEventType, MessageEventType
} from './src/objects/Event';
export * as Events from './src/objects/Event';
export {RequestBase, GroupJoinRequest, GroupInviteRequest, FriendRequest} from './src/objects/Request';
export {OutboundMessageChain} from './src/objects/OutboundMessageChain';
export {StatusCode} from './src/objects/StatusCode';
