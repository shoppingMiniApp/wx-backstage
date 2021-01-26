// 管理账号管理
<template>
  <div id="account">
    <a-button type="primary" @click="showModal" style="margin-bottom:20px"
      >添加新用户</a-button
    >
    <a-modal
      class="register"
      v-model="visible"
      title="添加新用户"
      @ok="register"
    >
      <a-input
        size="default"
        v-model="name"
        placeholder="请输入要注册用户名"
        class="name"
      >
        <span slot="addonBefore">用户名</span>
        <a-icon slot="suffix" type="user" />
      </a-input>
      <div></div>
      <a-input-password
        size="default"
        v-model="password"
        placeholder="请输入要注册密码"
        class="password"
      >
        <span slot="addonBefore">密码：</span>
      </a-input-password>
    </a-modal>

    <a-table
      bordered
      :data-source="dataList"
      :columns="columns"
      :row-key="(dataList) => dataList.admin_id"
      :loading="load"
    >
      <template slot="user_account" slot-scope="text">
        <div v-if="text == null" style="color:#999;">-此用户无名称-</div>
        <div v-else>{{ text }}</div>
      </template>
      <template slot="nick_name" slot-scope="text">
        <div v-if="text == null" style="color:#999;">-此用户无昵称-</div>
        <div v-else>{{ text }}</div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataList.length"
          title="要删除此用户嘛？"
          @confirm="() => onDelete(record.admin_id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
      <template slot-scope="record" slot="switch">
        <div>
          <a-switch
            :loading="loads"
            @click="onChange(record.admin_id)"
            :checked="ban(record.status)"
          />
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      loads: false,
      name: "",
      password: "",
      visible: false,
      check: false,
      load: true,
      dataList: [],
      count: 2,
      columns: [
        {
          title: "ID",
          dataIndex: "admin_id",
          // width: "40%",
          scopedSlots: { customRender: "admin_id" },
        },
        {
          title: "管理员名称",
          dataIndex: "admin_name",
          scopedSlots: { customRender: "admin_name" },
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
        },
        {
          title: "上次登录",
          dataIndex: "last_login_time",
        },
        {
          title: "禁用开关",
          scopedSlots: { customRender: "switch" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    ban(status) {
      if (status == 1) {
        return false;
      } else {
        return true;
      }
    },
    register() {
      this.$axios({
        method: "post",
        url: "api/admin/register",
        data: {
          token: this.token,
          name: this.name,
          pw: this.password,
        },
      }).then((res) => {
        if (res.data.code == 2000) {
          console.log(res);
          this.$message.success("注册成功！1秒后关闭", 1);
          setTimeout(() => {
            this.visible = false;
            this.load = true;
            this.getData();
          }, 1200);
        } else {
          this.$message.error("用户已存在", 5);
        }
      });
    },
    //*请求数据
    showModal() {
      this.visible = true;
      this.name = "";
      this.password = "";
    },
    async getData() {
      let res = await this.$axios({
        method: "post",
        url: "api/admin/accountList",
        data: {
          token: this.token,
          page: "1",
          size: "50",
        },
      });

      if (res.data.code == 2000) {
        this.load = false;
        this.dataList = res.data.data.data;
        // console.log(this.dataList);
      }
    },
    async onChange(rec) {
      this.loads = true;
      let res = await this.$axios({
        method: "post",
        url: "api/admin/accountBan",
        data: {
          token: this.token,
          id: rec.toString(),
        },
      });
      console.log(res);
      if (res.data.code == 2000) {
        this.getData();
        this.loads = false;
        this.$message.success("操作成功", 1);
      } else {
        this.$message.error("操作有误", 1);
      }
    },
    //*表单事件
    onDelete(key) {
      const dataSource = [...this.dataList];
      this.dataList = dataSource.filter((item) => item.admin_id !== key);
      this.$axios({
        method: "post",
        url: "api/admin/accountDelete",
        data: {
          token: this.token,
          id: key,
        },
      }).then((res) => {
        if (res.data.code == 2000) {
          this.$message.success("已删除！", 1);
          this.load = true;
          this.getData();
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scoped>
#account {
  // padding: 20px 0;
  .editable-cell {
    position: relative;
  }
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }
  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }
  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }
  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }
  .editable-cell-icon-check {
    line-height: 28px;
  }
  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }
  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }
  .editable-add-btn {
    margin-bottom: 8px;
  }
  /deep/ .editable-cell-input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      width: 400px;
    }
    .editable-cell-icon-check {
      padding: 0 20px;
    }
  }
  /deep/.editable-cell-text-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    .editable-cell-icon {
      padding: 0 20px;
    }
  }
  // a-modal{

  // }
}
.register {
  div {
    height: 20px;
    width: 100%;
  }
}
</style>
