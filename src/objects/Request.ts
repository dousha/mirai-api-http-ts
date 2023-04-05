import {Event, RequestType} from './Event';
import {MiraiService} from '../services/MiraiService';

export type RequestId = number;

/**
 * 请求基类
 *
 * @since 0.1.6
 */
export interface RequestBase extends Event {
	type: RequestType;
	eventId: RequestId;
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
	eventId: RequestId;
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
	 * @param srvc Mirai 服务
	 * @param event 事件
	 * @protected
	 */
	protected constructor(protected readonly srvc: MiraiService, protected readonly event: RequestBase) {
	}

	/**
	 * 同意该请求
	 *
	 * @param {string} msg 回复信息，默认为空
	 */
	abstract accept(msg?: string): Promise<void>;

	/**
	 * 拒绝该请求
	 *
	 * @param {string} msg 回复信息，默认为空
	 */
	abstract reject(msg?: string): Promise<void>;

	protected assembleResponse(reply: number, message = ''): ResponseBase {
		return {
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
	 * @param srvc
	 * @param event
	 */
	constructor(srvc: MiraiService, event: FriendRequest) {
		super(srvc, event);
	}

	accept(msg?: string): Promise<void> {
		return this.srvc.respondToFriendRequest(this.assembleResponse(FriendResponseType.ACCEPT, msg));
	}

	reject(msg?: string): Promise<void> {
		return this.srvc.respondToFriendRequest(this.assembleResponse(FriendResponseType.REJECT, msg));
	}

	/**
	 * 拒绝且加入黑名单
	 *
	 * @param {string} msg 回复消息，默认为空
	 */
	rejectAndBlacklist(msg?: string): Promise<void> {
		return this.srvc.respondToFriendRequest(this.assembleResponse(FriendResponseType.REJECT_AND_BLACKLIST, msg));
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
	 * @param srvc
	 * @param event
	 */
	constructor(srvc: MiraiService, event: GroupJoinRequest) {
		super(srvc, event);
	}

	accept(msg?: string): Promise<void> {
		return this.srvc.respondToGroupJoinRequest(this.assembleResponse(FriendResponseType.ACCEPT, msg));
	}

	reject(msg?: string): Promise<void> {
		return this.srvc.respondToGroupJoinRequest(this.assembleResponse(FriendResponseType.REJECT, msg));
	}

	/**
	 * 忽略该请求
	 *
	 * @param msg 回复消息，默认为空
	 */
	public ignore(msg = ''): Promise<void> {
		return this.srvc.respondToGroupJoinRequest(this.assembleResponse(GroupJoinResponseType.IGNORE, msg));
	}

	/**
	 * 拒绝且加入黑名单
	 *
	 * @param msg 回复消息，默认为空
	 */
	public rejectAndBlacklist(msg = ''): Promise<void> {
		return this.srvc.respondToGroupJoinRequest(this.assembleResponse(GroupJoinResponseType.REJECT_AND_BLACKLIST, msg));
	}

	/**
	 * 忽略且加入黑名单
	 *
	 * @param msg 回复消息，默认为空
	 */
	public ignoreAndBlacklist(msg = ''): Promise<void> {
		return this.srvc.respondToGroupJoinRequest(this.assembleResponse(GroupJoinResponseType.IGNORE_AND_BLACKLIST, msg));
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
	 * @param srvc
	 * @param event
	 */
	constructor(srvc: MiraiService, event: GroupInviteRequest) {
		super(srvc, event);
	}

	accept(msg?: string): Promise<void> {
		return this.srvc.respondToGroupInviteRequest(this.assembleResponse(GroupInviteResponseType.ACCEPT, msg));
	}

	reject(msg?: string): Promise<void> {
		return this.srvc.respondToGroupInviteRequest(this.assembleResponse(GroupJoinResponseType.REJECT, msg));
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
