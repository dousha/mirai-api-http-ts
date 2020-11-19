/**
 * 基本消息类型
 *
 * @readonly
 * @enum {string}
 */
import { Group } from './Group';
import { GroupPermission } from './GroupPermission';

/**
 * 消息类型
 *
 * @enum
 */
export enum MessageType {
	/** 群消息 */
	GROUP_MESSAGE = 'GroupMessage',
	/** 好友消息 */
	FRIEND_MESSAGE = 'FriendMessage',
	/** 临时会话 */
	TEMP_MESSAGE = 'TempMessage',
}

/**
 * 消息发送者
 *
 * 消息发送者取决于{@link MessageType 消息类型}会被细化为更多子类型。
 *
 * @see GroupMessageSender
 * @see PrivateMessageSender
 */
export interface MessageSender {
	/** 发送者的 QQ 号 */
	id: number;
}

/**
 * 群消息发送者和临时消息发送者
 *
 * @see MessageSender
 */
export interface GroupMessageSender extends MessageSender {
	/** 成员名 */
	memberName: string;
	/** 成员权限 */
	permission: GroupPermission;
	/** 源消息群 */
	group: Group;
}

/**
 * 好友消息发送者
 *
 * @see MessageSender
 */
export interface PrivateMessageSender extends MessageSender {
	/** 昵称 */
	nickname: string;
	/** 备注 */
	remark: string;
}

/**
 * 消息
 */
export interface Message {
	/** 类型 */
	type: MessageType;
	/** 消息链 */
	messageChain: Array<MessageContent>;
	/** 消息发送者 */
	sender: MessageSender;
}

/**
 * 消息内容类型
 *
 * @enum {string}
 * @readonly
 * @remarks 注意到有些枚举项目是同义词。这是为了给出最大的兼容性（和个人的一点点偏好）。
 */
export enum MessageContentType {
	/** 消息头 */
	SOURCE = 'Source',
	/** 消息头 */
	MESSAGE_HEADER = 'Source',
	/** 回复引用 */
	QUOTE = 'Quote',
	/** 回复引用 */
	REPLY = 'Quote',
	/** At */
	AT = 'At',
	/** At */
	MENTION = 'At',
	/** 所有人 */
	AT_ALL = 'AtAll',
	/** 所有人 */
	MENTION_ALL = 'AtAll',
	/** 表情 */
	FACE = 'Face',
	/** 表情 */
	EMOTICON = 'Face',
	/** 表情 */
	EMOTION = 'Face',
	/** 表情 */
	EMOTE = 'Face',
	/** 纯文字 */
	PLAIN = 'Plain',
	/** 纯文字 */
	TEXT = 'Plain',
	/** 图片 */
	IMAGE = 'Image',
	/** 图片 */
	PICTURE = 'Image',
	/** 闪照 */
	FLASH_IMAGE = 'FlashImage',
	/** 闪照 */
	TRANSIENT_IMAGE = 'FlashImage',
	/** 闪照 */
	SELF_DESTRUCT_IMAGE = 'FlashImage',
	/** 语音 */
	VOICE = 'Voice',
	/** XML 消息 */
	XML = 'Xml',
	/** JSON 消息 */
	JSON = 'Json',
	/** 应用程序分享消息 */
	APP = 'App',
	/** 戳一戳 */
	POKE = 'Poke',
	/** 戳一戳 */
	INTERACT = 'Poke'
}

/**
 * 消息内容块
 *
 * 消息内容块会被细化为诸如消息头、文字、图片等等更多子类型。
 * 此处不再一一列举。
 */
export interface MessageContent {
	type: MessageContentType;
}

/**
 * 消息头
 *
 * @remarks 对应 `mirai-api-http` 中的 `Source` 类型。
 */
export interface MessageHeader extends MessageContent {
	type: MessageContentType.SOURCE;
	/** 消息编号 */
	id: number;
	/** Unix 时间戳 */
	time: number;
}

/**
 * 引用回复
 */
export interface Quote extends MessageContent {
	type: MessageContentType.QUOTE;
	/** 源消息 ID */
	id: number;
	/** 被引用回复的源消息所接收的群号，当为好友消息时为 0 */
	groupId: number;
	/** 被引用回复的源消息的发送者的 QQ 号 */
	senderId: number;
	/** 被引用回复的源消息的接收者者的 QQ 号（或群号） */
	targetId: number;
	/** 源消息 */
	origin: Array<MessageContent>;
}

/**
 * 提到某人
 */
export interface Mention extends MessageContent {
	type: MessageContentType.MENTION;
	/** 源发送者 QQ 号 */
	target: number;
	/** @ 时显示的文字，发送消息时无效，自动使用群名片 */
	display: string;
}

/**
 * 提到全体成员
 */
export interface MentionAll extends MessageContent {
	type: MessageContentType.MENTION_ALL;
}

/**
 * 表情
 */
export interface Emoticon extends MessageContent {
	type: MessageContentType.EMOTICON;
	/** 表情编号 */
	faceId?: number;
	/** 表情名称 */
	name?: string;
}

/**
 * 纯文字
 */
export interface PlainText extends MessageContent {
	type: MessageContentType.TEXT;
	/** 内容 */
	text: string;
}

/**
 * 图片
 */
export interface Image extends MessageContent {
	type: MessageContentType.IMAGE;
	/** 图片 ID */
	imageId: string;
	/** 图片 URL */
	url: string;
}

/**
 * 出站图片
 */
export interface OutboundImage extends MessageContent {
	type: MessageContentType.IMAGE;
}

/**
 * 基于图片 ID 的出站图片
 */
export interface IdBasedOutboundImage extends OutboundImage {
	imageId: string;
}

/**
 * 基于 URL 的出站图片
 */
export interface UrlBasedOutboundImage extends OutboundImage {
	url: string;
}

/**
 * 基于本地文件的出站图片
 */
export interface LocalImageBasedOutboundImage extends OutboundImage {
	path: string;
}

/**
 * 语音
 */
export interface Voice extends MessageContent {
	type: MessageContentType.VOICE;
	voiceId: string;
	url: string;
}

/**
 * 出站语音
 */
export interface OutboundVoice extends MessageContent {
	type: MessageContentType.VOICE;
}

/**
 * 基于 ID 的出站语音
 */
export interface IdBasedOutboundVoice extends OutboundVoice {
	voiceId: string;
}

/**
 * 基于 URL 的出站语音
 */
export interface UrlBasedOutboundVoice extends OutboundVoice {
	url: string;
}

/**
 * 基于本地文件的出站语音
 */
export interface LocalFileBasedOutboundVoice extends OutboundVoice {
	path: string;
}

/**
 * XML 消息
 */
export interface XmlMessage extends MessageContent {
	type: MessageContentType.XML;
	/** XML 内容 */
	xml: string;
}

/**
 * JSON 消息
 */
export interface JsonMessage extends MessageContent {
	type: MessageContentType.JSON;
	/** JSON 内容 */
	json: string;
}

/**
 * APP 分享消息
 */
export interface AppMessage extends MessageContent {
	type: MessageContentType.APP;
	/** APP 分享内容 */
	content: string;
}

/**
 * 戳一戳动作类型
 *
 * @enum {string}
 * @readonly
 */
export enum InteractMessageType {
	/** 戳一戳 */
	POKE = 'Poke',
	/** 比心 */
	SHOW_LOVE = 'ShowLove',
	/** 比心 */
	SHOW_HEART = 'ShowLove',
	/** 点赞 */
	LIKE = 'Like',
	/** 心碎 */
	HEART_BROKEN = 'HeartBroken',
	/** 666 */
	SIX_SIX_SIX = 'SixSixSix',
	/** 放大招 */
	FANG_DA_ZHAO = 'FangDaZhao',
	/** 放大招 */
	ULT = 'FangDaZhao'
}

/**
 * 戳一戳消息
 */
export interface InteractMessage extends MessageContent {
	type: MessageContentType.INTERACT;
	/** 动作类型 */
	name: InteractMessageType;
}
