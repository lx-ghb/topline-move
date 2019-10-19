<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if="loading"/>
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.title">
        <!-- 文章标题 -->
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
            <!-- 文章作者 -->
          <p class="name">{{ article.aut_name }}</p>
          <!-- 时间，全局过滤器 -->
          <p class="time">{{ article.pubdate | relativeTime }}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="onFollow"
        >{{ article.is_followed ? '取消关注' : '+ 关注' }}</van-button>
      </div>
      <!-- 文章的内容 -->
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button
        round
        size="small"
        hairline
        type="primary"
        plain
        :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
        >{{article.attitude === 1 ? '取消点赞' : '点赞'}}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
        round size="small"
        hairline type="danger"
        plain
        icon="delete"
        @click="onDislike"
        >{{article.attitude === 0 ? '取消不喜欢' : '不喜欢'}}</van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败的消息提示 -->
    <div class="error" v-else>
      <p>网络超时，点击 <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
    <!-- /加载失败的消息提示 -->
  </div>
</template>

<script>
// 文章详情接口 ,点赞，取消点赞，不喜欢，取消不喜欢
import {
  getArticle,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user' // 关注用户，取消关注用户

export default {
  name: 'ArticleIndex',
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {} // 文章详情
    }
  },
  created () {
    this.loadArticle() // 加载文章详情的数据
  },
  methods: {
    /**
       * 不喜欢，取消不喜欢
       */
    async onDislike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 0) {
        //  为不喜欢状态，点击则变为无态度
        await deleteDislike(articleId)
        this.article.attitude = -1
      } else {
        //   状态为取消不喜欢，点击后为不喜欢
        await addDislike(articleId)
        this.article.attitude = 0
      }
    },
    /**
     * 点赞、取消点赞
     */
    async onLike () {
      // 获取id
      const articleId = this.article.art_id.toString()
      //   如果已赞，则取消点赞
      if (this.article.attitude === 1) {
        await deleteLike(articleId)
        // 取消点赞后，将状态改为-1:无状态
        this.article.attitude = -1
      } else {
        // 反之就是点赞,点赞成功后将状态改为1：点赞
        await addLike(articleId)
        this.article.attitude = 1
      }
    },
    /**
     * 关注、取消关注
     */
    async onFollow () {
      // 如果获取到的数据中，已经关注，则显示取消关注,点击调用取消关注用户接口
      if (this.article.is_followed) {
        await unFollowUser(this.article.aut_id)
      } else {
        //   否则点击后会调用，关注用户
        await followUser(this.article.aut_id)
      }
      //   点击后，取反
      this.article.is_followed = !this.article.is_followed
    },
    /**
       * 根据id获取文章详情的数据
       */
    async loadArticle () {
      // 开启loading
      this.loading = true
      try {
        // 从地址栏获取文章id
        const { data } = await getArticle(this.$route.params.articleId)
        //   console.log(data)
        this.article = data.data
      } catch (err) {
        this.$toast('加载失败')
      }
      //   无论是加载数据成功还是失败，loading都需要结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
