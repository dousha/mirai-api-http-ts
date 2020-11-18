/**
 * 操作状态码
 *
 * @enum {number}
 */
export enum StatusCode {
	/** 成功 */
	SUCCESS = 0,
	/** 验证失败 */
	AUTHENTICATION_FAILURE = 1,
	/** 找不到机器人 */
	BOT_NOT_FOUND = 2,
	/** 会话无效 */
	INVALID_SESSION = 3,
	/** 会话未绑定到机器人 */
	INACTIVE_SESSION = 4,
	/** 操作目标不存在 */
	TARGET_NOT_FOUND = 5,
	/** 文件未找到 */
	FILE_NOT_FOUND = 6,
	/** 没有权限 */
	PERMISSION_DENIED = 10,
	/** 机器人被禁言 */
	MUTED = 20,
	/** 消息过长 */
	MESSAGE_BODY_TOO_LONG = 30,
	/** 请求不合法 */
	BAD_REQUEST = 400,
}
