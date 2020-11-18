import { GroupMessageSender } from './Message';

/**
 * 群成员信息
 */
export type GroupMember = GroupMessageSender & { id: number };
