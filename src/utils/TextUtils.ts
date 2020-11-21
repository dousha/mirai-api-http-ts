/**
 * 将字符串转换成 Mirai 码兼容的形式
 * 
 * @param {string} str 需要被转换的字符串
 * @returns {string} 转换后的字符串
 */
export function escapeMirai(str: string): string {
	return str.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
}
