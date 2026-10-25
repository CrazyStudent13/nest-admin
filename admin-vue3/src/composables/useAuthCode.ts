import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getCodeImg } from '@/api/login'
import { isEmpty } from 'radash'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'

// ==================== 类型定义 ====================

/**
 * 登录表单数据类型
 */
export interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
  code?: string
  uuid?: string
}

/**
 * 验证码响应数据类型
 */
export interface CaptchaResponse {
  captchaEnabled: boolean
  uuid: string
  img: string
}

/**
 * 验证码信息接口
 */
export interface AuthCodeInfo {
  captchaEnabled: boolean // 验证码开关
  loading: boolean // 是否加载中
  refreshing: boolean // 是否正在刷新
  imgUrl: string // 验证码图片地址
  uuid: string // 验证码唯一标识
  gapTime: number // 刷新间隔时间（毫秒），默认 10 秒
}

/**
 * Cookie 数据接口
 */
interface CookieData {
  username?: string
  password?: string
  rememberMe?: string
}

// ==================== 状态管理 ====================

// 验证码相关信息
const authCodeInfo = reactive<AuthCodeInfo>({
  captchaEnabled: true, // 验证码开关
  loading: false, // 是否加载中
  refreshing: false, // 是否正在刷新
  imgUrl: '', // 验证码图片地址
  uuid: '', // 验证码唯一标识
  gapTime: 10000 // 刷新间隔时间（毫秒），默认 10 秒
})

// 记录上次刷新的时间戳
let lastRefreshTime = 0

// 自动重试相关配置
const MAX_RETRY_COUNT = 3 // 最大重试次数
const RETRY_DELAY = 2000 // 重试间隔（毫秒），默认 2 秒
let retryCount = 0 // 当前重试次数

// ==================== 核心函数 ====================

/**
 * 获取图片验证码
 * @param form - 登录表单数据
 * @param isClick - 是否点击触发
 * @returns Promise<void>
 */
const getValidateCode = async (form: LoginForm, isClick = false): Promise<void> => {
  try {
    // 检查是否正在加载
    if (authCodeInfo.loading || authCodeInfo.refreshing) {
      ElMessage.warning('正在请求验证码，请稍等')
      return
    }

    // 如果是点击触发，进行额外检查
    if (isClick) {
      // 检查用户名和密码是否为空
      if (isEmpty(form.username)) {
        ElMessage.error('请输入用户账号，否则无法刷新验证码')
        return
      }

      if (isEmpty(form.password)) {
        ElMessage.error('请输入用户密码，否则无法刷新验证码')
        return
      }

      // 检查刷新间隔
      const now = Date.now()
      if (lastRefreshTime > 0 && now - lastRefreshTime < authCodeInfo.gapTime) {
        const remainingSeconds = Math.ceil((authCodeInfo.gapTime - (now - lastRefreshTime)) / 1000)
        ElMessage.warning(`请 ${remainingSeconds} 秒后再刷新`)
        return
      }

      // 用户手动刷新，重置重试计数
      retryCount = 0
    }

    // 如果是点击刷新，设置 refreshing 状态
    if (isClick && authCodeInfo.imgUrl) {
      authCodeInfo.refreshing = true
    }

    const responseData = (await getCodeImg()) as any
    // 后端返回格式: { code: 200, msg: '操作成功', data: { captchaEnabled, uuid, img } }
    const captchaData = responseData.data
    authCodeInfo.loading = true
    authCodeInfo.captchaEnabled = captchaData?.captchaEnabled === undefined ? true : captchaData.captchaEnabled
    authCodeInfo.uuid = captchaData?.uuid
    if (authCodeInfo.captchaEnabled) {
      authCodeInfo.imgUrl = captchaData?.img
      authCodeInfo.loading = false
      authCodeInfo.refreshing = false
      // 更新最后刷新时间
      if (isClick) {
        lastRefreshTime = Date.now()
      }
      // 成功获取后重置重试计数
      retryCount = 0
    } else {
      authCodeInfo.loading = false
      authCodeInfo.refreshing = false
    }
  } catch (err: any) {
    console.error('验证码获取错误:', err)
    authCodeInfo.refreshing = false

    // 检查是否是验证码过期的错误（来自登录接口）
    if (err?.message?.includes('验证码已过期')) {
      // 验证码过期不需要重试，提示用户重新获取即可
      ElMessage.warning('验证码已过期，请重新获取')
      retryCount = 0 // 重置重试计数
      return
    }

    // 自动重试逻辑（仅针对网络错误、超时等）
    retryCount++
    if (retryCount < MAX_RETRY_COUNT) {
      console.log(`验证码获取失败，将在 ${RETRY_DELAY / 1000} 秒后自动重试（${retryCount}/${MAX_RETRY_COUNT}）`)
      // 显示友好的提示信息
      ElMessage.warning({
        message: `验证码加载失败，正在自动重试（${retryCount}/${MAX_RETRY_COUNT}）...`,
        duration: RETRY_DELAY
      })
      // 延迟后自动重试
      setTimeout(() => {
        getValidateCode(form, false) // 注意：这里传 false，表示自动重试
      }, RETRY_DELAY)
    } else {
      // 超过最大重试次数，提示用户手动刷新
      ElMessage.error('验证码加载失败，请点击验证码图片手动刷新')
      retryCount = 0 // 重置计数
    }
  }
}

/**
 * 从 Cookie 中获取登录用户信息
 * @param data - 默认表单数据
 * @returns 填充后的表单数据
 */
const getUserCookie = (data: LoginForm): LoginForm => {
  const cookieData: CookieData = {
    username: Cookies.get('username'),
    password: Cookies.get('password'),
    rememberMe: Cookies.get('rememberMe')
  }

  const form: LoginForm = {
    username: isEmpty(cookieData.username) ? data.username : cookieData.username,
    password: isEmpty(cookieData.password) ? data.password : (decrypt(cookieData.password) || ''),
    rememberMe: isEmpty(cookieData.rememberMe) ? false : Boolean(cookieData.rememberMe)
  }

  return form
}

/**
 * 在 Cookie 中保存用户信息
 * 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码，否则移除
 * @param data - 表单数据
 */
const setUserCookie = (data: LoginForm): void => {
  if (data.rememberMe) {
    Cookies.set('username', data.username, { expires: 30 })
    Cookies.set('password', encrypt(data.password), { expires: 30 })
    Cookies.set('rememberMe', String(data.rememberMe), { expires: 30 })
  } else {
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('rememberMe')
  }
}

// ==================== 导出 ====================

export { getValidateCode, getUserCookie, setUserCookie, authCodeInfo }
