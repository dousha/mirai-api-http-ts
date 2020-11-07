import { Message } from '../objects/Message';

export function isMessage(a: unknown): a is Message {
	return typeof a === 'object'
	&& 'type' in a
	&& 'sender' in a
	&& 'messageChain' in a
	&& typeof a['type'] === 'string'
	&& typeof a['sender'] === 'object'
	&& typeof a['messageChain'] === 'object'
	&& a['messageChain'] instanceof Array
}
