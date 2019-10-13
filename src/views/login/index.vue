<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="登录"/>
      <!-- /导航栏 -->
      <!-- 输入框 -->
      <van-cell-group>
      <van-field
        v-model="user.mobile"
        required
        clearable
        label="手机"
        placeholder="请输入手机号"
      />

      <van-field
        v-model="user.code"
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
      />
    </van-cell-group>
      <!-- /输入框 -->
      <!-- ----  登录按钮------- -->
    <div class="login_btn">
      <van-button @click="onLogin" class="van-button" type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13245899456',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      try {
      // 请求提交表单数据,
        const { data } = await login(this.user)
        console.log(data)
        this.$toast.success('登录成功')
      } catch (err) { // 所有大于400 的状态码都会到catch里面
        //   判断响应回来的数据是否存在，并且返回的数据错误提示的状态码为400执行此命令
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或者验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
/* 将导航背景为蓝色的样式，写到全局 */
.login {
    .login_btn {
        padding: 20px;
        .van-button {
            width: 100%;
            border-radius: 5px;
        }
    }
}
</style>
