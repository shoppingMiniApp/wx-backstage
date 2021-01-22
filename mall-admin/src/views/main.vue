<template>
  <a-layout id="components-layout-demo-custom-trigger" :style="screenHeight">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logos" v-if="collapsed">
        <p>Mall</p>
        <p>后台</p>
      </div>
      <div class="logo" v-else>Mall后台管理</div>
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['2']"
        @click="navTo"
      >
        <a-sub-menu key="1">
          <span slot="title"><a-icon type="audit" /><span>账号管理</span></span>
          <a-menu-item key="2">
            <a-icon type="user" />
            <span>用户管理</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3">
          <span slot="title"
            ><a-icon type="folder" /><span>商品管理</span></span
          >
          <a-menu-item key="4">
            <a-icon type="bars" />
            <span>分类添加/删除</span>
          </a-menu-item>
          <a-menu-item key="5">
            <a-icon type="gift" />
            <span>物品添加/删除</span>
          </a-menu-item>
          <a-menu-item key="6">
            <a-icon type="file-image" />
            <span>轮播图添加/删除</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="7">
          <span slot="title"
            ><a-icon type="profile" /><span>订单管理</span></span
          >
          <a-menu-item key="8">
            <a-icon type="form" />
            <span>状态/详情修改</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;text-align:left;">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
      screenWidth: document.body.clientWidth, // 屏幕宽
      screenHeight: {},
    };
  },
  methods: {
    screenHeightChange() {
      let height = document.body.offsetHeight;
      this.screenHeight = { height: height + "px" };
    },
    navTo(key) {
      console.log(key);
      if (key.key == "2") {
        this.$router.push("/account");
      } else if (key.key == "4") {
        this.$router.push("/sortModify");
      } else if (key.key == "5") {
        this.$router.push("/itemModify");
      } else if (key.key == "6") {
        this.$router.push("/bannerModify");
      } else if (key.key == "8") {
        this.$router.push("/orderModify");
      }
    },
  },
  mounted() {
    window.onresize = () => {
      this.screenHeightChange();
    };
    this.screenHeightChange();
  },
};
</script>
<style lang="less" scoped>
#components-layout-demo-custom-trigger {
  //   height: 1080px;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  text-align: left;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  //   background: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid #fff;
  margin: 16px;
  color: #fff;
  transition: all 0.3s;
  text-align: center;
}
.logos {
  margin: 10px 20px;
  border: 1px solid #fff;
  padding: 0;
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    color: white;
  }
}
</style>
