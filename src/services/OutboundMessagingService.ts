import { SessionAuthenticationService } from './SessionAuthenticationService';
import { HttpService } from './HttpService';
import { OutboundMessageChain } from '../objects/OutboundMessageChain';
import { BasicResponse } from '../objects/ServerResponse';

export class OutboundMessagingService {
	constructor(private readonly auth: SessionAuthenticationService, private readonly http: HttpService) {
		this.auth = auth;
		this.http = http;
	}

	public sendToFriend(num: number, msg: OutboundMessageChain) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendFriendMessage', {
				sessionKey: token,
				target: num,
				messageChain: msg.chain,
			}));
	}

	public sendToGroup(num: number, msg: OutboundMessageChain) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendGroupMessage', {
				sessionKey: token,
				target: num,
				messageChain: msg.chain,
			}));
	}

	public sendToTemp(groupId: number, recipientId: number, msg: OutboundMessageChain) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/sendTempMessage', {
				sessionKey: token,
				qq: recipientId,
				group: groupId,
				messageChain: msg.chain,
			}));
	}

	public revokeMessage(messageId: number) {
		return this.auth.obtainToken().then(token =>
			this.http.post<BasicResponse>('/recall', {
				sessionKey: token,
				target: messageId,
			}));
	}
}
