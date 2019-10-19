<template>
  <div>
      <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
    />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <van-cell-group>
      <van-cell title="头像" is-link>
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender === 1 ? '女' : '男'" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
    <!-- /用户信息 -->
  </div>
</template>

<script>
import { getProfile } from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {} // 用户个人资料
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    /**
       *获取用户个人资料
       */
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
    }
  }
}
</script>
