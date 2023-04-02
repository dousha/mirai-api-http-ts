import {MiraiWebsocketCommand} from './MiraiWebsocketCommand';

export interface MiraiWebsocketRequest<T> {
	syncId: number;
	command: MiraiWebsocketCommand;
	subCommand?: string;
	content: T;
}
