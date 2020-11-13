export interface Config {
	connection: ConnectionConfig;
	account: AccountConfig;
}

export interface ConnectionConfig {
	tls: boolean;
	host: string;
	httpPort: number;
	websocketPort: number;
	pollPeriod: number;
	pollCount: number;
	useWebsocket: boolean;
}

export interface AccountConfig {
	authKey: string;
	account: number;
}
