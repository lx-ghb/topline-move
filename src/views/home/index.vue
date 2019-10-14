<template>
  <div class="home">
    <!-- 导航栏 可视区域的固定定位-->
    <van-nav-bar title="首页" fixed/>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active" animated swipeable>
      <van-tab
      :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      >
        <!-- 文章列表 -->
        <!-- channel.isPullDownLoading 操作完成后设置值为false,表示操作完成 -->
        <!-- 当执行下拉动作，会触发 refresh事件-->
        <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
        <!--
           loading 控制上拉加载更多的loading效果
           finished 控制是否预加载结束bnpm i dayjs
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
          <!-- article.art_id ,超出了JS的安全整数范围，已经
          被json-bigint 转成了对象，key只能绑定字符串-->
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
            <!-- 显详细内容 -->
              <div slot="label">
                <van-grid :column-num="3">
                  <van-grid-item
                    v-for="(img, index) in article.cover.images"
                    :key="index"
                  >
                  <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <!-- 文章作者的名字，文章被评论的数量，文章的发布日期 -->
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <!-- article.pubdate就会作为参数自动传入 -->
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <!-- /文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道管理 -->
    <van-popup
      v-model="isChannelEditShow"
      round
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
          <van-button type="danger" size="mini">编辑</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(channel,index) in channels"
            :key="index"
            :text="channel.name"
          />
        </van-grid>

        <van-cell title="推荐频道" :border="false" />
        <van-grid :gutter="10">
          <van-grid-item
          @click="onAddChannel(channel)"
            v-for="(channel, index) in recommondChannels"
            :key="index"
            :text="channel.name"
          />
        </van-grid>
      </div>
    </van-popup>
    <!-- /频道管理 -->
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storage'
import { getArticles } from '@/api/article'
import { getDefaultChannels, getAllChannels } from '@/api/channel' // 推荐的频道列表
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      channels: [], // 频道列表
      allChannels: [], // 存储所有的频道列表
      isChannelEditShow: true // 这里我们先设置为 true 就能看到弹窗的页面了
    }
  },
  watch: {
    // 监听channels（我的频道的变化），不论是添加进来，还是删除，都会触发
    channels (newVal) {
      // 只要数据变化，就会将变化的新数据存储
      setItem('channels', newVal)
    }
  },
  methods: {
    // 点击添加频道至我的频道
    onAddChannel (channel) {
      this.channels.push(channel)
    },
    // =================================================
    // 获取所有频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // ============================================
    async onRefresh () {
      // 获取当前的频道对象
      const activeChannel = this.channels[this.active]

      // 1.请求获取最新推荐的文章列表，接口依旧是获取文章列表，因为每次拉取到的数据
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 下拉刷新都是最新的文章列表，所以传递的参数为当前最新的时间戳
        with_top: 1
      })
      //  2. 拿到数据后，将数据添加到文章列表的顶部
      activeChannel.articles.unshift(...data.data.results)
      // 3.关闭下拉舒心的loading状态
      activeChannel.isPullDownLoading = false
      // 4.提示刷新成功
      this.$toast('刷新成功')
    },

    // =============================================

    async onLoad () {
      const activeChannel = this.channels[this.active]

      //  1. 获取请求数据
      const { data } = await getArticles({
        // channel_id, timestamp, withTop是接口要求的字段名称
        channel_id: activeChannel.id,
        timestamp: activeChannel.timestamp || Date.now(),
        with_top: 1
      })
      // 2.将拿到的数据添加到当前的点击的频道的articles中
      activeChannel.articles.push(...data.data.results)
      // 3.加载状态结束
      activeChannel.loading = false
      // 4.判断当前频道列表的数据是否已经加载完
      if (data.data.pre_timestamp) {
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        activeChannel.finished = true
      }
    },
    //  当数据的列表未满屏，会再次自动执行onload，重新加载十条数据
    // onLoad () {
    //   const activeChannel = this.channels[this.active]
    //   // 1. 获取请求数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       // 2。将数据添加到当前的点击的频道的articles中
    //       activeChannel.articles.push(activeChannel.articles.length + 1)
    //     }
    //     // 3.加载状态结束
    //     activeChannel.loading = false
    //     // 判断当前频道列表的数据是否已经加载完，如果没有数据，将finished设置为true
    //     if (activeChannel.articles.length >= 40) {
    //       activeChannel.finished = true
    //     }
    //   }, 2000)
    // },
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
    // 获取我的频道列表
    async loadChannels () {
      let channels = []
      // 读取本地数据
      const localChannels = getItem('channels')
      // 判断
      if (localChannels) {
        // 如果有本地存储的我的频道列表，就使用本地
        channels = localChannels
      } else {
        // 如果没有本地存储的频道列表，则请求获取后台推荐的频道列表
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }
      // ----
      //   遍历频道
      channels.forEach(channel => {
        channel.articles = [] // 储存频道的文章列表
        channel.loading = false // 频道的上拉加载更多的 loading 状态
        channel.finished = false // 存储频道的加载结束状态
        channel.timestamp = null // 存储频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉舒心loading的状态
      })
      // 最后把数据更新到组建中
      this.channels = channels
    }
  },
  computed: {
    // 获取推荐列表
    recommondChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 判断channel是否存在我的频道中
        // 如果不存在，说明就剩余的就是推荐的频道
        // 数组的 find 方法
        // 每遍历一次就会判断item.id === channel.id条件
        // 如果是true，则停止遍历，返回满足该条件的元素，在去判断下一个元素
        // 如果为false，则继续遍历
        // 如果没有符合条件的数据，会返回undefind
        const ret = this.channels.find(item => item.id === channel.id)
        // 判断有不符合条件的数据，push进定义好的空数组中
        if (!ret) {
          arr.push(channel)
        }
      })
      // 遍历完成，将所有不符合条件得数据添加进arr中后，在江湾城的数组return
      return arr
    }
  },
  created () {
    this.loadChannels()
    this.loadAllChannels() //  加载所有频道列表
  }
}
</script>

<style lang="less" >
  .home{
    .channel-container {
      padding-top: 30px;
    }
    .van-tabs {
      .van-tabs__wrap {
        position: fixed;
        top: 46px;
        left: 0;
        right: 16px;
        z-index: 2;
      }
      .van-tabs__content{
        margin-top: 90px;
        margin-bottom: 50px;
      }
    }

    .article-info {
      display: flex;  // 弹性布局
      align-items: center;  //居中对齐
      justify-content: space-between;  //各行留有空白
      .meta span {
        margin-right: 10px;
      }
    }
  }
</style>
