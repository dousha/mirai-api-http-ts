import { MessageContent, MessageContentType } from '../objects/Message';

export function hasXmlMessage(arr: MessageContent[]): boolean {
	return arr.findIndex(x => x.type === MessageContentType.XML) >= 0;
}

export function hasJsonMessage(arr: MessageContent[]): boolean {
	return arr.findIndex(x => x.type === MessageContentType.JSON) >= 0;
}

export function shouldNotBeMultipart(arr: MessageContent[]): boolean {
	return hasXmlMessage(arr) || hasJsonMessage(arr);
}
