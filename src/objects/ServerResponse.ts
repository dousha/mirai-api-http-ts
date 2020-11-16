import { StatusCode } from './StatusCode';
import { Message } from './Message';

export interface BasicResponse {
	code: StatusCode;
}

export interface SessionInitiateResponse extends BasicResponse {
	session: string;
}

export interface MessagePollResponse extends BasicResponse {
	data: Array<Message>;
}
