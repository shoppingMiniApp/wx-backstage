<template>
  <a-layout id="components-layout-demo-custom-trigger" :style="screenHeight">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logos" v-if="collapsed">
        <p>Mall</p>
        <p>后台</p>
      </div>
      <div class="logo" v-else>Mall后台管理</div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1">
          <a-icon type="user" />
          <span>账号管理</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span>nav 3</span>
        </a-menu-item>
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
        Content
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
