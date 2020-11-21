import { GroupPermission } from './GroupPermission';

/**
 * 群标识符
 */
export interface Group {
	/** 群号 */
	id: number;
	/** 群名 */
	name: string;
	/** 机器人的权限 */
	permission: GroupPermission;
}
