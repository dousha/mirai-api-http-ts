import { ConnectionConfig } from '../objects/Config';
import { SessionAuthenticationService } from './SessionAuthenticationService';
import WebSocket = require('ws');
import { isMessage } from '../utils/TypeUtils';
import { EventEmitter } from 'events';
import { MessagingService } from './MessagingService';
import { Message, MessageHeader, MessageType } from '../objects/Message';
import { OutboundMessageChain } from '../objects/OutboundMessageChain';
import { TODO } from '../utils/TodoUtils';

export class InboundMessage {
	constructor(message: Message, srvc: MessagingService) {
		this.message = message;
		this.srvc = srvc;
	}

	public revoke() {
		if (this.message.type !== MessageType.GROUP_MESSAGE) {
			return Promise.reject('Cannot revoke a message of others');
		} else {
			return this.srvc.revokeMessage(this.id);
		}
	}

	public reply(chain: OutboundMessageChain) {
		TODO();
	}

	public toMiraiCode(): string {
		TODO();
		return '';
	}

	public get header(): MessageHeader {
		return this.message.messageChain[0] as MessageHeader;
	}

	public get id() {
		return this.header.id;
	}

	public readonly message: Message;
	private readonly srvc: MessagingService;
}

export interface WebSocketService {
	on(t: 'message', cb: (m: InboundMessage) => void): this;
}

export class WebSocketService extends EventEmitter {
	constructor(config: ConnectionConfig, session: SessionAuthenticationService, msg: MessagingService) {
		super();
		this.config = config;
		this.session = session;
		this.msg = msg;
		this.setup();
	}

	public close() {
		this.ws?.close();
	}

	private setup() {
		this.session.obtainToken().then(token => {
			this.ws = new WebSocket(`${this.assembleUrl()}/all?sessionKey=${token}`);
			this.ws.on('open', () => console.log('WebSocket ready'));
			this.ws.on('message', msg => {
				if (typeof msg !== 'string') {
					console.error(`Received type of ${typeof msg} instead of string`);
					return;
				}
				const obj = JSON.parse(msg);
				if (isMessage(obj)) {
					this.emit('message', new InboundMessage(obj, this.msg));
				} else {
					console.warn(`Received WebSocket message that is not a valid message: ${msg}`)
				}
			});
		});
	}

	private assembleUrl() {
		return `${this.config.tls ? 'wss' : 'ws'}://${this.config.host}:${this.config.websocketPort}`;
	}

	private readonly config: ConnectionConfig;
	private readonly session: SessionAuthenticationService;
	private readonly msg: MessagingService;
	private ws?: WebSocket;
}