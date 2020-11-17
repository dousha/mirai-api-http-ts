import { SessionAuthenticationService } from './SessionAuthenticationService';
import { HttpService } from './HttpService';
import { OutboundMessageChain } from '../objects/OutboundMessageChain';
import { BasicResponse } from '../objects/ServerResponse';
import { AxiosResponse } from 'axios';

export class OutboundMessagingService {
	constructor(private readonly auth: SessionAuthenticationService, private readonly http: HttpService) {
		this.auth = auth;
		this.http = http;
	}

	/**
	 * 发送好友消息。
	 *
	 * @param {number} num 好友 QQ 号
	 * @param {OutboundMessageChain} msg 消息链
	 * @returns {Promise<AxiosResponse<BasicResponse>>}
	 * @see OutboundMessageChain
	 * @since 0.0.1
	 */
	public sendToFriend(num: number, msg: OutboundMessageChain): Promise<AxiosResponse<BasicResponse>> {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendFriendMessage', {
				sessionKey: token,
				target: num,
				messageChain: msg.chain,
			}));
	}

	/**
	 * 发送群消息。
	 *
	 * @param {number} num 群号
	 * @param {OutboundMessageChain} msg 消息链
	 * @returns {Promise<AxiosResponse<BasicResponse>>}
	 * @see OutboundMessageChain
	 * @since 0.0.1
	 */
	public sendToGroup(num: number, msg: OutboundMessageChain): Promise<AxiosResponse<BasicResponse>> {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendGroupMessage', {
				sessionKey: token,
				target: num,
				messageChain: msg.chain,
			}));
	}

	/**
	 * 发送临时会话消息。
	 *
	 * @param {number} groupId 群号
	 * @param {number} recipientId 接收方 QQ 号
	 * @param {OutboundMessageChain} msg 消息链
	 * @returns {Promise<AxiosResponse<BasicResponse>>}
	 * @see OutboundMessageChain
	 * @since 0.0.1
	 */
	public sendToTemp(groupId: number, recipientId: number, msg: OutboundMessageChain): Promise<AxiosResponse<BasicResponse>> {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendTempMessage', {
				sessionKey: token,
				qq: recipientId,
				group: groupId,
				messageChain: msg.chain,
			}));
	}

	/**
	 * 撤回消息。
	 *
	 * @param {number} messageId 消息 ID
	 * @returns {Promise<AxiosResponse<BasicResponse>>}
	 * @since 0.0.1
	 */
	public revokeMessage(messageId: number): Promise<AxiosResponse<BasicResponse>> {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/recall', {
				sessionKey: token,
				target: messageId,
			}));
	}

	/**
	 * 获取当前机器人的 QQ 号。
	 *
	 * @returns {number}
	 * @since 0.1.3
	 */
	public get account(): number {
		return this.auth.account;
	}
}
