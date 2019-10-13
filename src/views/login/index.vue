<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="登录"/>
      <!-- /导航栏 -->
      <!-- 登录表单 -->
      <ValidationObserver>
        <van-cell-group>
          <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors}">
            <van-field
              v-model="user.mobile"
              required
              clearable
              label="手机"
              placeholder="请输入手机号"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors}">
            <van-field
              v-model="user.code"
              type="password"
              label="验证码"
              placeholder="请输入验证码"
              required
              :error-message="errors[0]"
            />
          </ValidationProvider>
        </van-cell-group>
      </ValidationObserver>
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
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '登录中'
      })
      try {
        // 表单验证
        const isValid = await this.$refs.loginForm.validate()
        // 当isValid为true时说明表单验证通过，为false说明没通过
        // 所以当isValid为false时，直接return，不在执行下面的代码
        if (!isValid) {
          return
        }
        // 请求提交表单数据,
        const { data } = await login(this.user)
        toast.clear() //  进入登陆成功的范围要清除toast登录中
        console.log(data)
        this.$toast.success('登录成功')
      } catch (err) { // 所有大于400 的状态码都会到catch里面
        toast.clear() // 进入到catch中，说明登陆失败，要清除toast登录中
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
