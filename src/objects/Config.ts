export interface Config {
	connection: ConnectionConfig;
	account: AccountConfig;
}

export interface ConnectionConfig {
	tls: boolean;
	host: string;
	httpPort: number;
	websocketPort: number;
	sweepPeriod: number;
}

export interface AccountConfig {
	authKey: string;
	account: number;
}
