<template>
  <div class="login-bg">
    <div v-for="n in 5" :key="n"></div>
  </div>

  <div class="login">
    <el-form ref="registerRef" v-no-enter class="login-form" :model="registerForm" :rules="registerRules">
      <h3 class="title">nest-admin后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model.trim="registerForm.username" auto-complete="off" maxlength="50" placeholder="账号" size="large" type="text">
          <template #prefix>
            <user class="input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" auto-complete="new-password" maxlength="20" placeholder="密码" size="large" type="password" show-password @keyup.enter="handleRegister">
          <template #prefix>
            <lock class="input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" auto-complete="new-password" maxlength="20" placeholder="确认密码" size="large" type="password" show-password @keyup.enter="handleRegister">
          <template #prefix>
            <lock class="input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button :loading="registerLoading" size="large" style="width: 100%" type="primary" @click.prevent="handleRegister">
          {{ registerLoading ? '注 册 中...' : '注 册' }}
        </el-button>
      </el-form-item>
      <div class="go-login">
        <el-link type="primary" :underline="false" @click="router.push('/login')">使用已有账号登录</el-link>
      </div>
    </el-form>

    <div class="el-login-footer">
      <span>Copyright © 2018-2024 nest-admin All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { register } from '@/api/login'
import { createAccountExistsValidator } from '@/composables/auth/useAccountCheck'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const registerRef = ref<FormInstance>()
const registerLoading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 密码变化时重新校验确认密码，避免陈旧的"两次密码不一致"提示残留
watch(
  () => registerForm.password,
  () => {
    if (registerForm.confirmPassword) {
      registerRef.value?.validateField('confirmPassword')
    }
  }
)

const registerRules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 50, trigger: 'blur', message: '账号长度必须为 2 到 50 个字符' },
    createAccountExistsValidator()
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, trigger: 'blur', message: '密码长度必须为 5 到 20 个字符' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    {
      validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 注册处理（防抖防止连点，loading 防止请求期间回车重复提交）
const handleRegister = useDebounce(() => {
  if (registerLoading.value) return
  registerRef.value?.validate((valid) => {
    if (valid) {
      registerLoading.value = true
      register(registerForm.username, registerForm.password)
        .then(() => {
          ElMessage.success('注册成功')
          // 跳转登录页并带上账号，由登录页读取 query 预填
          router.push({ path: '/login', query: { username: registerForm.username } })
        })
        .catch(() => {
          // 失败提示由请求拦截器统一展示（如"注册账号已存在"）
        })
        .finally(() => {
          registerLoading.value = false
        })
    }
  })
}, 500)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/login.scss' as *;

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #f0f2f5;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 360px;
  padding: 25px 25px 5px 25px;

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 10px;
  }

  .go-login {
    margin: 0px 0px 15px 0px;
    text-align: right;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #909399;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
