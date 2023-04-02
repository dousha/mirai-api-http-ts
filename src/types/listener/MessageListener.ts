import {InboundMessage} from '../../objects/InboundMessage';
import {Message} from '../../objects/Message';

export type HandlingCriteria<T extends Message> = (xs: InboundMessage<T>) => boolean;

export abstract class MiraiMessageListener<T extends Message> {
	protected constructor(public readonly handlingCriteria: HandlingCriteria<T>) {
	}

	abstract handleMessage(xs: InboundMessage<T>): Promise<void>;
}
