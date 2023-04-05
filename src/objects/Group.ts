import {GroupPermission} from './GroupPermission';

export type GroupId = number;

/**
 * 群标识符
 */
export interface Group {
	/** 群号 */
	id: GroupId;
	/** 群名 */
	name: string;
	/** 机器人的权限 */
	permission: GroupPermission;
}
