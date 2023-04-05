export interface MiraiHttpConfig {
	baseUrl: string;
	timeout?: number;
	pollInterval?: number;
	pollCount?: number;
	authKey: string;
	botId: number;
}
