import { HttpService } from '../services/HttpService';
import { SessionAuthenticationService } from '../services/SessionAuthenticationService';
import { BasicResponse } from './ServerResponse';

/**
 * 群管理工具类
 * <br>
 * 通过 {@link MiraiClient#getGroupManager} 获取。
 *
 * @since 0.1.4
 */
export class GroupManager {
	/**
	 * @constructor
	 * @hideconstructor
	 */
	constructor(public readonly groupId: number, private readonly http: HttpService, private readonly auth: SessionAuthenticationService) {
	}

	/**
	 * 禁言某人
	 *
	 * @param {number} id QQ 号
	 * @param {number} time 禁言时长，单位为秒，默认为 1 分钟
	 * @since 0.1.4
	 */
	public mute(id: number, time: number = 60) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/mute', {
				sessionKey: token,
				target: this.groupId,
				memberId: id,
				time: time,
			}));
	}

	/**
	 * 解除禁言
	 *
	 * @param {number} id QQ 号
	 * @since 0.1.4
	 */
	public unmute(id: number) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/unmute', {
				sessionKey: token,
				target: this.groupId,
				memberId: id,
			}));
	}

	/**
	 * 解除禁言
	 *
	 * @param {number} id QQ 号
	 * @since 0.1.4
	 */
	public pardon(id: number) {
		return this.unmute(id);
	}

	/**
	 * 从群中移除某人
	 *
	 * @param {number} id QQ 号
	 * @param {string} msg 踢出原因，默认为空
	 * @since 0.1.4
	 */
	public kick(id: number, msg: string = '') {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/unmute', {
				sessionKey: token,
				target: this.groupId,
				memberId: id,
				msg: msg,
			}));
	}

	/**
	 * 退出此群
	 *
	 * @since 0.1.4
	 */
	public quit() {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/quit', {
				sessionKey: token,
				target: this.groupId,
			}));
	}

	/**
	 * 开启全体禁言
	 *
	 * @since 0.1.4
	 */
	public muteAll() {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/muteAll', {
				sessionKey: token,
				target: this.groupId,
			}));
	}

	/**
	 * 关闭全体禁言
	 *
	 * @since 0.1.4
	 */
	public unmuteAll() {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/unmuteAll', {
				sessionKey: token,
				target: this.groupId,
			}));
	}
}
