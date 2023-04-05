import Axios, {AxiosInstance, AxiosResponse} from 'axios';
import {MiraiHttpConfig} from './MiraiHttpConfig';
import {
	AccessDeniedError,
	InvalidDataError,
	InvalidSessionError,
	NetworkError,
	RemoteFileNotFoundError
} from '../MiraiException';
import {MiraiResponse} from '../MiraiResponse';
import {MiraiError} from '../MiraiError';

export type BasicValueType = string | number;
export type ValueType = BasicValueType | { [key: string]: ValueType } | { [key: string]: BasicValueType[] };

export class MiraiHttpClient {
	private readonly axios: AxiosInstance;

	constructor(private readonly config: MiraiHttpConfig) {
		this.axios = Axios.create({
			baseURL: config.baseUrl,
			timeout: config.timeout || 5000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
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

	public async get<T>(path: string, params?: Record<string, ValueType>): Promise<T> {
		const requestString = params == null ? '' : `?${MiraiHttpClient.assembleGetRequest(params)}`;
		const response = await this.axios.get<MiraiResponse<T>>(`${path}${requestString}`);
		return this.handleResponse(response);
	}

	public async post<T>(path: string, params?: Record<string, unknown>): Promise<T> {
		const response = await this.axios.post<MiraiResponse<T>>(path, params);
		return this.handleResponse(response);
	}

	public async postRaw<T>(path: string, params?: Record<string, unknown>): Promise<T> {
		const response = await this.axios.post<T>(path, params);
		if (response.status > 399) {
			throw new NetworkError(path, `Bad status code ${response.status}: ${response.statusText}`);
		}

		return response.data;
	}

	public setSessionKey(key: string) {
		this.axios.defaults.headers['Authorization'] = `sessionKey ${key}`;
	}

	private handleResponse<T>(response: AxiosResponse<MiraiResponse<T>>): T {
		if (response.status > 399) {
			throw new NetworkError(response.request.uri, `Bad status code ${response.status}: ${response.statusText}`);
		}

		const data = response.data;
		if (data.code != MiraiError.ERR_OK) {
			switch (data.code) {
				case MiraiError.ERR_BAD_VERIFY_KEY:
					throw new InvalidDataError('AuthKey was rejected');
				case MiraiError.ERR_BOT_NOT_FOUND:
					throw new InvalidDataError('Bot not found');
				case MiraiError.ERR_INVALID_SESSION:
				case MiraiError.ERR_DEACTIVATED_SESSION:
					throw new InvalidSessionError();
				case MiraiError.ERR_INVALID_TARGET:
					throw new InvalidDataError('Given target not found');
				case MiraiError.ERR_FILE_NOT_FOUND:
					throw new RemoteFileNotFoundError('(not supplied)');
				case MiraiError.ERR_PERMISSION_DENIED:
					throw new AccessDeniedError();
				case MiraiError.ERR_MUTED:
					throw new AccessDeniedError('Bot is muted');
				case MiraiError.ERR_MESSAGE_TOO_LONG:
					throw new InvalidDataError('Message is too long');
				case MiraiError.ERR_BAD_PARAMETER:
					throw new InvalidDataError('Mirai does not understand this request');
			}
		}

		return data.data;
	}
}
