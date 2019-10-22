<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <!-- list初始化时也会触发load，用于加载第一屏的数据，当滚动到底部时，会触发load，并将loading设置为true ，-->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime }}</span>
            <van-button
            size="mini"
            type="default"
            @click="onReplyShow(item)"
            >回复{{item.reply_count}}</van-button>
          </p>
        </div>
        <van-icon
        slot="right-icon"
        :name="item.is_liking ? 'like' : 'like-o'"
        @click="onCommentLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="commentText"
        clearable
        placeholder="请输入评论内容"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="onAddComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
    <!-- v-if 能够重新渲染列表 -->
      <comment-reply
      :comment="currentComment"
      v-if="isReplyShow"
      @close="isReplyShow = false"
      />
      <!-- 接收子组件自定义的方法，close,然后将弹窗关闭 -->
      <!-- <CommentReply></CommentReply> -->
      <!-- <CommentReply > -->
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
// 文章详情的评论列表,发布评论,对评论点赞,取消对评论点赞
import {
  getComments,
  addComment,
  addCommentLike,
  deleteCommentLike } from '@/api/comment'
import CommentReply from '@/components/comment-reply'
export default {
  name: 'ArticleComment',
  components: {
    CommentReply
  },
  props: {},
  data () {
    return {
      isReplyShow: false, // 评论回复弾层的显示与隐藏
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页数据的页码
      limit: 10, // 每页大小
      commentText: '', // 评论内容
      currentComment: {} // 查看回复的当前评论
    }
  },
  methods: {
    /**
     * 展示回复弾层
     */
    onReplyShow (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    },
    /**
     * 对评论点赞/取消对评论点赞
     */
    async onCommentLike (comment) {
      // 获取当前评论的id
      const commentId = comment.com_id.toString()
      // 判断，如果已经点赞，则取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(commentId)
      } else {
        await addCommentLike(commentId)
      }
      // is_liking：是否点赞的状态
      comment.is_liking = !comment.is_liking
    },
    /**
     *发布评论
     */
    async onAddComment () {
      // 获取回复评论内容,trim()去除两边的空格
      const commentText = this.commentText.trim()
      // 当回复评论的内容输入框是空的，直接return回去不在执行下面的代码
      if (!commentText) {
        return
      }

      // 提交数据
      const { data } = await addComment({
        target: this.$route.params.articleId, // 评论的目标的id
        content: commentText // 评论内容
      })

      // 将最新评论的数据，添加到数据列表的顶部
      this.list.unshift(data.data.new_obj)

      // 清空输入框
      this.commentText = ''
    },
    /**
     * 初始化触发，滑到底部时触发
     */
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.$route.params.articleId, // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论的id，表示从id数据向后加载一波数据
      })
      //   2.将数据添加到数组
      this.list.push(...data.data.results)
      //   3.结束loading
      this.loading = false
      //   4。 判断是否加载结束
      // 如果还有数据，则更新获取下一页数据的页码（offset）
      // 如果没有数据了，则finished = true
      if (data.data.results.length) {
        // 上一次会返回最后一个评论的id，作为下移页请求数据的offset,若无数据，则值为null
        // 所以当还有数据的时候，会将上一次的id，赋值给offset，用来获取下一页的数据
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
