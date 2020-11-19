import { Message } from '../objects/Message';
import { Event, EventType } from '../objects/Event';

export function isMessage(a: unknown): a is Message {
	/// XXX: TypeScript is not smart enough, using Any type is necessary.
	const cast = <any>a;
	return typeof cast === 'object'
		&& 'type' in cast
		&& 'sender' in cast
		&& 'messageChain' in cast
		&& typeof cast['type'] === 'string'
		&& typeof cast['sender'] === 'object'
		&& typeof cast['messageChain'] === 'object'
		&& cast['messageChain'] instanceof Array;
}

export function isEvent(a: unknown): a is Event {
	const cast = <any>a;
	return typeof cast === 'object'
		&& 'type' in cast
		&& typeof cast['type'] === 'string'
		&& (<any>Object).values(EventType).includes(cast['type']);
}
