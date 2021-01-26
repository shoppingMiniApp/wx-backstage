// 用户管理
<template>
  <div id="account">
    <a-table
      bordered
      :data-source="datas"
      :columns="columns"
      :row-key="(datas) => datas.user_id"
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
      <template slot-scope="record" slot="switch">
        <div>
          <a-switch
            :loading="loads"
            @click="onChange(record.user_id)"
            :checked="ban(record.status)"
          />
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="datas.length"
          title="要删除此用户嘛？"
          @confirm="() => onDelete(record.user_id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loads: false,
      load: true,
      datas: [],
      count: 2,
      columns: [
        {
          title: "ID",
          dataIndex: "user_id",
          // width: "40%",
          scopedSlots: { customRender: "ID" },
        },
        {
          title: "账号名称",
          dataIndex: "user_account",
          scopedSlots: { customRender: "user_account" },
        },
        // {
        //   title: "头像",
        //   dataIndex: "icon",
        //   scopedSlots: { customRender: "icon" },
        // },
        {
          title: "用户昵称",
          dataIndex: "nick_name",
          scopedSlots: { customRender: "nick_name" },
        },
        {
          title: "用户类型",
          dataIndex: "user_type",
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
          title: "禁用用户",
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
    async onChange(rec) {
      this.loads = true;
      let res = await this.$axios({
        method: "post",
        url: "api/admin/userAccountBan",
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
    //*请求数据
    async getData() {
      let res = await this.$axios({
        method: "post",
        url: "api/admin/userList",
        data: {
          token: this.token,
          page: "1",
          size: "100",
        },
      });
      if (res.data.code == 2000) {
        this.datas = res.data.data.data;
        this.load = false;
        console.log(this.datas);
      } else {
        this.$message.error("请求错误！", 1);
      }
    },
    //*表单事件
    onDelete(key) {
      const dataSource = [...this.datas];
      this.datas = dataSource.filter((item) => item.user_id !== key);
      this.$axios({
        method: "post",
        url: "api/admin/userAccountDelete",
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
}
</style>
