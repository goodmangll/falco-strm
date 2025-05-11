import Bottleneck from 'bottleneck'

/**
 * 针对115网盘做的限流
 */

const yywLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1500,
})

// 监听失败事件
yywLimiter.on('failed', async (error, jobInfo) => {
  console.warn(`请求失败: ${error}`)
  // 最大重试3次
  if (jobInfo.retryCount <= 3) {
    const delay = (jobInfo.retryCount + 1) * 1500
    console.log(`将在 ${delay}ms 后重试`)
    return delay
  }
  return 0
})

// 监听重试事件
yywLimiter.on('retry', (error, jobInfo) => {
  console.log(`正在重试请求: ${jobInfo.retryCount}次`)
  if (error) {
    console.error('重试过程中发生错误:', error)
  }
})

export default yywLimiter
