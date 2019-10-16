<template>
  <div class="search">
      <!-- 搜索框 -->
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch(searchText)"
        @input="onSearchInput"
        >
        <div slot="action" @click="onSearch(searchText)">搜索</div>
      </van-search>
      <!-- /搜索框 ---------------------------------->

      <!-- 联想建议 -->
      <!-- 点击联想建议，跳转到搜索结果页面，携带搜索的内容 -->
      <van-cell-group>
        <van-cell
        icon="search"
        v-for="(item,index) in SearchSuggestions"
        :key="index"
        @click="onSearch(item)"
        >
        <!--highlight()方法，接受一个参数，返回处理之后的一个字符串，但不影响item本身  -->
        <!-- 遍历后将拿到的数据渲染到页面上，就会触发 highlight()这个方法-->
        <!---->
            <div slot="title" v-html="highlight(item)"></div>
        </van-cell>
      </van-cell-group>
      <!-- /联想建议 -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      SearchSuggestions: [] // 联想建议列表
    }
  },
  methods: {
    /**
     * 搜索框：回车或点击搜索，触发该事件
     */
    onSearch (str) {
      // 携带搜索内容，跳转到  搜索结果
      this.$router.push(`/search/${str}`)
    },

    /**
     * 输入框内容变化时触发
    */
    async onSearchInput () {
      // trim()去掉文本两边的空格
      const searchText = this.searchText.trim()
      // 判断搜索宽管是否有内容，若是没有，直接return出去，代码不在执行
      if (!searchText) {
        return
      }
      // 请求搜索接口，获取与搜索框内容分匹配的，参数是文本框内容
      const { data } = await getSearchSuggestions({
        q: this.searchText
      })
      const searchSuggestions = data.data.options
      // 根据一个字符串创建第一个正则表达式
      // const reg = new RegExp(searchText, 'g')
      // // 遍历拿到的数据，进行高亮显示，
      // // 拿到每一项，进行截取内容，replace不熟悉
      // searchSuggestions.forEach((item, index) => {
      //   searchSuggestions[index] = item.replace(reg, `<span style="color: red;">${searchText}</span>`)
      // })
      // 在赋值给searchSuggestions
      this.SearchSuggestions = searchSuggestions
    },
    /**
     * 遍历联想建议，渲染数据到页面，会触发此方法，
     */
    highlight (str) {
      //  触发 highlight方法，会给内容添加高亮，
      // 但不会影响原本的数据，所有携带的参数，是不带标签的
      const reg = new RegExp(this.searchText, 'g')
      return str.replace(reg, `<span style="color: red;">${this.searchText}</span>`)
    }
  }
}
</script>

<style>

</style>
