// 管理账号管理
<template>
  <div id="account">
    <a-button @click="getData">接口</a-button>
    <!-- <a-button class="editable-add-btn" @click="handleAdd">
      Add
    </a-button> -->
    <a-table
      bordered
      :data-source="dataList"
      :columns="columns"
      :row-key="(dataList) => dataList.admin_id"
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
          @confirm="() => onDelete(record.user_id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
      <template slot-scope="index, record" slot="switch">
        <div>
          <a-switch
            @click.native="onChange(check, $event, record, index)"
            :checked="check"
            :index="record.admin_id"
          />
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
const axios = require("axios");

export default {
  components: {
    // EditableCell,
  },
  data() {
    return {
      te: true,
      check: false,
      dataList: [
        {
          admin_id: 407,
          admin_name: "955",
          create_time: 1611302917,
          last_login_time: 1611302924,
          pw: "955",
          status: 1,
          token: "b114feb7295cec3df03dff8e2a4e5f67",
        },
        {
          admin_id: 406,
          admin_name: "9",
          create_time: 1611302508,
          last_login_time: 1611303402,
          pw: "9",
          status: 1,
          token: "d7d60fe7d1cc955571cf3f0fb6c11d0a",
        },
      ],
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
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
        {
          title: "禁用开关",
          scopedSlots: { customRender: "switch" },
        },
      ],
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    //*请求数据
    getData() {
      var _this = this;
      axios({
        method: "post",
        url: "http://api_devs.wanxikeji.cn/api/admin/accountList",
        data: {
          token: _this.token,
          page: "1",
          size: "391",
        },
      })
        .then(function(res) {
          console.log(res.data.data, "list");
          _this.dataList = res.data.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onChange(checked, event, record, index) {
      console.log(checked, event, record, index);
      console.log(event.currentTarget.getAttribute("index"), "e");

      //   console.log(checked);
      //   console.log(record);
      //   var _this = this;
      //   axios({
      //     method: "post",
      //     url: "http://api_devs.wanxikeji.cn/api/admin/accountBan",
      //     data: {
      //       token: _this.token,
      //       id: record.admin_id,
      //     },
      //   })
      //     .then(function(res) {
      //       console.log(res, "ban");
      //     })
      //     .catch(function(err) {
      //       console.log(err);
      //     });
    },
    //*表单事件
    // onCellChange(key, dataIndex, value) {
    //   const dataSource = [...this.datas];
    //   const target = dataSource.find((item) => item.key === key);
    //   if (target) {
    //     target[dataIndex] = value;
    //     this.dataSource = dataSource;
    //   }
    // },
    onDelete(key) {
      const dataSource = [...this.datas];
      this.datas = dataSource.filter((item) => item.user_id !== key);
      console.log(key, "k");
    },
    // handleAdd() {
    //   const { count, dataSource } = this;
    //   const newData = {
    //     key: count,
    //     name: `Edward King ${count}`,
    //     age: 32,
    //     address: `London, Park Lane no. ${count}`,
    //   };
    //   this.dataSource = [...dataSource, newData];
    //   this.count = count + 1;
    // },
  },
  mounted() {
    // this.getData();
    // var _this = this;
    // axios({
    //   method: "post",
    //   url: "http://api_devs.wanxikeji.cn/api/admin/login",
    //   data: {
    //     name: "a",
    //     pw: "a",
    //   },
    // })
    //   .then(function(res) {
    //     console.log(res.data.data.token, "login");
    //     _this.token = res.data.data.token;
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
    // this.token = localStorage.getItem("token")
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
