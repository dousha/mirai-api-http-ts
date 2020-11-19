import { Group } from './Group';
import { GroupPermission } from './GroupPermission';

/**
 * 事件类型
 *
 * @enum {string}
 */
export enum EventType {
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

	GROUP_MESSAGE_RECALL = 'GroupRecallEvent',
	GROUP_MESSAGE_REVOKE = 'GroupRecallEvent',
	FRIEND_MESSAGE_RECALL = 'FriendRecallEvent',
	FRIEND_MESSAGE_REVOKE = 'FriendRecallEvent',

	GROUP_NAMED_CHANGED = 'GroupNameChangeEvent',
	GROUP_ANNOUNCEMENT_CHANGED = 'GroupEntranceAnnouncementChangeEvent',
	GROUP_MUTE_CHANGED = 'GroupMuteAllEvent',
	GROUP_ANONYMOUS_CHAT_POLICY_CHANGED = 'GroupAllowAnonymousChatEvent',
	GROUP_CONFESS_TALK_POLICY_CHANGED = 'GroupAllowConfessTalkEvent',
	GROUP_INVITE_POLICY_CHANGED = 'GroupAllowMemberInviteEvent',

	GROUP_MEMBER_JOINED = 'MemberJoinEvent',
	GROUP_MEMBER_KICKED = 'MemberLeaveEventKick',
	GROUP_MEMBER_PARTED = 'MemberLeaveEventQuit',
	GROUP_MEMBER_RENAMED = 'MemberCardChangeEvent',
	GROUP_MEMBER_TITLE_CHANGED = 'MemberSpecialTitleChangeEvent',
	GROUP_MEMBER_PERMISSION_CHANGED = 'MemberPermissionChangeEvent',
	GROUP_MEMBER_MUTED = 'MemberMuteEvent',
	GROUP_MEMBER_UNMUTED = 'MemberUnmuteEvent',

	FRIEND_REQUEST = 'NewFriendRequestEvent',
	GROUP_JOIN_REQUEST = 'MemberJoinRequestEvent',
	GROUP_INVITE_REQUEST = 'BotInvitedJoinGroupRequestEvent',

	BOT_CONNECTIVITY_CHANGED = 'BotConnectivityChangedEvent'
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
	id: number;
	memberName: string;
	permission: GroupPermission;
	group: Group;
}

/**
 * 事件基类
 */
export interface Event {
	type: EventType;
}

export interface BotConnectivityChangeEvent extends Event {
	type: EventType.BOT_CONNECTIVITY_CHANGED;
	qq: number;
	state: BotConnectivity;
}

export interface BotConnectivityBaseEvent extends Event {
	qq: number;
}

export interface BotOnlineEvent extends BotConnectivityBaseEvent {
	type: EventType.BOT_ONLINE;
}

export interface BotOfflineEvent extends BotConnectivityBaseEvent {
	type: EventType.BOT_OFFLINE;
}

export interface BotForcedOfflineEvent extends BotConnectivityBaseEvent {
	type: EventType.BOT_OFFLINE_FORCED;
}

export interface BotDisconnectedOfflineEvent extends BotConnectivityBaseEvent {
	type: EventType.BOT_OFFLINE_DISCONNECTED;
}

export interface BotReloginEvent extends BotConnectivityBaseEvent {
	type: EventType.BOT_RELOGIN;
}

export interface BotPermissionChangedEvent extends Event {
	type: EventType.BOT_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
	group: Group;
}

export interface BotMutedEvent extends Event {
	type: EventType.BOT_MUTED;
	durationSeconds: number;
	operator: Operator;
}

export interface BotUnmutedEvent extends Event {
	type: EventType.BOT_UNMUTED;
	operator: Operator;
}

export interface BotGroupBaseEvent extends Event {
	type: EventType;
	group: Group;
}

export interface BotJoinedGroupEvent extends BotGroupBaseEvent {
	type: EventType.BOT_GROUP_JOINED;
}

export interface BotPartedGroupEvent extends BotGroupBaseEvent {
	type: EventType.BOT_GROUP_PARTED;
}

export interface BotKickedFromGroupEvent extends BotGroupBaseEvent {
	type: EventType.BOT_GROUP_KICKED;
}

export interface GroupMessageRevokedEvent extends Event {
	type: EventType.GROUP_MESSAGE_REVOKE;
	authorId: number;
	messageId: number;
	time: number;
	group: Group;
	operator: Operator;
}

export interface FriendMessageRevokedEvent extends Event {
	type: EventType.FRIEND_MESSAGE_REVOKE;
	authorId: number;
	messageId: number;
	time: number;
	operator: number; // WTF
}

export interface GroupPolicyChangedEvent extends Event {
	type: EventType;
	origin: any;
	current: any;
	group: Group;
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

export interface GroupNameChangedEvent extends GroupStringPolicyChangedEvent {
	type: EventType.GROUP_NAMED_CHANGED;
}

export interface GroupAnnouncementChangedEvent extends GroupStringPolicyChangedEvent {
	type: EventType.GROUP_ANNOUNCEMENT_CHANGED;
}

export interface GroupChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: EventType.GROUP_MUTE_CHANGED;
}

export interface GroupAnonymousChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: EventType.GROUP_ANONYMOUS_CHAT_POLICY_CHANGED;
}

export interface GroupConfessTalkPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: EventType.GROUP_CONFESS_TALK_POLICY_CHANGED;
}

export interface GroupInvitePolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: EventType.GROUP_INVITE_POLICY_CHANGED;
}

export interface GroupMemberBaseEvent extends Event {
	type: EventType;
	member: {
		id: number;
		memberName: string;
		permission: GroupPermission;
		group: Group;
	}
}

export interface GroupMemberJoinedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_JOINED;
}

export interface GroupMemberKickedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_KICKED;
	operator: Operator;
}

export interface GroupMemberPartedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_PARTED;
}

export interface GroupMemberNameChangedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_RENAMED;
	origin: string;
	current: string;
	operator: Operator;
}

export interface GroupMemberTitleChangedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_TITLE_CHANGED;
	origin: string;
	current: string;
}

export interface GroupMemberPermissionChangedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
}

export interface GroupMemberMutedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_MUTED;
	durationSeconds: number;
	operator: Operator;
}

export interface GroupMemberUnmutedEvent extends GroupMemberBaseEvent {
	type: EventType.GROUP_MEMBER_UNMUTED;
	operator: Operator;
}
