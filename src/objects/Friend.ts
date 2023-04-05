export type UserId = number;

/**
 * 好友信息
 */
export interface Friend {
	/** QQ 号 */
	id: UserId;
	/** 昵称 */
	nickname: string;
	/** 备注 */
	remark: string;
}
