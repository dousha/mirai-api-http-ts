import { Event, RequestType } from './Event';
import { SessionAuthenticationService } from '../services/SessionAuthenticationService';
import { HttpService } from '../services/HttpService';
import { BasicResponse } from './ServerResponse';
import { AxiosResponse } from 'axios';

/**
 * 请求基类
 *
 * @since 0.1.6
 */
export interface RequestBase extends Event {
	type: RequestType;
	eventId: number;
	fromId: number;
	groupId: number;
	nick: string;
	message: string;
}

/**
 * 回复基类
 *
 * @since 0.1.6
 */
export interface ResponseBase extends Record<string, unknown> {
	sessionKey: string;
	eventId: number;
	fromId: number;
	groupId: number;
	operate: number;
	message: string;
}

/**
 * 请求基类
 *
 * @since 0.1.6
 */
export abstract class InboundRequest {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param auth 验证服务
	 * @param http HTTP 服务
	 * @param path 请求路径
	 * @param event 事件
	 * @protected
	 */
	protected constructor(protected readonly auth: SessionAuthenticationService, protected readonly http: HttpService, protected readonly event: RequestBase, protected readonly path: string) {
	}

	/**
	 * 回复该请求
	 *
	 * @param {number} v 回复值
	 * @param {string} msg 回复信息，默认为空
	 */
	public reply(v: number, msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.auth.obtainToken().then(token => this.http.post<BasicResponse>(this.path, this.assembleResponse(token, v, msg)));
	}

	/**
	 * 同意该请求
	 *
	 * @param {string} msg 回复信息，默认为空
	 */
	public accept(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(0, msg);
	}

	/**
	 * 拒绝该请求
	 *
	 * @param {string} msg 回复信息，默认为空
	 */
	public reject(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(1, msg);
	}

	private assembleResponse(token: string, reply: number, message: string): ResponseBase {
		return {
			sessionKey: token,
			eventId: this.event.eventId,
			fromId: this.event.fromId,
			groupId: this.event.groupId,
			operate: reply,
			message: message,
		};
	}
}

export interface FriendRequest extends RequestBase {
	type: RequestType.FRIEND_REQUEST;
}

/**
 * 好友添加请求
 *
 * @extends InboundRequest
 * @since 0.1.6
 */
export class FriendRequest extends InboundRequest {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param auth
	 * @param http
	 * @param event
	 */
	constructor(auth: SessionAuthenticationService, http: HttpService, event: FriendRequest) {
		super(auth, http, event, '/resp/newFriendRequestEvent');
	}

	/**
	 * 拒绝且加入黑名单
	 *
	 * @param {string} msg 回复消息，默认为空
	 */
	public rejectAndBlacklist(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(FriendResponseType.REJECT_AND_BLACKLIST, msg);
	}
}

export enum FriendResponseType {
	ACCEPT = 0,
	REJECT = 1,
	REJECT_AND_BLACKLIST = 2
}

export interface FriendResponse extends ResponseBase {
	operate: FriendResponseType;
}

export interface GroupJoinRequest extends RequestBase {
	type: RequestType.GROUP_JOIN_REQUEST;
	groupName: string;
}

/**
 * 群成员申请加入请求
 *
 * @extends InboundRequest
 * @since 0.1.6
 */
export class GroupJoinRequest extends InboundRequest {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param auth
	 * @param http
	 * @param event
	 */
	constructor(auth: SessionAuthenticationService, http: HttpService, event: GroupJoinRequest) {
		super(auth, http, event, '/resp/memberJoinRequestEvent');
	}

	/**
	 * 忽略该请求
	 *
	 * @param msg 回复消息，默认为空
	 */
	public ignore(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(GroupJoinResponseType.IGNORE, msg);
	}

	/**
	 * 拒绝且加入黑名单
	 *
	 * @param msg 回复消息，默认为空
	 */
	public rejectAndBlacklist(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(GroupJoinResponseType.REJECT_AND_BLACKLIST, msg);
	}

	/**
	 * 忽略且加入黑名单
	 *
	 * @param msg 回复消息，默认为空
	 */
	public ignoreAndBlacklist(msg = ''): Promise<AxiosResponse<BasicResponse>> {
		return this.reply(GroupJoinResponseType.IGNORE_AND_BLACKLIST, msg);
	}
}

export enum GroupJoinResponseType {
	ACCEPT = 0,
	REJECT = 1,
	IGNORE = 2,
	REJECT_AND_BLACKLIST = 3,
	IGNORE_AND_BLACKLIST = 4
}

export interface GroupJoinResponse extends ResponseBase {
	operate: GroupJoinResponseType;
}

export interface GroupInviteRequest extends RequestBase {
	type: RequestType.GROUP_INVITE_REQUEST;
	groupName: string;
}

/**
 * 邀请入群请求
 *
 * @extends InboundRequest
 * @since 0.1.6
 */
export class GroupInviteRequest extends InboundRequest {
	/**
	 * @constructor
	 * @hideconstructor
	 * @param auth
	 * @param http
	 * @param event
	 */
	constructor(auth: SessionAuthenticationService, http: HttpService, event: GroupInviteRequest) {
		super(auth, http, event, '/resp/botInvitedJoinGroupRequestEvent');
	}
}

export enum GroupInviteResponseType {
	ACCEPT = 0,
	REJECT = 1
}

export interface GroupInviteResponse extends ResponseBase {
	operate: GroupInviteResponseType;
}

export type RequestTypeLut = {
	[RequestType.FRIEND_REQUEST]: FriendRequest,
	[RequestType.GROUP_JOIN_REQUEST]: GroupJoinRequest,
	[RequestType.GROUP_INVITE_REQUEST]: GroupInviteRequest
};

// FIXME: figure out the correct type
export const RequestConstructorLut: Record<RequestType, any> = {
	[RequestType.FRIEND_REQUEST]: FriendRequest,
	[RequestType.GROUP_INVITE_REQUEST]: GroupInviteRequest,
	[RequestType.GROUP_JOIN_REQUEST]: GroupJoinRequest,
};
