import {MiraiError} from '../MiraiError';

export interface MiraiHttpAuthenticationResponse {
	code: MiraiError;
	session: string;
}

export function isHttpAuthenticationResponse(o: unknown): o is MiraiHttpAuthenticationResponse {
	return o instanceof Object
		&& Reflect.has(o, 'code')
		&& Reflect.has(o, 'session')
		&& Reflect.get(o, 'code') instanceof Number
		&& Reflect.get(o, 'session') instanceof String;
}
