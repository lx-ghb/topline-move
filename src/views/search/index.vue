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

      <!-- 搜索历史记录 -->
      <van-cell-group>
        <van-cell title="历史记录">
          <template v-if="isDeleteShow">
            <!-- 点击后删除全部的历史记录 -->
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
          </template>
          <van-icon v-else @click="isDeleteShow = true" size="20px" name="delete"/>
        </van-cell>
        <van-cell

        v-for="(item,index) in searchHistories"
        :key="index"
        :title="item"
        @click="onSearch(item)"
        >
        <!-- stop阻止冒泡，当他的父级也有点击事件，子级页有点击事件，就会冒泡，父级会影响到子级 -->
          <van-icon
          size="20px"
          v-show="isDeleteShow"
          @click.stop="searchHistories.splice(index, 1)"
          name="close"/>
        </van-cell>
      </van-cell-group>
      <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storage'
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchIndex',
  data () {
    return {
      isDeleteShow: false,
      searchText: '',
      SearchSuggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [] // 搜索历史记录
    }
  },
  watch: {
    // searchHistories数组内部发生改变，将存储改变后新的数据
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  },
  methods: {
    /**
     * 搜索框：回车或点击搜索，触发该事件
     */
    onSearch (str) {
      // 存储搜索的历史记录
      // 如果搜索的历史记录中已存在，则直接删除
      // 如果要检索的字符串值没有出现，则该方法返回 -1。
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1) // 删除
      }
      //  把最新的记录数据存储到数组最前面
      this.searchHistories.unshift(str)
      //  持久化储存
      setItem('search-histories', this.searchHistories)
      // 携带搜索内容，跳转到  搜索结果
      this.$router.push(`/search/${str}`)
    },

    /**
     * 输入框内容变化时触发
    */
    // async onSearchInput () {
    onSearchInput: debounce(async function () {
      //  防抖优化
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
    }, 300),
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
