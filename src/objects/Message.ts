/**
 * 基本消息类型。
 *
 * @remarks 这个枚举可能不包含所有的事件类型。
 */
export enum MessageType {
	/// 群消息
	GROUP_MESSAGE = 'GroupMessage',
	/// 好友消息
	FRIEND_MESSAGE = 'FriendMessage',
	/// 临时会话
	TEMP_MESSAGE = 'TempMessage',
}

export interface MessageSender {
	/// 群号或者 QQ 号，取决于实际类型
	id: number;
}

export enum GroupPermission {
	/// 群员
	MEMBER = 'MEMBER',
	/// 管理员
	ADMINISTRATOR = 'ADMINISTRATOR',
	/// 管理员
	ADMIN = 'ADMINISTRATOR',
	/// 群主
	OWNER = 'OWNER'
}

export interface Group {
	/// 群号
	id: number;
	/// 群名
	name: string;
	/// 机器人的权限
	permission: GroupPermission;
}

export interface GroupMessageSender extends MessageSender {
	/// 成员名
	memberName: string;
	/// 成员权限
	permission: GroupPermission;
	/// 源消息群
	group: Group;
}

export interface PrivateMessageSender extends MessageSender {
	/// 昵称
	nickname: string;
	/// 备注
	remark: string;
}

export interface Message {
	type: MessageType;
	messageChain: Array<MessageContent>;
	sender: MessageSender;
}

export enum MessageContentType {
	/// 消息头
	SOURCE = 'Source',
	/// 消息头
	MESSAGE_HEADER = 'Source',
	/// 回复引用
	QUOTE = 'Quote',
	/// 回复引用
	REPLY = 'Quote',
	/// At
	AT = 'At',
	/// At
	MENTION = 'At',
	/// 所有人
	AT_ALL = 'AtAll',
	/// 所有人
	MENTION_ALL = 'AtAll',
	FACE = 'Face',
	EMOTICON = 'Face',
	EMOTION = 'Face',
	EMOTE = 'Face',
	PLAIN = 'Plain',
	TEXT = 'Plain',
	IMAGE = 'Image',
	PICTURE = 'Image',
	FLASH_IMAGE = 'FlashImage',
	TRANSIENT_IMAGE = 'FlashImage',
	SELF_DESTRUCT_IMAGE = 'FlashImage',
	VOICE = 'Voice',
	XML = 'Xml',
	JSON = 'Json',
	APP = 'App',
	POKE = 'Poke',
	INTERACT = 'Poke'
}

export interface MessageContent {
	type: MessageContentType;
}

export interface MessageHeader extends MessageContent {
	type: MessageContentType.SOURCE;
	/// 消息编号
	id: number;
	/// Unix 时间戳
	time: number;
}

export interface Quote extends MessageContent {
	type: MessageContentType.QUOTE;
	/// 源消息 ID
	id: number;
	/// 被引用回复的源消息所接收的群号，当为好友消息时为 0
	groupId: number;
	/// 被引用回复的源消息的发送者的 QQ 号
	senderId: number;
	/// 被引用回复的源消息的接收者者的QQ号（或群号）
	targetId: number;
	/// 源消息
	origin: Array<MessageContent>;
}

export interface Mention extends MessageContent {
	type: MessageContentType.MENTION;
	/// 源发送者 QQ 号
	target: number;
	/// @ 时显示的文字，发送消息时无效，自动使用群名片
	display: string;
}

export interface MentionAll extends MessageContent {
	type: MessageContentType.MENTION_ALL;
}

export interface Emoticon extends MessageContent {
	type: MessageContentType.EMOTICON;
	/// 表情编号
	faceId?: number;
	/// 表情名称
	name?: string;
}

export interface PlainText extends MessageContent {
	type: MessageContentType.TEXT;
	/// 内容
	text: string;
}

export interface Image extends MessageContent {
	type: MessageContentType.IMAGE;
	/// 图片 ID
	imageId: string;
	/// 图片 URL
	url: string;
}

export interface OutboundImage extends MessageContent {
	type: MessageContentType.IMAGE;
}

export interface IdBasedOutboundImage extends OutboundImage {
	imageId: string;
}

export interface UrlBasedOutboundImage extends OutboundImage {
	url: string;
}

export interface LocalImageBasedOutboundImage extends OutboundImage {
	path: string;
}

export interface Voice extends MessageContent {
	type: MessageContentType.VOICE;
	voiceId: string;
	url: string;
}

export interface OutboundVoice extends MessageContent {
	type: MessageContentType.VOICE;
}

export interface IdBasedOutboundVoice extends OutboundVoice {
	voiceId: string;
}

export interface UrlBasedOutboundVoice extends OutboundVoice {
	url: string;
}

export interface LocalFileBasedOutboundVoice extends OutboundVoice {
	path: string;
}

export interface XmlMessage extends MessageContent {
	type: MessageContentType.XML;
	/// XML 内容
	xml: string;
}

export interface JsonMessage extends MessageContent {
	type: MessageContentType.JSON;
	/// JSON 内容
	json: string;
}

export interface AppMessage extends MessageContent {
	type: MessageContentType.APP;
	/// APP 分享内容
	content: string;
}

export enum InteractMessageType {
	/// 戳一戳
	POKE = 'Poke',
	/// 比心
	SHOW_LOVE = 'ShowLove',
	/// 比心
	SHOW_HEART = 'ShowLove',
	/// 点赞
	LIKE = 'Like',
	/// 心碎
	HEART_BROKEN = 'HeartBroken',
	/// 666
	SIX_SIX_SIX = 'SixSixSix',
	/// 放大招
	FANG_DA_ZHAO = 'FangDaZhao',
	/// 放大招
	ULT = 'FangDaZhao'
}

export interface InteractMessage extends MessageContent {
	type: MessageContentType.INTERACT;
	/// 动作类型
	name: InteractMessageType;
}
