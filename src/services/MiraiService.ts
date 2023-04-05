import {PluginInfo} from '../types/system/PluginInfo';
import {MessageId} from '../objects/Message';
import {OutboundMessageChain} from '../objects/OutboundMessageChain';
import {GroupId} from '../objects/Group';
import {UserId} from '../objects/Friend';
import {ResponseBase} from '../objects/Request';
import {MiraiClient} from '../../index';

export abstract class MiraiService {
	protected constructor(protected client: MiraiClient, protected authKey: string, protected botId: number) {
	}

	get account(): number {
		return Number(this.botId);
	}

	/**
	 * 获取 mirai-api-http 插件的信息
	 * @returns 插件的信息
	 */
	abstract fetchPluginInfo(): Promise<PluginInfo>;

	/**
	 * 获取当前登录的账号列表
	 * @returns 当前登录的账号列表
	 */
	abstract fetchBotIds(): Promise<number[]>;

	/**
	 * 启动一个新的 MiraiService 实例。
	 * <br>
	 * 这个函数应该完成认证和会话启动过程，如果中间出现了错误，则应抛出错误。
	 * @throws {NetworkError} 因故无法与远端通信
	 * @throws {InvalidDataError} 提供的数据无效，如 botId 无效或 sessionKey 无效
	 */
	abstract setup(): Promise<void>;

	/**
	 * 停止一个 MiraiService 实例。
	 * <br>
	 * 这个函数应该完成会话停止过程和其他相应的清理。这个函数遇到错误时应仅输出日志。
	 */
	abstract teardown(): Promise<void>;

	/**
	 * 向群发送信息
	 * @param groupId 群 ID
	 * @param msg 待发送的消息
	 * @returns 消息 ID, 可用于撤回消息
	 */
	abstract sendToGroup(groupId: GroupId, msg: OutboundMessageChain): Promise<MessageId>;

	/**
	 * 向好友发送信息
	 * @param id 好友 ID
	 * @param msg 待发送的消息
	 * @returns 消息 ID, 可用于撤回消息
	 */
	abstract sendToFriend(id: UserId, msg: OutboundMessageChain): Promise<MessageId>;

	/**
	 * 向临时会话发送消息
	 * @param groupId 群 ID
	 * @param id 群友 ID
	 * @param msg 消息
	 * @returns 消息 ID, 可用于撤回消息
	 */
	abstract sendToTemp(groupId: GroupId, id: UserId, msg: OutboundMessageChain): Promise<MessageId>;

	/**
	 * 撤回消息
	 * @param conversationId 群 ID 或好友 ID
	 * @param messageId 消息 ID
	 */
	abstract revokeMessage(conversationId: GroupId | UserId, messageId: MessageId): Promise<void>;

	/**
	 * 回复好友请求
	 * @param response 请求回复结构
	 */
	abstract respondToFriendRequest(response: ResponseBase): Promise<void>;

	/**
	 * 回复加群请求
	 * @param response 请求回复结构
	 */
	abstract respondToGroupJoinRequest(response: ResponseBase): Promise<void>;

	/**
	 * 回复群邀请
	 * @param response 请求回复结构
	 */
	abstract respondToGroupInviteRequest(response: ResponseBase): Promise<void>;

	protected processEvents(events: Event[]): void {
		events.forEach(this.processEvent);
	}

	protected processEvent(event: Event): void {
		// TODO
	}
}
