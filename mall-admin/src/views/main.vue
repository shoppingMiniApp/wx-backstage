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
        :selected-keys="sub"
        @click="navTo"
        :open-keys.sync="keys"
      >
        <a-sub-menu key="1">
          <span slot="title"><a-icon type="audit" /><span>账号管理</span></span>
          <a-menu-item key="2">
            <a-icon type="user" />
            <span>管理账号</span>
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="user" />
            <span>用户账号</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="4">
          <span slot="title"
            ><a-icon type="folder" /><span>商品管理</span></span
          >
          <a-menu-item key="5">
            <a-icon type="bars" />
            <span>分类添加/删除</span>
          </a-menu-item>
          <a-menu-item key="6">
            <a-icon type="gift" />
            <span>物品添加/删除</span>
          </a-menu-item>
          <a-menu-item key="7">
            <a-icon type="file-image" />
            <span>轮播图添加/删除</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="8">
          <span slot="title"
            ><a-icon type="profile" /><span>订单管理</span></span
          >
          <a-menu-item key="9">
            <a-icon type="form" />
            <span>状态/详情修改</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="header"
        style="background: #fff; padding: 0;text-align:left;"
      >
        <section>
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />

          <a-tabs :activeKey="key" @change="callback" class="tabs">
            <a-tab-pane key="1" tab="管理" />
            <a-tab-pane key="2" tab="用户" />
            <a-tab-pane key="3" tab="分类" />
            <a-tab-pane key="4" tab="物品" />
            <a-tab-pane key="5" tab="轮播" />
            <a-tab-pane key="6" tab="订单" />
          </a-tabs>
        </section>

        <div>
          <a-avatar
            shape="square"
            size="large"
            :style="{
              backgroundColor: '#f56a00',
              verticalAlign: 'middle',
              marginRight: '20px',
            }"
          >
            KTM
          </a-avatar>
          <a href="javascript:;" @click="logOut">退出</a>
        </div>
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
      key: "",
      keys: [],
      sub: [],
    };
  },
  methods: {
    callback(key) {
      this.key = key;
      if (key == "1") {
        this.$router.push("/managerAccount");
        this.keys = ["1"];
        this.sub = ["2"];
      } else if (key == "2") {
        this.keys = ["1"];
        this.sub = ["3"];
        this.$router.push("/account");
      } else if (key == "3") {
        this.keys = ["4"];
        this.sub = ["5"];
        this.$router.push("/sortModify");
      } else if (key == "4") {
        this.keys = ["4"];
        this.sub = ["6"];
        this.$router.push("/itemModify");
      } else if (key == "5") {
        this.keys = ["4"];
        this.sub = ["7"];
        this.$router.push("/bannerModify");
      } else if (key == "6") {
        this.keys = ["8"];
        this.sub = ["9"];
        this.$router.push("/orderModify");
      }
    },
    screenHeightChange() {
      let height = document.body.offsetHeight;
      this.screenHeight = { height: height + "px" };
    },
    navTo(key) {
      this.sub = [key.key];
      if (key.key == "2") {
        this.$router.push("/managerAccount");
        this.key = "1";
      } else if (key.key == "3") {
        this.$router.push("/account");
        this.key = "2";
      } else if (key.key == "5") {
        this.$router.push("/sortModify");
        this.key = "3";
      } else if (key.key == "6") {
        this.$router.push("/itemModify");
        this.key = "4";
      } else if (key.key == "7") {
        this.$router.push("/bannerModify");
        this.key = "5";
      } else if (key.key == "9") {
        this.$router.push("/orderModify");
        this.key = "6";
      }
    },
    logOut() {
      localStorage.setItem("token", "");
      this.$router.push("/");
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
  //   line-height: 64px;
  padding: 12px 24px;
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
/deep/.header {
  display: flex;
  // align-items: flex-end;
  justify-content: space-between;
  section {
    display: flex;
    align-items: flex-end;
    .tabs {
      align-self: flex-end;
      .ant-tabs-bar {
        margin: 0;
      }
    }
  }
  div {
    display: flex;
    align-items: center;
    a {
      line-height: 0;
      margin-right: 20px;
    }
  }
}
</style>
