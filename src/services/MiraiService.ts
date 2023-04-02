import {PluginInfo} from '../types/system/PluginInfo';

export abstract class MiraiService {
	protected constructor(protected sessionKey: string, protected botId: string) {
	}

	/**
	 * 启动一个新的 MiraiService 实例。
	 * <br>
	 * 这个函数应该完成认证和会话启动过程，如果中间出现了错误，则应抛出错误。
	 * @throws {NetworkError} 因故无法与远端通信
	 * @throws {InvalidDataError} 提供的数据无效，如 botId 无效或 sessionKey 无效
	 */
	abstract setup(): Promise<void>;

	/**
	 * 停止一个 MiraiService 实例。
	 * <br>
	 * 这个函数应该完成会话停止过程和其他相应的清理。这个函数遇到错误时应仅输出日志。
	 */
	abstract teardown(): Promise<void>;

	/**
	 * 获取 mirai-api-http 插件的信息。
	 * @returns 插件的信息
	 */
	abstract fetchPluginInfo(): Promise<PluginInfo>;
}
