import { ConnectionConfig } from '../objects/Config';
import Axios, { AxiosInstance } from 'axios';

export type BasicValueType = string | number;
export type ValueType = BasicValueType | { [key: string]: ValueType } | { [key: string]: BasicValueType[] };

export class HttpService {
	constructor(private readonly config: ConnectionConfig) {
		this.axios = Axios.create({
			baseURL: this.assembleBaseUrl(),
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	public get<T>(path: string, params?: Record<string, ValueType>) {
		return this.axios.get<T>(`${path}${params != null ? '?' + HttpService.assembleGetRequest(params) : ''}`);
	}

	public post<T>(path: string, params?: Record<string, any>) {
		return this.axios.post<T>(path, params);
	}

	private assembleBaseUrl(): string {
		return `${this.config.tls ? 'https' : 'http'}://${this.config.host}:${this.config.httpPort}/`;
	}

	private static assembleGetRequest(v: Record<string, ValueType>): string {
		return Object.keys(v).map(key => {
			const value = v[key];
			switch (typeof value) {
				case 'string':
				case 'number':
					return `${key}=${value}`;
				case 'object':
					if (value instanceof Array) {
						return value.map(item => `${key}[]=${item}`).join('&');
					} else {
						console.warn(`You cannot pass ${key} of type object`);
						return '';
					}
				default:
					console.warn(`You cannot pass ${key} of type ${typeof value}`);
					return '';
			}
		}).filter(it => it.length > 1).join('&');
	}

	private readonly axios: AxiosInstance;
}
