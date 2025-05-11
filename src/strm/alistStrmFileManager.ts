import type { AlistTemplate } from '@linden/alist-sdk-ts'
import type { FileItem } from '@linden/alist-sdk-ts/dtos'
import type { StrmFileManager } from './strmFileManager'
import fs from 'node:fs'
import path from 'node:path'
import yywLimiter from '../limiter/yywLimiter'

/**
 * alist strm 管理器
 *
 * @author linden
 */
export default class AlistStrmFileManager implements StrmFileManager {
  private readonly alistAddr: string

  constructor(
    private readonly alistTemplate: AlistTemplate,
    private readonly alistRootDir: string,
    private readonly diskRootDir: string,
  ) {
    this.alistAddr = this.alistTemplate.getAddr()
    console.log(this.alistAddr)
  }

  async sync(dir: string = this.alistRootDir): Promise<void> {
    const files = await this.getAlistFiles(dir)
    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.is_dir) {
        await this.sync(filePath)
        continue
      }
      // 1. 获取相对路径（去掉 alistRootDir 前缀）
      const relativePath = path.relative(this.alistRootDir, filePath)
      // 2. 获取不带扩展名的文件名
      const fileNameWithoutExt = path.basename(relativePath, path.extname(relativePath))
      // 3. 获取文件所在目录
      const fileDir = path.dirname(relativePath)
      // 4. 组合最终的 strm 文件路径
      const strmDiskPath = path.join(
        this.diskRootDir,
        fileDir,
        `${fileNameWithoutExt}.strm`,
      )
      console.log(strmDiskPath)
      const dirPath = path.dirname(strmDiskPath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      if (!fs.existsSync(strmDiskPath)) {
        // 文件内容 = alistAddr + '/d' + alist路径中的每一段进行转码
        const content = `${this.alistAddr}/d${filePath.split('/').map((part) => {
          // 对需要编码的字符进行转码：中文、空格、特殊字符等
          return encodeURIComponent(part)
        }).join('/')}`
        fs.writeFileSync(strmDiskPath, content)
      }
    }
  }

  /**
   * 获取全部的文件
   *
   * @param path 路径
   * @param list 列表
   * @returns 文件列表
   */
  private async getAlistFiles(path: string, list: FileItem[] = []): Promise<FileItem[]> {
    // TODO：需要优化，暂时先用115的限流工具对alist的api进行限流
    const res = await yywLimiter.schedule(() =>
      this.alistTemplate.fs.list({
        path,
        page: 1,
        refresh: false,
        per_page: 1000,
      }),
    )
    list.push(...res.content)
    if (res.total > list.length) {
      return this.getAlistFiles(path, list)
    }
    return list
  }
}
