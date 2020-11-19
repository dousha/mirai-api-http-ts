import { SessionAuthenticationService } from './SessionAuthenticationService';
import { HttpService } from './HttpService';
import { ConnectionConfig } from '../objects/Config';
import { EventEmitter } from 'events';
import { MessagePollResponse } from '../objects/ServerResponse';
import { OutboundMessagingService } from './OutboundMessagingService';

export interface InboundMessagingService extends EventEmitter {
	on(type: 'message', cb: (msg: unknown) => void): this;

	on(type: 'error', cb: (err?: Error) => void): this;
}

export class InboundMessagingService extends EventEmitter {
	constructor(private config: ConnectionConfig, private auth: SessionAuthenticationService, private out: OutboundMessagingService, private http: HttpService) {
		super();
		this.timer = setInterval(() => {
			this.sweep(config.pollCount);
		}, config.pollPeriod);
	}

	public close() {
		clearInterval(this.timer);
	}

	private sweep(count: number) {
		this.auth.obtainToken().then(token => {
			this.http.get<MessagePollResponse>('/fetchMessage', {
				sessionKey: token,
				count: count,
			}).then(res => {
				if (res.data.code === 0) {
					res.data.data.forEach(it => {
						this.emit('message', it);
					});
				} else {
					console.error(`Received non-zero error code: ${res.data.code}`);
					this.emit('error', new Error(res.data.code));
				}
			});
		});
	}

	private readonly timer: NodeJS.Timeout;
}
