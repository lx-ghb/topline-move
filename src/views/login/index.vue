<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="登录"/>
      <!-- /导航栏 -->
      <!-- 登录表单 -->
      <ValidationObserver ref="loginForm">
        <van-cell-group>
          <!--
            name 提示的文本，是提示消息里面的手机号三个字
            rules 验证规则
            v-slot="{ errors }" 获取校验结果的数据
            required 是不能为空，必须填
            max:6 不能超过六个字符
            :error-message="errors[0]" 验证为成功不提示消息，验证失败提示“手机号不能为空”，
           -->
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
import { setItem } from '@/utils/storage'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15555555555',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      // 表单验证
      const isValid = await this.$refs.loginForm.validate()
      // 当isValid为true时说明表单验证通过，为false说明没通过
      // 所以当isValid为false时，直接return，不在执行下面的代码
      if (!isValid) {
        return
      }
      // 验证通过，loading，请求
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '登录中'
      })
      try {
        // 请求提交表单数据,
        const { data } = await login(this.user)
        toast.clear() //  进入登陆成功的范围要清除toast登录中
        console.log(data)
        // --------------------
        // 登录成功，将数据存储到容器中,
        this.$store.commit('setUser', data.data)

        // 为了防止页面刷新数据丢失，将数据存储到本地存储
        setItem('user', data.data)
        // -------------------------
        this.$toast.success('登录成功')
        this.$router.push('/')
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
