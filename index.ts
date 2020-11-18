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
import { Group } from './src/objects/Message';
import { GroupMember } from './src/objects/GroupMember';
import { GroupManager } from './src/objects/GroupManager';

export interface MiraiClient extends EventEmitter {
	on(type: 'connect', cb: () => void): this;
	on(type: 'message', cb: (msg: InboundMessage) => void): this;
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
			this.ws.on('message', m => this.emit('message', m))
				.on('error', e => this.emit('error', e));
		} else {
			this.inbound = new InboundMessagingService(config.connection, this.auth, this.out, this.http);
			this.inbound.on('message', m => this.emit('message', m))
				.on('error', e => this.emit('error', e));
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
		return this.auth.obtainToken().then(() => {});
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
	 */
	public getGroupManager(groupId: number): GroupManager {
		return new GroupManager(groupId, this.http, this.auth);
	}

	public close() {
		this.ws?.close();
		this.inbound?.close();
		this.auth.close().catch(console.error);
	}

	private readonly http: HttpService;
	private readonly auth: SessionAuthenticationService;
	private readonly out: OutboundMessagingService;
	private ws?: WebSocketService;
	private inbound?: InboundMessagingService;
}

/* Re-exporting necessary stuff */

export { Config, InboundMessage, Friend, GroupManager };
export * as Message from './src/objects/Message';
export { OutboundMessageChain } from './src/objects/OutboundMessageChain';
export { StatusCode } from './src/objects/StatusCode';
