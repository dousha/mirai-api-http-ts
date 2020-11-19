import { Group } from './Group';
import { GroupPermission } from './GroupPermission';

/**
 * 事件类型
 */
export type EventType = BotEventType | MessageEventType | GroupPolicyEventType | GroupMemberEventType | RequestType;

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

export enum MessageEventType {
	GROUP_MESSAGE_RECALL = 'GroupRecallEvent',
	GROUP_MESSAGE_REVOKE = 'GroupRecallEvent',
	FRIEND_MESSAGE_RECALL = 'FriendRecallEvent',
	FRIEND_MESSAGE_REVOKE = 'FriendRecallEvent',
}

export enum GroupPolicyEventType {
	GROUP_NAMED_CHANGED = 'GroupNameChangeEvent',
	GROUP_ANNOUNCEMENT_CHANGED = 'GroupEntranceAnnouncementChangeEvent',
	GROUP_MUTE_CHANGED = 'GroupMuteAllEvent',
	GROUP_ANONYMOUS_CHAT_POLICY_CHANGED = 'GroupAllowAnonymousChatEvent',
	GROUP_CONFESS_TALK_POLICY_CHANGED = 'GroupAllowConfessTalkEvent',
	GROUP_INVITE_POLICY_CHANGED = 'GroupAllowMemberInviteEvent',
}

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
	type: BotEventType.BOT_CONNECTIVITY_CHANGED;
	qq: number;
	state: BotConnectivity;
}

export interface BotConnectivityBaseEvent extends Event {
	type: BotEventType;
	qq: number;
}

export interface BotOnlineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_ONLINE;
}

export interface BotOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE;
}

export interface BotForcedOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE_FORCED;
}

export interface BotDisconnectedOfflineEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_OFFLINE_DISCONNECTED;
}

export interface BotReloginEvent extends BotConnectivityBaseEvent {
	type: BotEventType.BOT_RELOGIN;
}

export interface BotPermissionChangedEvent extends Event {
	type: BotEventType.BOT_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
	group: Group;
}

export interface BotMutedEvent extends Event {
	type: BotEventType.BOT_MUTED;
	durationSeconds: number;
	operator: Operator;
}

export interface BotUnmutedEvent extends Event {
	type: BotEventType.BOT_UNMUTED;
	operator: Operator;
}

export interface BotGroupBaseEvent extends Event {
	type: BotEventType;
	group: Group;
}

export interface BotJoinedGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_JOINED;
}

export interface BotPartedGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_PARTED;
}

export interface BotKickedFromGroupEvent extends BotGroupBaseEvent {
	type: BotEventType.BOT_GROUP_KICKED;
}

export interface GroupMessageRevokedEvent extends Event {
	type: MessageEventType.GROUP_MESSAGE_REVOKE;
	authorId: number;
	messageId: number;
	time: number;
	group: Group;
	operator: Operator;
}

export interface FriendMessageRevokedEvent extends Event {
	type: MessageEventType.FRIEND_MESSAGE_REVOKE;
	authorId: number;
	messageId: number;
	time: number;
	operator: number; // WTF
}

export interface GroupPolicyChangedEvent extends Event {
	type: GroupPolicyEventType;
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
	type: GroupPolicyEventType.GROUP_NAMED_CHANGED;
}

export interface GroupAnnouncementChangedEvent extends GroupStringPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_ANNOUNCEMENT_CHANGED;
}

export interface GroupChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_MUTE_CHANGED;
}

export interface GroupAnonymousChatPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_ANONYMOUS_CHAT_POLICY_CHANGED;
}

export interface GroupConfessTalkPolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_CONFESS_TALK_POLICY_CHANGED;
}

export interface GroupInvitePolicyChangedEvent extends GroupBinaryPolicyChangedEvent {
	type: GroupPolicyEventType.GROUP_INVITE_POLICY_CHANGED;
}

export interface GroupMemberBaseEvent extends Event {
	type: GroupMemberEventType;
	member: {
		id: number;
		memberName: string;
		permission: GroupPermission;
		group: Group;
	}
}

export interface GroupMemberJoinedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_JOINED;
}

export interface GroupMemberKickedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_KICKED;
	operator: Operator;
}

export interface GroupMemberPartedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_PARTED;
}

export interface GroupMemberNameChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_RENAMED;
	origin: string;
	current: string;
	operator: Operator;
}

export interface GroupMemberTitleChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_TITLE_CHANGED;
	origin: string;
	current: string;
}

export interface GroupMemberPermissionChangedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_PERMISSION_CHANGED;
	origin: GroupPermission;
	current: GroupPermission;
}

export interface GroupMemberMutedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_MUTED;
	durationSeconds: number;
	operator: Operator;
}

export interface GroupMemberUnmutedEvent extends GroupMemberBaseEvent {
	type: GroupMemberEventType.GROUP_MEMBER_UNMUTED;
	operator: Operator;
}
