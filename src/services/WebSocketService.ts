import { ConnectionConfig } from '../objects/Config';
import { SessionAuthenticationService } from './SessionAuthenticationService';
import { isMessage } from '../utils/TypeUtils';
import { EventEmitter } from 'events';
import { OutboundMessagingService } from './OutboundMessagingService';
import { InboundMessage } from '../objects/InboundMessage';
import WebSocket = require('ws');

export interface WebSocketService extends EventEmitter {
	on(t: 'message', cb: (m: InboundMessage) => void): this;

	on(t: 'error', cb: (m: InboundMessage) => void): this;
}

export class WebSocketService extends EventEmitter {
	constructor(private readonly config: ConnectionConfig, private readonly session: SessionAuthenticationService, private readonly msg: OutboundMessagingService) {
		super();
		this.setup();
	}

	public close() {
		this.ws?.close();
	}

	private setup() {
		this.session.obtainToken().then(token => {
			this.ws = new WebSocket(`${this.assembleUrl()}/all?sessionKey=${token}`);
			this.ws.on('open', () => console.log('WebSocket ready'))
				.on('message', msg => {
					if (typeof msg !== 'string') {
						console.error(`Received type of ${typeof msg} instead of string`);
						return;
					}
					const obj = JSON.parse(msg);
					if (isMessage(obj)) {
						this.emit('message', new InboundMessage(obj, this.msg));
					} else {
						console.warn(`Received WebSocket message that is not a valid message: ${msg}`);
					}
				})
				.on('error', e => {
					console.error(e);
					this.emit('error', e);
				});
		});
	}

	private assembleUrl() {
		return `${this.config.tls ? 'wss' : 'ws'}://${this.config.host}:${this.config.websocketPort}`;
	}

	private ws?: WebSocket;
}
