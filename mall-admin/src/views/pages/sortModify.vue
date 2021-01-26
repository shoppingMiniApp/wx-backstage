// 分类修改
<template>
  <div>
    <template>
      <div>
        <a-button type="primary" @click="handleAdd"> 添加分类 </a-button>
        <a-modal
          title="添加分类"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <a-input v-model="addClassName" placeholder="请填写分类名称" />
          <a-input
            v-model="addClassPid"
            placeholder="二级分类请填写父级id,若为一级分类此项目不填"
          />
        </a-modal>
      </div>
    </template>
    <template>
      <a-table
        :columns="columns"
        :data-source="newlist"
        :row-key="(newlist) => newlist.good_type_id"
        :loading="load"
        :pagination="{ pageSize: 8 }"
      >
        <template slot="action" slot-scope="text, record">
          <a-popconfirm
            v-if="newlist.length"
            title="你确定要删除吗?"
            @confirm="() => onDelete(record)"
          >
            <a href="javascript:;">Delete</a>
          </a-popconfirm>

          <div>
            <a href="javascript:;" @click="handleEdit(record)"> Edit </a>
            <a-modal
              title="修改分类"
              :visible="visibles"
              :confirm-loading="confirmLoadings"
              @ok="handleOks(record)"
              @cancel="handleCancels"
              :mask="false"
            >
              <a-input v-model="addClassName" placeholder="请输入新名称" />
            </a-modal>
          </div>
        </template>
      </a-table>
    </template>
  </div>
</template>
<script>
const axios = require("axios");
export default {
  data() {
    return {
      load: true,
      oldlist: [],
      newlist: [],
      visible: false,
      confirmLoading: false,
      visibles: false,
      confirmLoadings: false,
      addClassName: "",
      addClassPid: "",
      columns: [
        {
          title: "分类id",
          dataIndex: "good_type_id",
          key: "good_type_id",
        },
        {
          title: "Name",
          dataIndex: "type_name",
          key: "type_name",
          width: "30%",
        },
        {
          title: "Action",
          dataIndex: "",
          key: "x",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  methods: {
    parentDeal(data, pid, list) {
      data.forEach((item) => {
        if (item.parent_id === pid) {
          delete item.parent_id;
          list.push(item);
          this.childrenDeal(data, item, item.good_type_id);
        }
      });
    },
    childrenDeal(arr, itemData, itemId) {
      itemData.children = itemData.children ? itemData.children : [];
      arr.forEach((item) => {
        if (item.parent_id === itemId) {
          delete item.parent_id;
          itemData.children.push(item);
          this.childrenDeal(arr, item, item.good_type_id);
        }
      });
      if (itemData.children.length == 0) {
        delete itemData.children;
      }
    },
    onDelete(key) {
      const token = localStorage.getItem("token");
      let _this = this;
      let datas = {
        token,
        id: key.good_type_id,
      };
      axios({
        url: "http://api_devs.wanxikeji.cn/api/admin/deleteGoodtype",
        method: "post",
        data: datas,
      }).then(function(res) {
        if (res.data.code === 2000) {
          _this.newlist = [];
          _this.addClassList();
          _this.$message.success("删除成功");
        } else {
          _this.$message.error("操作失败");
        }
      });
    },
    //修改按钮
    handleEdit(key) {
      this.visibles = true;
      this.addClassName = key.type_name;
    },
    //修改确定按钮回调
    handleOks(key) {
      console.log(key);
      let _this = this;
      if (this.addClassName != "") {
        const token = localStorage.getItem("token");
        let datas = {
          token,
          name: this.addClassName,
          id: key.good_type_id,
        };
        this.confirmLoading = true;
        axios({
          url: "http://api_devs.wanxikeji.cn/api/admin/addGoodType",
          method: "post",
          data: datas,
        }).then(function(res) {
          console.log(res);
          if (res.data.code === 2000) {
            _this.newlist = [];
            _this.addClassList();
            _this.$message.success("操作成功");
            _this.visibles = false;
            _this.confirmLoadings = false;
          } else {
            _this.$message.error("操作失败");
            _this.visibles = false;
            _this.confirmLoadings = false;
          }
          _this.addClassName = "";
          _this.addClassPid = "";
        });
      } else {
        this.$message.error("请填写修改后的名称");
      }
    },
    //修改取消按钮回调
    handleCancels() {
      this.visibles = false;
      this.$message.error("操作已取消");
    },
    //添加按钮
    handleAdd() {
      this.visible = true;
    },
    //添加按钮确定回调
    handleOk() {
      let _this = this;
      if (this.addClassName != "") {
        const token = localStorage.getItem("token");
        let datas = {
          token,
          name: this.addClassName,
        };
        if (this.addClassPid != "") {
          datas.pid = this.addClassPid;
        }
        this.confirmLoading = true;
        axios({
          url: "http://api_devs.wanxikeji.cn/api/admin/addGoodType",
          method: "post",
          data: datas,
        }).then(function(res) {
          console.log(res);
          if (res.data.code === 2000) {
            _this.newlist = [];
            _this.addClassList();
            _this.$message.success("操作成功");
            _this.visible = false;
            _this.confirmLoading = false;
          } else {
            _this.$message.error("操作失败");
            _this.visible = false;
            _this.confirmLoading = false;
          }
          _this.addClassName = "";
          _this.addClassPid = "";
        });
      } else {
        this.$message.error("请填写分类名称,和父级ID");
      }
    },
    //添加按钮取消回调
    handleCancel() {
      this.visible = false;
      this.$message.error("操作已取消");
    },
    //请求页面数据
    addClassList() {
      const token = localStorage.getItem("token");
      let _this = this;
      axios({
        url: "http://api_devs.wanxikeji.cn/api/admin/goodsTypeList",
        method: "post",
        data: {
          token,
        },
      }).then(function(res) {
        _this.oldlist = res.data.data;
        _this.load = false;
        _this.parentDeal(_this.oldlist, 0, _this.newlist);
      });
    },
  },
  mounted() {
    this.addClassList();
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.ant-modal-body .ant-input + .ant-input {
  margin-top: 30px;
}
/deep/ .ant-modal {
  .ant-modal-content {
    box-shadow: none;
    border: 1px solid #dddddd;
  }
}
</style>
