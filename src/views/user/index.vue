<template>
  <div>
      <!-- 导航栏 -->
      <!-- 给保存添加点击事件 -->
    <van-nav-bar
      @click-left="$router.push('/my')"
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-right="onSave"
    />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <van-cell-group>
      <van-cell title="头像" is-link @click="onChangePhoto">
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <van-cell
      @click="nameShow = true"
      title="昵称"
      :value="user.name"
      is-link />
      <van-cell @click="isEditGenderShow = true" title="性别" :value="user.gender === 1 ? '女' : '男'" is-link />
      <van-cell @click="isEditBirthdayShow = true" title="生日" :value="user.birthday" is-link />
    </van-cell-group>
    <!-- /用户信息 -->
    <!-- 图片预览 ,监听是否有变化，选择图片后，要拿到这图片需要进行预览-->
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- /图片预览 -->

    <!-- 编辑昵称的用户弹窗 -->
    <van-dialog
      v-model="nameShow"
      title="用户昵称"
      show-cancel-button
      @confirm="onUserNameConfirm"
    >
    <!--confirm事件，点击确认按钮时触发  -->
    <!-- 不能写v-model,不需要双向帮定，所以写value -->
    <!-- @input事件，输入框内容变化时触发，回调参数是value输入框当前值 -->
      <van-field
      :value="user.name"
      placeholder="请输入用户名"
      @input="onUserNameInput"
       />
    </van-dialog>
    <!-- /编辑昵称的用户弹窗 -->

    <!-- 编辑用户性别的上拉菜单 -->

    <van-action-sheet
      v-model="isEditGenderShow"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    <!-- 选中选项时触发select -->
    <!-- /编辑用户性别的上拉菜单 -->

    <!-- 编辑用户生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
      :style="{ height: '30%' }"
    >
    <!-- confirm:点击完成按钮时触发的事件,回调参数：当前 value -->
    <!-- cancel：点击取消按钮时触发的事件 -->
      <van-datetime-picker
        type="date"
        @confirm="onUserBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- /编辑用户生日 -->
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  data () {
    return {
      nameShow: false,
      user: {}, // 用户个人资料
      userName: '', // 存储编辑用户昵称的输入框数据
      isEditGenderShow: false, // 控制编辑性别上拉菜单的显示状态
      actions: [ // 上拉菜单的数据
        // name 会当作文本输出渲染
        // value 是我自己自定义添加的
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false // 控制用户生日上拉列表的显示与隐藏
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    onUserBirthdayConfirm (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      // 关闭弾层
      this.isEditBirthdayShow = false
    },
    /**
     *编辑性别，选项选中时触发
     */
    onSelect (item) {
      console.log(this.user.gender)

      // 回调参数：item: 选项对应的对象, index: 选择对应的索引
      // 修改数据
      this.user.gender = item.value
      // 关闭上拉菜单
      this.isEditGenderShow = false
    },
    /**
     * 输入框内容变化时触发，回调参数是value输入框当前值
     */
    onUserNameInput (value) {
      // console.log(value) 将改变后的昵称拿到，然后存储
      this.userName = value
    },
    /**
     * 编辑用户昵称，点击确定时触发
     */
    onUserNameConfirm () {
      // 点击确认，拿到输入框的昵称数据，
      this.user.name = this.userName
    },
    /**
     *点击保存，提交头像
     */
    async onSave () {
      // 如果 Content-Type要求是application/json，则 data 传普通对象 {}
      // 如果 Content-Type要求是multipart/form-data，则 data 传 FormData 对象
      // 请提示
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      // 保存的时候调用接口（更新用户信息）
      try {
        const fileObj = this.$refs.file.files[0]
        // 如果用户选择了新的头像，那就 调用接口更新用户头像
        if (fileObj) {
          // new一个formdata,将数据添加进去，提交数据
          const formData = new FormData()
          // formData.append('名字', 数据)
          formData.append('photo', fileObj)
          await updateUserPhoto(formData)
        }
        // 更新其他文本信息
        await updateUserProfile({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })

        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('保存失败')
      }
    },
    /**
     * input发生改变事件，
     */
    onFileChange () {
      // console.log(this.$refs.file.files)
      // window.URL.createObjectUR()可在浏览器上预览本地图片或者视频
      // 将拿到的图片赋值给用户个人资料里的图片，由此渲染到页面上
      // 判断有没有选好的图片，有就执行以下代码，
      // 因为如果点取消，图片是unfiend,会报错
      if (this.$refs.file.files[0]) {
        this.user.photo = window.URL.createObjectURL(this.$refs.file.files[0])
      }
    },
    /**
     *点击事件，选择图片
     */
    onChangePhoto () {
      // 触发了input标签的点击事件，就会弹出选择图片的文件夹
      this.$refs.file.click()
    },
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
