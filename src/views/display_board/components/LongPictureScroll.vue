/*
 * @Author: liucz 
 * @Date: 2018-06-13 08:46:43 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-06-28 18:00:28
 */
<template>
  <section class="w-100 h-100" :style="{opacity: loading ? '0' : '1'}">
    <div class="img-wrap" ref="imgWrap" v-loading="loading">
      <img v-for="(src, index) in list" :src="src" :key="index" alt="" ref="imgs">
    </div>
  </section>
</template>

<script>
  // import utils from '../../../common/js/utils'
  export default {
    name: 'long-picture-scroll',
    data () {
      return {
        list: [],
        scrollTimer: null,
        scrollRepeatTimer: null,
        loading: true
      }
    },
    props: {
      pictureList: {
        type: Array,
        required: true
      },
      scrollTime: {
        type: Number,
        default: 20
      },
      resize: [Number, String]
    },
    computed: {},
    components: {},
    mounted () {
      // this.initPage()
    },
    methods: {
      // 初始化页面
      initPage () {
        this.initWrapPosition()
        this.$nextTick(() => {
          let img = this.$refs.imgs[this.list.length - 1]
          this.loading = true
          if (img) {
            img.onload = () => {
              this.loading = false
              this.initWrapPosition().then(this.scroll)
            }
          }
        })
      },
      // 初始化位置
      initWrapPosition () {
        return new Promise(resolve => {
          clearTimeout(this.scrollTimer)
          clearTimeout(this.scrollRepeatTimer)
          let wrap = this.$refs.imgWrap
          if (wrap) {
            // 包裹这个组件的容器的高度
            wrap.style.transition = 'none'
            setTimeout(() => {
              wrap.style.top = wrap.parentNode.offsetHeight + 'px'
              setTimeout(resolve, 100)
            }, 50)
          }
        })
      },
      scroll () {
        clearTimeout(this.scrollTimer)
        clearTimeout(this.scrollRepeatTimer)
        let wrap = this.$refs.imgWrap
        if (wrap) {
          // 开始滚动
          wrap.style.transition = `top ${this.scrollTime}s linear`;
          wrap.style.top = - (wrap.scrollHeight + wrap.parentNode.offsetHeight) + 'px'
          this.scrollTimer = setTimeout(() => {
            // 初始化位置并继续滚动
            wrap.style.transition = 'none'
            wrap.style.top = wrap.parentNode.offsetHeight + 'px'
            this.scrollRepeatTimer = setTimeout(this.scroll, 100)
          }, this.scrollTime * 1000)
        }
      }
    },
    watch: {
      pictureList (vals) {
        this.list = vals
        this.initPage()
      },
      '$route' (val) {
        this.initPage()
      },
      // 滚动过程如果点击全屏
      resize () {
        this.initWrapPosition().then(this.scroll)
      }
    },
    destroyed () {
      clearTimeout(this.scrollTimer)
      clearTimeout(this.scrollRepeatTimer)
    }
  }
</script>

<style scoped lang="scss">
@import '~scss_vars';
section{
  position: absolute;
  z-index: 2;
  .img-wrap{
    position: absolute;
    z-index: 2;
    height: 100%;
    width: 100%;
    img{
      display: block;
      width: 100%;
    }
  }
}
</style>
