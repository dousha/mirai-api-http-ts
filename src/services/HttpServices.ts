import { Config } from '../objects/Config';
import Axios, { AxiosInstance } from 'axios';

export class HttpServices {
	constructor(config: Config) {
		this.config = config;
		this.axios = Axios.create({
			baseURL: this.assembleBaseUrl(),
			timeout: 5000,
		});
	}

	private assembleBaseUrl(): string {
		return `${this.config.connection.tls ? 'https' : 'http'}://${this.config.connection.host}:${this.config.connection.httpPort}/`;
	}

	private readonly config: Config;
	private readonly axios: AxiosInstance;
}
