/**
 * 管理文件strm
 *
 * @author linden
 */
export interface StrmFileManager {

  /**
   * 同步
   *
   * @param dir 同步的路径
   *
   */
  sync: (dir?: string) => Promise<void>

}
