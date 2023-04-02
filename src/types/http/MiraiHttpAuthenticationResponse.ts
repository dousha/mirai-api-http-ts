import {MiraiError} from './MiraiError';

export interface MiraiHttpAuthenticationResponse {
	code: MiraiError;
	session: string;
}
