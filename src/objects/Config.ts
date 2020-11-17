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
	/** 是否使用 TLS */
	tls: boolean;
	/** 主机名 */
	host: string;
	/** HTTP 端口 */
	httpPort: number;
	/** WebSocket 端口 */
	websocketPort: number;
	/** 轮询周期，毫秒为单位。使用 WebSocket 时则无意义 */
	pollPeriod: number;
	/** 轮询消息数。使用 WebSocket 时则无意义 */
	pollCount: number;
	/** 是否使用 WebSocket */
	useWebsocket: boolean;
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
