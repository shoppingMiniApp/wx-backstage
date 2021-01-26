// 订单管理
<template>
  <div class="box">
    <!-- 订单列表 -->
    <div ref="table">
      <a-table
        :columns="columns"
        :data-source="listdata"
        size="small"
        bordered
        rowKey="orderId"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="action" slot-scope="text, record">
          <a @click="Delete(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="Edit(record)">编辑</a>
        </span>
      </a-table>
    </div>
    <div>
      <div id="components-modal-demo-position">
        <span class="hide"
          ><a-button type="primary" @click="show()"></a-button
        ></span>
        <a-modal
          v-model="modal2Visible"
          title="修改订单状态"
          centered
          @ok="gett()"
        >
          <p v-for="(value, key, index) of rowdata" :key="index">
            <span>{{ key }}</span
            ><br />
            <input type="text" :value="value" ref="index" />
          </p>
        </a-modal>
      </div>
    </div>
  </div>
</template>
<script>
const axios = require("axios");

export default {
  data() {
    return {
      listdata: [],
      columns: [
        {
          title: "订单号",
          dataIndex: "orderId",
          key: "orderId",
          scopedSlots: { customRender: "name" },
          width: 80,
          sorter: (rowA, rowB) => rowA.orderId - rowB.orderId,
        },
        {
          title: "用户id",
          dataIndex: "userId",
          key: "userId",
          width: 80,
          sorter: (rowA, rowB) => rowA.userId - rowB.userId,
        },
        {
          title: "用户名",
          dataIndex: "nickName",
          key: "nickName",
          ellipsis: true,
          align: "center",
        },
        {
          title: "商品名",
          dataIndex: "goodName",
          key: "goodName",
          ellipsis: true,
        },
        {
          title: "单价",
          dataIndex: "price",
          key: "price",
          width: 80,
          sorter: (rowA, rowB) => rowA.price - rowB.price,
        },
        {
          title: "数量",
          dataIndex: "num",
          key: "num",
          width: 80,
          align: "center",
          sorter: (rowA, rowB) => rowA.num - rowB.num,
        },
        {
          title: "付款",
          dataIndex: "money",
          key: "money",
          width: 80,
          sorter: (rowA, rowB) => rowA.money - rowB.money,
        },
        {
          title: "创建时间",
          dataIndex: "create",
          key: "creat",
          ellipsis: true,
          sorter: (rowA, rowB) => {
            function change(row) {
              let str = row.create.split(""); //将字符串拆分单个字符，并放进数组
              let str2 = str.join(); //将单个字符的数组拼接为字符串
              let str3 = str2.replace(/,/g, ""); //正则全局去掉逗号(,)
              let str4 = str3.replace(/\s/g, ""); //正则全局去掉空格( )
              let str5 = str4.replace(/:/g, ""); //正则全局去掉冒号(:)
              let str6 = str5.replace(/-/g, ""); //正则全局去掉短横线(-)
              return str6;
            }
            return change(rowA) - change(rowB);
          },
        },
        {
          title: "更新时间",
          dataIndex: "update",
          key: "update",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          ellipsis: true,
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      modal2Visible: false,
      rowdata: {},
      num: "",
    };
  },
  methods: {
    list() {
      let token = localStorage.getItem("token");
      axios({
        methods: "post",
        url: "http://api_devs.wanxikeji.cn/api/admin/OrderList",
        params: {
          token,
        },
      }).then((res) => {
        this.listdata = [];
        res.data.data.data.forEach((item) => {
          let json = {};
          json.orderId = item.order_id;
          json.userId = item.user_id;
          json.nickName = item.nick_name;
          json.money = item.money;
          json.create = this.time(item.create_time);
          json.update = this.time(item.update_time);
          json.goodName = item.childern[0].good_name;
          json.num = item.childern[0].num;
          json.price = item.childern[0].price;
          json.status = this.status(item.status);
          this.listdata.push(json);
        });
      });
    },
    status(str) {
      if (str == 2) {
        str = "完成支付";
      }
      if (str == 3) {
        str = "确认订单";
      }
      if (str == 4) {
        str = "已发货";
      }
      if (str == 5) {
        str = "已收货";
      }
      if (str == 6) {
        str = "退款";
      }
      if (str == 7) {
        str = "取消";
      }
      return str;
    },
    time(tt) {
      let date = new Date(parseInt(tt) * 1000);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      let dates =
        y + "-" + m + "-" + d + " " + "　" + h + ":" + minute + ":" + second;
      return dates;
    },
    Delete(row) {
      this.listdata.forEach((item, index) => {
        if (item.orderId == row.orderId) {
          this.listdata.splice(index, 1);
        }
      });
    },
    Edit(row) {
      this.rowdata = row;
      let that = this;
      this.listdata.forEach((item, index) => {
        if (item.orderId == row.orderId) {
          that.num = index;
        }
      });
      this.modal2Visible = true;
    },
    gett() {
      let token = localStorage.getItem("token");
      let order_id = this.$refs.index[0].value;
      let status = this.$refs.index[9].value;
      axios({
        url: "http://api_devs.wanxikeji.cn/api/admin/OrderStatusChange",
        methods: "post",
        params: {
          token,
          order_id,
          status,
        },
      }).then((res) => {
        if (res.data.msg == "操作完成") {
          this.list();
        } 
      });
      this.modal2Visible = false;
    },
  },
  mounted() {
    this.list();
  },
};
</script>
<style lang="less" scoped>
input {
  width: 100%;
  outline-style: none;
  border: 1px solid #999;
  height: 30px;
  line-height: 30px;
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
.hide {
  position: absolute;
  left: -1000px;
}
</style>
