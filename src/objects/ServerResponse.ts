import { StatusCode } from './StatusCode';
import { Friend } from './Friend';
import { GroupMember } from './GroupMember';
import { Group } from './Group';

export interface BasicResponse {
	code: StatusCode;
}

export interface SessionInitiateResponse extends BasicResponse {
	session: string;
}

export interface MessagePollResponse extends BasicResponse {
	data: Array<unknown>;
}

export type FriendListingResponse = Friend[];

export type GroupListingResponse = Group[];

export type GroupMemberListingResponse = GroupMember[];
