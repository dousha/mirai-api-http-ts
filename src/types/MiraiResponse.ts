import {MiraiError} from './MiraiError';

export interface MiraiResponse<T> {
	code: MiraiError;
	msg: string;
	data?: T;
}
