import { Config } from './src/objects/Config';
import { EventEmitter } from 'events';
import { InboundMessage } from './src/objects/InboundMessage';
import { HttpService } from './src/services/HttpService';
import { SessionAuthenticationService } from './src/services/SessionAuthenticationService';
import { WebSocketService } from './src/services/WebSocketService';
import { InboundMessagingService } from './src/services/InboundMessagingService';
import { OutboundMessagingService } from './src/services/OutboundMessagingService';
import { Friend } from './src/objects/Friend';
import { FriendListingResponse, GroupListingResponse, GroupMemberListingResponse } from './src/objects/ServerResponse';
import { GroupMember } from './src/objects/GroupMember';
import { GroupManager } from './src/objects/GroupManager';
import { Group } from './src/objects/Group';
import { Event, EventTypeLut } from './src/objects/Event';
import { Message, MessageTypeLut } from './src/objects/Message';
import { RequestBase, RequestConstructorLut, RequestTypeLut } from './src/objects/Request';
import { isEvent, isMessage, isRequest } from './src/utils/TypeUtils';

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
	/**
	 * @constructor
	 * @param {Config} config 客户端配置
	 */
	constructor(config: Config) {
		super();
		this.http = new HttpService(config.connection);
		this.auth = new SessionAuthenticationService(config.account, this.http);
		this.out = new OutboundMessagingService(this.auth, this.http);
		this.auth.obtainToken().then(token => {
			console.debug(`Obtained token ${token}`);
			this.emit('connect');
		});
		if (config.connection.useWebsocket) {
			this.ws = new WebSocketService(config.connection, this.auth, this.out);
			this.ws.on('message', obj => this.processMessage(obj)).on('error', e => this.emit('error', e));
		} else {
			this.inbound = new InboundMessagingService(config.connection, this.auth, this.out, this.http);
			this.inbound.on('message', m => this.processMessage(m)).on('error', e => this.emit('error', e));
		}
	}

	/**
	 * 等待机器人就绪
	 * <br>
	 * 这个函数存在的意义只是为了好看，或者说允许 `await` 机器人就绪。
	 * 它并没有特殊的用途，你也不需要等待机器人就绪后再注册回调函数。
	 *
	 * @since 0.1.4
	 */
	public waitForReady(): Promise<void> {
		return this.auth.obtainToken().then(() => { return; });
	}

	/**
	 * 获取好友列表
	 *
	 * @since 0.1.4
	 */
	public getFriendList(): Promise<Friend[]> {
		return this.auth.obtainToken().then(token =>
			this.http.get<FriendListingResponse>('/friendList', {
				sessionKey: token,
			})).then(x => x.data);
	}

	/**
	 * 获取群列表
	 *
	 * @since 0.1.4
	 */
	public getGroupList(): Promise<Group[]> {
		return this.auth.obtainToken().then(token =>
			this.http.get<GroupListingResponse>('/groupList', {
				sessionKey: token,
			}).then(x => x.data));
	}

	/**
	 * 获取群成员列表
	 *
	 * @param {number} groupId 群号
	 * @since 0.1.4
	 */
	public getMembersOfGroup(groupId: number): Promise<GroupMember[]> {
		return this.auth.obtainToken().then(token =>
			this.http.get<GroupMemberListingResponse>('/memberList', {
				sessionKey: token,
				target: groupId,
			}).then(x => x.data));
	}

	/**
	 * 获取群管理工具
	 *
	 * @param {number} groupId 群号
	 * @since 0.1.4
	 */
	public getGroupManager(groupId: number): GroupManager {
		return new GroupManager(groupId, this.http, this.auth);
	}

	/**
	 * 停止服务
	 *
	 * @since 0.0.1
	 */
	public close(): void {
		this.ws?.close();
		this.inbound?.close();
		this.auth.close().catch(console.error);
	}

	private processMessage(obj: unknown) {
		if (isMessage(obj)) {
			const inboundMsg = new InboundMessage(obj, this.out);
			this.emit('message', inboundMsg);
			this.emit(obj.type, inboundMsg);
		} else if (isEvent(obj)) {
			this.emit('event', obj);
			this.emit(obj.type, obj);
			if (isRequest(obj)) {
				this.emit('request', obj);
				const cons = RequestConstructorLut[obj.type];
				const req = new cons(this.auth, this.http, obj);
				this.emit(obj.type, req);
			}
		} else {
			console.warn(`Received unknown type of message: ${JSON.stringify(obj)}`);
		}
	}

	private readonly http: HttpService;
	private readonly auth: SessionAuthenticationService;
	private readonly out: OutboundMessagingService;
	private ws?: WebSocketService;
	private inbound?: InboundMessagingService;
}

/* Re-exporting necessary stuff */

export { Config, InboundMessage, Friend, GroupManager, Group, GroupMember, Event, FriendListingResponse, GroupListingResponse, GroupMemberListingResponse };
export * as Message from './src/objects/Message';
export { MessageType, FriendMessage, GroupMessage, TempMessage } from './src/objects/Message';
export { XmlCard } from './src/objects/XmlCard';
export { EventType, BotEventType, RequestType, GroupMemberEventType, GroupPolicyEventType, MessageEventType } from './src/objects/Event';
export * as Events from './src/objects/Event';
export { RequestBase, GroupJoinRequest, GroupInviteRequest, FriendRequest } from './src/objects/Request';
export { OutboundMessageChain } from './src/objects/OutboundMessageChain';
export { StatusCode } from './src/objects/StatusCode';
