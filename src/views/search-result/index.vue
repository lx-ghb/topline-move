<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      :title="$route.params.q + '的搜索结果'"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <!-- 初始化时会触发load事件，当组件滚动到底部时会触发 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [], // 数据列表
      loading: false, // 上拉是否加载更多的状态loading
      finished: false, //  是否加载结束
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数，不传默认为1
        per_page: this.perPage, // 每页数量，不传每页数量有后端来决定
        q: this.$route.params.q
      })
      console.log(data)

      // 2.将拿到的数据添加到数组中
      this.list.push(...data.data.results)
      // 3.结束loading
      this.loading = false
      // 4.判断数据是否加载完成
      if (data.data.results.length) {
        // results数组中是否还有数据，更新页码
        this.page++
      } else {
        // 如果没有，则将finished设置为true
        this.finished = true
      }
    }
    // onLoad () {
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     // 加载状态结束
    //     this.loading = false
    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 500)
    // }
  }
}
</script>

<style lang="less" scoped>
  .search-result {
    margin-top: 46px;
  }
</style>
