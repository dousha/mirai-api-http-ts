import { Config } from './src/objects/Config';
import { EventEmitter } from 'events';
import { InboundMessage } from './src/objects/InboundMessage';
import { HttpService } from './src/services/HttpService';
import { SessionAuthenticationService } from './src/services/SessionAuthenticationService';
import { WebSocketService } from './src/services/WebSocketService';
import { InboundMessagingService } from './src/services/InboundMessagingService';
import { OutboundMessagingService } from './src/services/OutboundMessagingService';

export interface MiraiClient extends EventEmitter {
	on(type: 'connect', cb: () => void): this;
	on(type: 'message', cb: (msg: InboundMessage) => void): this;
	on(type: 'error', cb: (err?: Error) => void): this;
}

export class MiraiClient extends EventEmitter {
	constructor(config: Config) {
		super();
		this.http = new HttpService(config.connection);
		this.auth = new SessionAuthenticationService(config.account, this.http);
		this.out = new OutboundMessagingService(this.auth, this.http);
		this.auth.obtainToken().then(() => {
			this.emit('connect');
		});
		if (config.connection.useWebsocket) {
			this.ws = new WebSocketService(config.connection, this.auth, this.out);
			this.ws.on('message', m => this.emit('message', m))
				.on('error', e => this.emit('error', e));
		} else {
			this.inbound = new InboundMessagingService(config.connection, this.auth, this.out, this.http);
			this.inbound.on('message', m => this.emit('message', m))
				.on('error', e => this.emit('error', e));
		}
	}

	public close() {
		this.ws?.close();
		this.inbound?.close();
	}

	private readonly http: HttpService;
	private readonly auth: SessionAuthenticationService;
	private readonly out: OutboundMessagingService;
	private ws?: WebSocketService;
	private inbound?: InboundMessagingService;
}
