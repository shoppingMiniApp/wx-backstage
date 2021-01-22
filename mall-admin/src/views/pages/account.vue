// 用户管理
<template>
  <div id="account">
    <a-button @click="getData">接口</a-button>
    <!-- <a-button class="editable-add-btn" @click="handleAdd">
      Add
    </a-button> -->
    <a-table
      bordered
      :data-source="datas"
      :columns="columns"
      :row-key="(datas) => datas.user_id"
    >
      <template slot="user_account" slot-scope="text">
        <div v-if="text == null" style="color:#999;">-此用户无名称-</div>
        <div v-else>{{ text }}</div>
      </template>
      <template slot="nick_name" slot-scope="text">
        <div v-if="text == null" style="color:#999;">-此用户无昵称-</div>
        <div v-else>{{ text }}</div>
      </template>
      <!-- <template slot="name" slot-scope="text"> -->
      <!-- <editable-cell
          :text="text"
          @change="onCellChange(record.key, 'name', $event)"
        /> -->
      <!-- <a>{{ text }}</a>
      </template> -->
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
const axios = require("axios");

// const EditableCell = {
//   template: `
//       <div class="editable-cell">
//         <div v-if="editable" class="editable-cell-input-wrapper">
//           <a-input :value="value" @change="handleChange" @pressEnter="check" />
//           <a-icon type="check" class="editable-cell-icon-check" @click="check" />
//         </div>
//         <div v-else class="editable-cell-text-wrapper">
//           {{ value || ' ' }}
//           <a-icon type="edit" class="editable-cell-icon" @click="edit" />
//         </div>
//       </div>
//     `,
//   props: {
//     text: String,
//   },
//   data() {
//     return {
//       value: this.text,
//       editable: false,
//     };
//   },
//   methods: {
//     handleChange(e) {
//       const value = e.target.value;
//       this.value = value;
//     },
//     check() {
//       this.editable = false;
//       this.$emit("change", this.value);
//     },
//     edit() {
//       this.editable = true;
//     },
//   },
// };

export default {
  components: {
    // EditableCell,
  },
  data() {
    return {
      datas: [
        {
          create_time: 1611223930,
          credit: 0,
          email: null,
          icon:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL7jibAwkM5czGjOXe61iaDVpCW6qAsBM3uAe53HXrtldgdPyfLBWwevfJeFrV7Mjicjv2kicwicmGl6og/132",
          insert: null,
          last_login_time: 1611223930,
          nick_name: "Eʟɪᴀᴜᴋ.",
          openid: "undefined",
          phone: null,
          pw: null,
          qq: 0,
          real_name: null,
          sex: 3,
          status: 1,
          token: "dd39ab1c553b36e8affc1392dabbe21a",
          user_account: null,
          user_id: 357,
          user_type: 1,
        },
        {
          create_time: 1611194351,
          credit: 0,
          email: null,
          icon: null,
          insert: null,
          last_login_time: 1611194351,
          nick_name: null,
          openid: null,
          phone: null,
          pw: "1",
          qq: 0,
          real_name: null,
          sex: 3,
          status: 1,
          token: "e30c3d1ded3f2d38be58cf4052d5a6ba",
          user_account: "拾柒",
          user_id: 356,
          user_type: 1,
        },
      ],
      // dataSource: [
      //   {
      //     key: "0",
      //     name: "Edward King 0",
      //     age: "32",
      //     address: "London, Park Lane no. 0",
      //   },
      //   {
      //     key: "1",
      //     name: "Edward King 1",
      //     age: "32",
      //     address: "London, Park Lane no. 1",
      //   },
      // ],
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
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      token: String,
    };
  },
  methods: {
    //*请求数据
    getData() {
      var _this = this;
      axios({
        method: "post",
        url: "http://api_devs.wanxikeji.cn/api/admin/userList",
        data: {
          token: _this.token,
        },
      })
        .then(function(res) {
          console.log(res.data.data.data, "list");
          _this.datas = res.data.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
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
    var _this = this;
    axios({
      method: "post",
      url: "http://api_devs.wanxikeji.cn/api/admin/login",
      data: {
        name: "a",
        pw: "a",
      },
    })
      .then(function(res) {
        console.log(res.data.data.token, "login");
        _this.token = res.data.data.token;
      })
      .catch(function(error) {
        console.log(error);
      });
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
