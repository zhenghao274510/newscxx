<template>
  <div class="contain">
    <div class="box">
      <div class="pay">
        <img src="/static/img/chenggong.png" alt />
        <p>您的信息已提交平台进行审核</p>
        <p>请耐心等待审核结果</p>
        <div @click="back">回到个人中心</div>
      </div>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';

export default {
  data() {
    return {};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad() {
      wx.setNavigationBarTitle({
      title: "提交成功"
    });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
  //生命周期 - 更新之前
  beforeUpdate() {},
  //生命周期 - 更新之后
  updated() {},
  //生命周期 - 销毁之前
  beforeDestroy() {},
  //生命周期 - 销毁完成
  destroyed() {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style scoped lang="stylus">
.contain {
  width: 100%;
  height: 100%;
}

.box {
  width: 100%;

  .pay {
    width: 100%;
    padding: 2rem 0.4rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;

    img {
      width: 1.7rem;
      height: 1.7rem;
    }

    p {
      margin: 0.15rem 0;
    }

    div {
      width: 6rem;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgb(115, 210, 66);
      border-radius: 6px;
      color: #fff;
    }
  }
}
</style>