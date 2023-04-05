/**
 * 客户端配置
 */
export interface Config {
	/** 连接配置 */
	connection: ConnectionConfig;
	/** 账号配置 */
	account: AccountConfig;
}

/**
 * 连接配置
 */
export interface ConnectionConfig {
	/** URI */
	uri: string;
	/** 连接超时时间，毫秒为单位 */
	timeout?: number;
	/** 轮询周期，毫秒为单位。使用 WebSocket 时则无意义 */
	pollPeriod?: number;
	/** 轮询消息数。使用 WebSocket 时则无意义 */
	pollCount?: number;
}

/**
 * 账号配置
 */
export interface AccountConfig {
	/** 插件的 authKey */
	authKey: string;
	/** 要绑定的机器人账号 */
	account: number;
}
