import {MiraiService} from './MiraiService';
import {PluginInfo} from '../types/system/PluginInfo';
import {MiraiHttpConfig} from '../types/http/MiraiHttpConfig';
import {MiraiHttpRoute} from '../types/http/MiraiHttpRoute';
import {MiraiHttpAuthenticationResponse} from '../types/http/MiraiHttpAuthenticationResponse';
import {MiraiHttpClient} from '../types/http/MiraiHttpClient';
import {ResponseBase} from '../objects/Request';
import {OutboundMessageChain} from '../objects/OutboundMessageChain';
import {MiraiClient} from '../../index';

export class HttpBasedMiraiService extends MiraiService {
	private gopher: MiraiHttpClient;
	private pollerId = -1;
	private isPolling = false;
	private currentFetchProcess = Promise.resolve();

	constructor(client: MiraiClient, private readonly config: MiraiHttpConfig) {
		super(client, config.authKey, config.botId);
		this.gopher = new MiraiHttpClient(config);
	}

	fetchBotIds(): Promise<number[]> {
		throw new Error('Method not implemented.');
	}

	sendToGroup(groupId: number, msg: OutboundMessageChain): Promise<number> {
		throw new Error('Method not implemented.');
	}

	sendToFriend(id: number, msg: OutboundMessageChain): Promise<number> {
		throw new Error('Method not implemented.');
	}

	sendToTemp(groupId: number, id: number, msg: OutboundMessageChain): Promise<number> {
		throw new Error('Method not implemented.');
	}

	revokeMessage(conversationId: number, messageId: number): Promise<void> {
		throw new Error('Method not implemented.');
	}

	respondToFriendRequest(response: ResponseBase): Promise<void> {
		throw new Error('Method not implemented.');
	}

	respondToGroupJoinRequest(response: ResponseBase): Promise<void> {
		throw new Error('Method not implemented.');
	}

	respondToGroupInviteRequest(response: ResponseBase): Promise<void> {
		throw new Error('Method not implemented.');
	}

	fetchPluginInfo(): Promise<PluginInfo> {
		return this.gopher.get<PluginInfo>(MiraiHttpRoute.ABOUT);
	}

	async setup(): Promise<void> {
		await this.authorize();
		await this.bind();
		this.startPolling();
	}

	async teardown(): Promise<void> {
		this.stopPolling();
		await this.release();
	}

	private async authorize() {
		console.debug('Starting authorization process');

		const response = await this.gopher.postRaw<MiraiHttpAuthenticationResponse>(MiraiHttpRoute.AUTHENTICATE, {
			verifyKey: this.authKey
		});

		this.gopher.setSessionKey(response.session);

		console.debug('Authorization done');
	}

	private async bind() {
		console.debug('Starting binding process');
		await this.gopher.post<undefined>(MiraiHttpRoute.ALLOCATE_SESSION, {
			qq: this.config.botId
		});
		console.debug('Binding process done');
	}

	private async release() {
		console.debug('Starting release process');
		await this.gopher.post(MiraiHttpRoute.FREE_SESSION, {
			qq: this.config.botId
		});
		console.debug('Release process done');
	}

	private startPolling() {
		this.pollerId = setInterval(() => {
			if (this.isPolling) {
				return;
			}

			this.isPolling = true;
			this.currentFetchProcess = this.fetchEvents().then(super.processEvents).finally(() => {
				this.isPolling = false;
			});
		}, this.config.pollInterval);
	}

	private stopPolling() {
		clearInterval(this.pollerId);
		this.pollerId = -1;
	}

	private async fetchEvents(): Promise<Event[]> {
		return await this.gopher.get<Event[]>(MiraiHttpRoute.FETCH_MESSAGES, {
			count: this.config.pollCount || 5
		});
	}
}
