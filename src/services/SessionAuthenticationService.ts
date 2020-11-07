import { HttpService } from './HttpService';
import { AccountConfig } from '../objects/Config';
import { BasicResponse, SessionInitiateResponse } from '../objects/ServerResponse';
import { StatusCode } from '../objects/StatusCode';

export class SessionAuthenticationService {
	constructor(config: AccountConfig, http: HttpService) {
		this.config = config;
		this.http = http;
		this.tokenPromise = this.setup();
	}

	public obtainToken(): Promise<string> {
		return this.tokenPromise;
	}

	private setup() {
		return this.http.post<SessionInitiateResponse>('/auth', {
			authKey: this.config.authKey,
		}).then(reply => {
			if (reply.data.code !== StatusCode.SUCCESS) {
				throw new Error('');
			} else {
				return reply.data.session;
			}
		}).then(key =>
			this.http.post<BasicResponse>('/verify', {
				sessionKey: key,
				qq: this.config.account,
			}).then(() => key),
		);
	}

	private readonly config: AccountConfig;
	private readonly http: HttpService;
	private readonly tokenPromise: Promise<string>;
}