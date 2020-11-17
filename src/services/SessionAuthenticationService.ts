import { HttpService } from './HttpService';
import { AccountConfig } from '../objects/Config';
import { BasicResponse, SessionInitiateResponse } from '../objects/ServerResponse';
import { StatusCode } from '../objects/StatusCode';

export class SessionAuthenticationService {
	constructor(private readonly config: AccountConfig, private readonly http: HttpService) {
		this.tokenPromise = this.setup();
	}

	public obtainToken(): Promise<string> {
		return this.tokenPromise;
	}

	public close() {
		return this.obtainToken().then(token =>
			this.http.post('/release', {
				sessionKey: token,
				qq: this.config.account,
			}));
	}

	public get account(): number {
		return this.config.account;
	}

	private setup() {
		console.debug(`Logging in for ${this.config.account} with key ${this.config.authKey}`);
		return this.http.post<SessionInitiateResponse>('/auth', {
			authKey: this.config.authKey,
		}).then(reply => {
			if (reply.data.code !== StatusCode.SUCCESS) {
				throw new Error('Bad auth key!');
			} else {
				return reply.data.session;
			}
		}).then(key =>
			this.http.post<BasicResponse>('/verify', {
				sessionKey: key,
				qq: this.config.account,
			}).then(res => {
				if (res.data.code !== StatusCode.SUCCESS) {
					throw new Error('Cannot bind to account!');
				} else {
					return key;
				}
			}),
		);
	}

	private readonly tokenPromise: Promise<string>;
}
