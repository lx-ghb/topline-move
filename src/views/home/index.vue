<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar
      title="首页"
    />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab
      :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      >
        <!-- 文章列表 -->
        <!--
           loading 控制上拉加载更多的loading效果
           finished 控制是否预加载结束
           finished-text 是所有数据加载完后提示的文本
           @load="onLoad" 上拉加载更多的触发事件
         -->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <!-- 列表组件会在初始化的时候自动触发load 事件，而调用onload方法 -->
        <!--列表的内容  -->
          <van-cell
            v-for="item in channel.articles"
            :key="item"
            :title="item"
          />
        </van-list>
        <!-- /文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel' // 推荐的频道列表
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      channels: [] // 频道列表
    }
  },
  methods: {
    //  当数据的列表未满屏，会再次自动执行onload，重新加载十条数据
    onLoad () {
      const activeChannel = this.channels[this.active]
      // 1. 获取请求数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          // 2。将数据添加到当前的点击的频道的articles中
          activeChannel.articles.push(activeChannel.articles.length + 1)
        }
        // 3.加载状态结束
        activeChannel.loading = false
        // 判断当前频道列表的数据是否已经加载完，如果没有数据，将finished设置为true
        if (activeChannel.articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 2000)
    },
    // onLoad () {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     // 加载状态结束
    //     this.loading = false
    //     // 十条数据加载完成后，停止加载状态，若不够一屏，会再去调用onload

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 2000)
    // },
    async loadChannels () {
      const { data } = await getDefaultChannels()

      const channels = data.data.channels
      //   遍历频道
      channels.forEach(channel => {
        channel.articles = [] // 储存频道的文章列表
        channel.loading = false // 频道的上拉加载更多的 loading 状态
        channel.finished = false // 存储频道的加载结束状态
      })
      this.channels = channels
      console.log(data)
    }
  },
  created () {
    this.loadChannels()
  }
}
</script>

<style>

</style>
