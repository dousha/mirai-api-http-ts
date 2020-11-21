import { Group } from './Group';
import { GroupPermission } from './GroupPermission';

/**
 * 事件类型
 */
export type EventType = BotEventType | MessageEventType | GroupPolicyEventType | GroupMemberEventType | RequestType;

/**
 * 与机器人有关的事件
 */
export enum BotEventType {
	BOT_ONLINE = 'BotOnlineEvent',
	BOT_OFFLINE = 'BotOfflineEventActive',
	BOT_OFFLINE_FORCED = 'BotOfflineEventForce',
	BOT_OFFLINE_DISCONNECTED = 'BotOfflineEventDropped',
	BOT_RELOGIN = 'BotReloginEvent',
	BOT_PERMISSION_CHANGED = 'BotGroupPermissionChangeEvent',
	BOT_MUTED = 'BotMuteEvent',
	BOT_UNMUTED = 'BotUnmuteEvent',
	BOT_GROUP_JOINED = 'BotJoinGroupEvent',
	BOT_GROUP_PARTED = 'BotLeaveEventActive',
	BOT_GROUP_KICKED = 'BotLeaveEventKick',
	BOT_CONNECTIVITY_CHANGED = 'BotConnectivityChangedEvent'
}

/**
 * 消息撤回事件
 */
export enum MessageEventType {
	GROUP_MESSAGE_RECALL = 'GroupRecallEvent',
	GROUP_MESSAGE_REVOKE = 'GroupRecallEvent',
	FRIEND_MESSAGE_RECALL = 'FriendRecallEvent',
	FRIEND_MESSAGE_REVOKE = 'FriendRecallEvent',
}

/**
 * 群管理事件
 */
export enum GroupPolicyEventType {
	GROUP_NAMED_CHANGED = 'GroupNameChangeEvent',
	GROUP_ANNOUNCEMENT_CHANGED = 'GroupEntranceAnnouncementChangeEvent',
	GROUP_MUTE_CHANGED = 'GroupMuteAllEvent',
	GROUP_ANONYMOUS_CHAT_POLICY_CHANGED = 'GroupAllowAnonymousChatEvent',
	GROUP_CONFESS_TALK_POLICY_CHANGED = 'GroupAllowConfessTalkEvent',
	GROUP_INVITE_POLICY_CHANGED = 'GroupAllowMemberInviteEvent',
}

/**
 * 群成员事件
 */
export enum GroupMemberEventType {
	GROUP_MEMBER_JOINED = 'MemberJoinEvent',
	GROUP_MEMBER_KICKED = 'MemberLeaveEventKick',
	GROUP_MEMBER_PARTED = 'MemberLeaveEventQuit',
	GROUP_MEMBER_RENAMED = 'MemberCardChangeEvent',
	GROUP_MEMBER_TITLE_CHANGED = 'MemberSpecialTitleChangeEvent',
	GROUP_MEMBER_PERMISSION_CHANGED = 'MemberPermissionChangeEvent',
	GROUP_MEMBER_MUTED = 'MemberMuteEvent',
	GROUP_MEMBER_UNMUTED = 'MemberUnmuteEvent',
}

export type EventTypeLut = {
	[BotEventType.BOT_ONLINE]: BotOnlineEvent,
	[BotEventType.BOT_OFFLINE]: BotOfflineEvent,
	[BotEventType.BOT_OFFLINE_DISCONNECTED]: BotDisconnectedOfflineEvent,
	[BotEventType.BOT_OFFLINE_FORCED]: BotForcedOfflineEvent,
	[BotEventType.BOT_MUTED]: BotMutedEvent,
	[BotEventType.BOT_UNMUTED]: BotUnmutedEvent,
	[BotEventType.BOT_RELOGIN]: BotReloginEvent,
	[BotEventType.BOT_PERMISSION_CHANGED]: BotPermissionChangedEvent,
	[BotEventType.BOT_GROUP_JOINED]: BotJoinedGroupEvent,
	[BotEventType.BOT_GROUP_KICKED]: BotKickedFromGroupEvent,
	[BotEventType.BOT_GROUP_PARTED]: BotPartedGroupEvent,
	[MessageEventType.GROUP_MESSAGE_REVOKE]: GroupMessageRevokedEvent,
	[MessageEventType.FRIEND_MESSAGE_REVOKE]: FriendMessageRevokedEvent,
	[GroupPolicyEventType.GROUP_NAMED_CHANGED]: GroupNameChangedEvent,
	[GroupPolicyEventType.GROUP_ANNOUNCEMENT_CHANGED]: GroupAnnouncementChangedEvent,
	[GroupPolicyEventType.GROUP_MUTE_CHANGED]: GroupChatPolicyChangedEvent,
	[GroupPolicyEventType.GROUP_ANONYMOUS_CHAT_POLICY_CHANGED]: GroupAnonymousChatPolicyChangedEvent,
	[GroupPolicyEventType.GROUP_CONFESS_TALK_POLICY_CHANGED]: GroupConfessTalkPolicyChangedEvent,
	[GroupPolicyEventType.GROUP_INVITE_POLICY_CHANGED]: GroupInvitePolicyChangedEvent,
	[GroupMemberEventType.GROUP_MEMBER_JOINED]: GroupMemberJoinedEvent,
	[GroupMemberEventType.GROUP_MEMBER_KICKED]: GroupMemberKickedEvent,
	[GroupMemberEventType.GROUP_MEMBER_PARTED]: GroupMemberPartedEvent,
	[GroupMemberEventType.GROUP_MEMBER_RENAMED]: GroupMemberNameChangedEvent,
	[GroupMemberEventType.GROUP_MEMBER_TITLE_CHANGED]: GroupMemberTitleChangedEvent,
	[GroupMemberEventType.GROUP_MEMBER_PERMISSION_CHANGED]: GroupMemberPermissionChangedEvent,
	[GroupMemberEventType.GROUP_MEMBER_MUTED]: GroupMemberMutedEvent,
	[GroupMemberEventType.GROUP_MEMBER_UNMUTED]: GroupMemberUnmutedEvent,
};

/**
 * 请求事件类型
 *
 * @enum {string}
 */
export enum RequestType {
	FRIEND_REQUEST = 'NewFriendRequestEvent',
	GROUP_JOIN_REQUEST = 'MemberJoinRequestEvent',
	GROUP_INVITE_REQUEST = 'BotInvitedJoinGroupRequestEvent'
}

/**
 * 机器人连接状态
 */
export enum BotConnectivity {
	ONLINE = 'Online',
	OFFLINE = 'Offline',
	KICKED = 'Kicked',
	DISCONNECTED = 'Disconnected'
}

/**
 * 事件发起者
 */
export interface Operator {
	/** QQ 号 */
	id: number;
	/** 成员名 */
	memberName: string;
	/** 成员权限 */
	permission: GroupPermission;
	/** 所属群 */
	group: Group;
}

/**
 * 事件基类
 */
export interface Event {
	/** 事件类型 */
	type: EventType;
}

export interface BotConnectivityChangeEvent extends Event {
	type: BotEventType.BOT_CONNECTIVITY_CHANGED;
	qq: number;
	state: BotConnectivity;
}

/**
 * 机器人连通性事件基类
 */
export interface BotConnectivityBaseEvent extends Event {
	/** 事件类型 */
	type: BotEventType;
	/** QQ 号 */
	qq: number;
}

/**
 * 机器人上线事件
 */
export interface BotOnlineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_ONLINE;
}

/**
 * 机器人主动下线事件
 */
export interface BotOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE;
}

/**
 * 机器人被迫下线事件
 */
export interface BotForcedOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE_FORCED;
}

/**
 * 机器人掉线事件
 */
export interface BotDisconnectedOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE_DISCONNECTED;
}

/**
 * 机器人掉线重连事件
 */
export interface BotReloginEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_RELOGIN;
}

/**
 * 机器人群权限更改事件
 */
export interface BotPermissionChangedEvent extends Event {
	type: BotEventType.BOT_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
	group: Group;
}

/**
 * 机器人被禁言事件
 */
export interface BotMutedEvent extends Event {
	type: BotEventType.BOT_MUTED;
	durationSeconds: number;
	operator: Operator;
}

/**
 * 机器人禁言解除事件
 * <br>
 * 似乎仅在主动解除时触发？
 */
export interface BotUnmutedEvent extends Event {
	type: BotEventType.BOT_UNMUTED;
	operator: Operator;
}

/**
 * 机器人群管理事件基类
 */
export interface BotGroupBaseEvent extends Event {
	type: BotEventType;
	/** 所属群 */
	group: Group;
}

/**
 * 机器人加入群聊事件
 */
export interface BotJoinedGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_JOINED;
}

/**
 * 机器人主动离开群聊事件
 */
export interface BotPartedGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_PARTED;
}

/**
 * 机器人被踢出群聊事件
 */
export interface BotKickedFromGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_KICKED;
}

/**
 * 群消息被撤回事件
 */
export interface GroupMessageRevokedEvent extends Event {
	type: MessageEventType.GROUP_MESSAGE_REVOKE;
	/** 消息发送者 QQ */
	authorId: number;
	/** 消息 ID */
	messageId: number;
	/** 撤回时间（Unix 时间戳） */
	time: number;
	/** 所属群 */
	group: Group;
	/** 撤回消息者对象 */
	operator: Operator;
}

/**
 * 好友消息撤回事件
 */
export interface FriendMessageRevokedEvent extends Event {
	type: MessageEventType.FRIEND_MESSAGE_REVOKE;
	/** 消息发送者 QQ */
	authorId: number;
	/** 消息 ID */
	messageId: number;
	/** 撤回时间 */
	time: number;
	/** 撤回消息者 QQ */
	operator: number; // WTF
}

/**
 * 群政策变更事件基类
 */
export interface GroupPolicyChangedEvent extends Event {
	type: GroupPolicyEventType;
	/** 变更前值 */
	origin: unknown;
	/** 变更后值 */
	current: unknown;
	/** 所属群 */
	group: Group;
	/** 操作者对象 */
	operator: Operator;
}

export interface GroupStringPolicyChangedEvent extends GroupPolicyChangedEvent {
	origin: string;
	current: string;
}

export interface GroupBinaryPolicyChangedEvent extends GroupPolicyChangedEvent {
	origin: boolean;
	current: boolean;
}

/**
 * 群名更改事件
 */
export interface GroupNameChangedEvent extends GroupStringPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_NAMED_CHANGED;
}

/**
 * 入群公告更改事件
 */
export interface GroupAnnouncementChangedEvent extends GroupStringPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_ANNOUNCEMENT_CHANGED;
}

/**
 * 群全体禁言更改事件
 */
export interface GroupChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_MUTE_CHANGED;
}

/**
 * 群匿名聊天更改事件
 */
export interface GroupAnonymousChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_ANONYMOUS_CHAT_POLICY_CHANGED;
}

/**
 * 群坦白说更改事件
 */
export interface GroupConfessTalkPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_CONFESS_TALK_POLICY_CHANGED;
}

/**
 * 群邀请政策更改事件
 */
export interface GroupInvitePolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_INVITE_POLICY_CHANGED;
}

/**
 * 群成员相关事件基类
 */
export interface GroupMemberBaseEvent extends Event {
	type: GroupMemberEventType;
	/** 受影响的成员 */
	member: {
		/** QQ 号 */
		id: number;
		/** 成员名 */
		memberName: string;
		/** 群权限 */
		permission: GroupPermission;
		/** 所属群 */
		group: Group;
	}
}

/**
 * 群成员加入事件
 */
export interface GroupMemberJoinedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_JOINED;
}

/**
 * 群成员踢出事件
 */
export interface GroupMemberKickedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_KICKED;
	operator: Operator;
}

/**
 * 群成员退出事件
 */
export interface GroupMemberPartedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_PARTED;
}

/**
 * 群成员更改群名片事件
 */
export interface GroupMemberNameChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_RENAMED;
	origin: string;
	current: string;
	operator: Operator;
}

/**
 * 群成员更改群头衔事件
 */
export interface GroupMemberTitleChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_TITLE_CHANGED;
	origin: string;
	current: string;
}

/**
 * 群成员权限更改事件
 */
export interface GroupMemberPermissionChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
}

/**
 * 群成员被禁言事件
 */
export interface GroupMemberMutedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_MUTED;
	durationSeconds: number;
	operator: Operator;
}

/**
 * 群成员禁言解除事件
 */
export interface GroupMemberUnmutedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_UNMUTED;
	operator: Operator;
}
