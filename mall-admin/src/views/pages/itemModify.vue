//* 物品修改
<template>
  <div>
    <div>
      <a-button class="editable-add-btn" @click="handleAdd"
        ><a-icon type="plus-circle" /> 添加商品
      </a-button>
      <a-modal
        title="添加商品信息"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk('ruleForm')"
        @cancel="handleCancel('ruleForm')"
        cancelText="取消"
        okText="添加"
        keyboard
        centered
      >
        <a-form-model
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          v-bind="layout"
        >
          <a-form-model-item has-feedback label="商品名称" prop="goodName">
            <a-input
              v-model="ruleForm.goodName"
              type="text"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="商品价格" prop="goodPrice">
            <a-input
              v-model="ruleForm.goodPrice"
              type="text"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <!-- <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button @click="resetForm('ruleForm')"> 重置 </a-button>
            <a-button
              style="margin-left: 10px"
              type="primary"
              @click="submitForm('ruleForm')"
            >
              添加
            </a-button>
          </a-form-model-item> -->
        </a-form-model>
      </a-modal>
      <a-table
        bordered
        :data-source="dataSource"
        :columns="columns"
        :pagination="{ pageSize: 5 }"
        :row-key="(dataSource) => dataSource.good_id"
      >
        <template slot="good_name" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChange(record.key, 'good_name', $event)"
          />
        </template>
        <template slot="image" slot-scope="text, record">
          <img :src="record.img" alt="" class="good-img" />
        </template>
        <template slot="banGood" slot-scope="record">
          <a-switch
            @change="onChange(record)"
            :checked="changeChecked(record)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="dataSource.length"
            title="是否完全删除此商品?"
            @confirm="() => onDelete(record.good_id)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const key = "updatable";
import axios from "@/maxios/index.js"; /*引入封装的axios*/
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          <div>{{ value || ' ' }}</div>
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: false,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit("change", this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
export default {
  components: {
    EditableCell,
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入合理商品名！"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入合理的价格！"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        goodName: "",
        goodPrice: "",
      },
      rules: {
        goodName: [{ validator: validatePass, trigger: "change" }],
        goodPrice: [{ validator: validatePass2, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      data,
      selectedRowKeys: [], // Check here to configure the default column
      dataSource: [],
      count: 2,
      checked: true,
      loading: false,
      imageUrl: "",
      columns: [
        {
          title: "商品名",
          dataIndex: "good_name",
          width: "30%",
          scopedSlots: { customRender: "good_name" },
          align: "center",
        },
        {
          title: "ID",
          dataIndex: "good_id",
          align: "center",
        },
        {
          title: "image",
          dataIndex: "image",
          scopedSlots: { customRender: "image" },
          align: "center",
        },
        {
          title: "是否禁用",
          align: "center",
          scopedSlots: { customRender: "banGood" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center",
        },
      ],
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
    };
  },
  mounted() {
    // *获取整个商品列表
    this.getGoodList();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: "all-data",
            text: "Select All Data",
            onSelect: () => {
              this.selectedRowKeys = [...Array(46).keys()]; // 0...45
            },
          },
          {
            key: "odd",
            text: "Select Odd Row",
            onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return false;
                }
                return true;
              });
              this.selectedRowKeys = newSelectedRowKeys;
            },
          },
          {
            key: "even",
            text: "Select Even Row",
            onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (index % 2 !== 0) {
                  return true;
                }
                return false;
              });
              this.selectedRowKeys = newSelectedRowKeys;
            },
          },
        ],
        onSelection: this.onSelection,
      };
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // *禁用状态 开关状态
    changeChecked(re) {
      if (re.status == "1") {
        return false;
      } else {
        return true;
      }
    },
    // *switch 改变事件 禁用
    onChange(rec) {
      // 发送 后台POST 请求
      axios({
        method: "POST",
        url: "http://api_devs.wanxikeji.cn/api/admin/banGood",
        data: {
          token: localStorage.getItem("token"),
          good_id: rec.good_id,
        },
      }).then(() => {
        // *获取整个商品列表
        this.getGoodList();
      });
    },
    // *获取整个商品列表
    getGoodList() {
      // 发送 POST 请求
      axios({
        method: "POST",
        url: "http://api_devs.wanxikeji.cn/api/admin/goodList",
        data: {
          token: localStorage.getItem("token"),
          page: "1",
          size: "58",
        },
      }).then((res) => {
        this.dataSource = res.data.data.data;
      });
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    // *删除商品
    onDelete(good_id) {
      this.$message.loading({ content: "删除中...", key });

      setTimeout(() => {
        axios({
          method: "POST",
          url: "http://api_devs.wanxikeji.cn/api/admin/deleteGood",
          data: {
            token: localStorage.getItem("token"),
            good_id: good_id,
          },
        }).then(() => {
          // *获取整个商品列表
          this.getGoodList();
        });
        this.$message.success({ content: "删除成功!", key, duration: 2 });
      }, 1000);
    },
    // *添加商品按钮
    handleAdd() {
      // const { count, dataSource } = this;
      // const newData = {
      //   key: count,
      //   name: `Edward King ${count}`,
      //   age: 32,
      //   address: `London, Park Lane no. ${count}`,
      // };
      // this.dataSource = [...dataSource, newData];
      // this.count = count + 1;
      this.visible = true;
    },
    handleOk(formName) {
      console.log(this.imageUrl);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          console.log(this.ruleForm.goodName, this.ruleForm.goodPrice);
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
            this.$message.success({
              content: "添加商品成功!",
              key,
              duration: 2,
            });
          }, 1000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // *关闭添加弹窗
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
      this.$message.info({ content: "取消添加商品!", key, duration: 2 });
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style lang="less" scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
/deep/.editable-cell-input-wrapper {
  display: flex;
  .editable-cell-icon-check {
    padding-top: 8px;
    padding-left: 5px;
  }
}
.good-img {
  width: 50px;
  height: 50px;
}
/deep/.editable-cell-text-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 300px;
  }
}
</style>
