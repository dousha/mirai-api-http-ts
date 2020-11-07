import { StatusCode } from './StatusCode';

export interface BasicResponse {
	code: StatusCode;
}

export interface SessionInitiateResponse extends BasicResponse {
	session: string;
}
