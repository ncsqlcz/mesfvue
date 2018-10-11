/*
 * @Author: liucz 
 * @Date: 2018-06-12 19:56:37 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-06-13 11:32:54
 */
<template>
  <section v-if="notification !== ''" class="w-100">
    <div class="notification-wrap" ref="notificationWrap">
      <i class="fa fa-bell-o notification-icon"></i>
      <div class="notification-content-wrap">
        <p class="notification-content" ref="notificationContent">{{ notification }}</p>
      </div>
    </div>
  </section>
</template>

<script>
  // import utils from '../../../common/js/utils'
  export default {
    name: 'text-scroll',
    data () {
      return {
        notification: '',
        textScrollTimer: null,
        textScrollRepeatTimer: null
      }
    },
    props: {
      text: {
        type: String,
        required: true
      },
      scrollTime: {
        type: Number,
        default: 20
      }
    },
    computed: {},
    components: {},
    mounted () {
      this.notification = this.text
      this.initScroll()
    },
    methods: {
      // 初始化页面
      initScroll () {
        clearTimeout(this.textScrollTimer)
        clearTimeout(this.textScrollRepeatTimer)
        this.$nextTick(() => {
          let p = this.$refs.notificationContent
          p.style.transition = 'none'
          p.style.marginLeft = '100%'
          setTimeout(this.textScroll)
        })
      },
      textScroll () {
        let p = this.$refs.notificationContent
        if (p) {
          p.style.transition = `margin-left ${this.scrollTime}s linear`;
          p.style.marginLeft = -p.offsetWidth + 'px'
          this.textScrollTimer = setTimeout(() => {
            p.style.transition = 'none'
            p.style.marginLeft = '100%'
            this.textScrollRepeatTimer = setTimeout(this.textScroll, 500)
          }, this.scrollTime * 1000)
        }
      }
    },
    watch: {
      text (val) {
        this.notification = val
        this.initScroll()
      }
    },
    destroyed () {
      clearTimeout(this.textScrollTimer)
      clearTimeout(this.textScrollRepeatTimer)
    }
  }
</script>

<style scoped lang="scss">
@import '~scss_vars';
.notification-wrap {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  box-sizing: content-box;
  padding-left: 20px;
  position: relative;
  font-size: 120%;
  .notification-icon {
    color: #FF6666;
    position: absolute;
    z-index: 3;
    left: 0;
    padding: 13px 0;
    display: block;
    width: 20px;
    background-color: $toolbar-bg-color;
  }
  .notification-content-wrap {
    position: relative;
    .notification-content{
      margin: 0 0;
      position: absolute;
      z-index: 2;
      left: 0;
      height: 40px;
      white-space: nowrap;
      margin-left: 100%;
      color: #FF6666;
    }
  }
}
</style>
