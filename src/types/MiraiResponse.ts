import {MiraiError} from './MiraiError';

export interface PartialMiraiResponse {
	code: MiraiError;
	msg: string;
}

export interface MiraiResponse<T> extends PartialMiraiResponse {
	data: T;
}

export function coerceToMiraiResponse<T extends PartialMiraiResponse>(obj: T, key: string | symbol): MiraiResponse<T> {
	Reflect.set(obj, 'data', Reflect.get(obj, key));
	return obj as unknown as MiraiResponse<T>;
}
