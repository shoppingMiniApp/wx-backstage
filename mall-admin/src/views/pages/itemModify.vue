//* 物品修改
<template>
  <div>
    <div>
      <a-button class="editable-add-btn" @click="handleAdd"
        ><a-icon type="plus-circle" /> 添加商品
      </a-button>
      <a-modal
        :title="addAndEdit"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk('ruleForm', mode)"
        @cancel="handleCancel('ruleForm')"
        cancelText="取消"
        okText="保存"
        keyboard
        centered
        :width="1100"
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
              placeholder="请输入商品名称"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="商品价格" prop="goodPrice">
            <a-input
              v-model="ruleForm.goodPrice"
              type="text"
              placeholder="请输入商品价格"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="商品分类">
            <a-cascader
              :options="options"
              placeholder="请选择商品分类"
              @change="chooseClassic"
              :value="arr"
          /></a-form-model-item>
          <a-form-model-item has-feedback label="封面图片">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="http://api_devs.wanxikeji.cn/api/savePic"
              method="post"
              :header="{ 'Content-type': 'multipart/form-data' }"
              @change="handleChangeimg"
              :data="imgFile"
              :before-upload="beforeUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item has-feedback label="图片合集">
            <div class="clearfix">
              <a-upload
                action="http://api_devs.wanxikeji.cn/api/savePic"
                method="post"
                :header="{ 'Content-type': 'multipart/form-data' }"
                :data="imgFile"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="batchImg"
                :multiple="true"
              >
                <div v-if="fileList.length < 8">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="batchCancel"
              >
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-form-model-item>
          <!-- *富文本 -->
          <a-form-model-item has-feedback label="商品详情">
            <div class="edit_container">
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
              >
              </quill-editor>
            </div>
          </a-form-model-item>
          <!-- *spu -->
          <a-form-model
            ref="spuData"
            :model="spuData"
            v-bind="formItemLayoutWithOutLabel"
          >
            <a-form-model-item
              v-for="(domain, index) in spuData.domains"
              :key="domain.key"
              v-bind="index === 0 ? formItemLayout : {}"
              :label="index === 0 ? 'SPU增加与修改' : ''"
              :prop="'domains.' + index + '.value'"
              :rules="{
                required: true,
                message: '数据不能为空！',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="domain.key"
                placeholder="请输入标签名"
                style="width: 29.5%; margin-right: 8px"
              />
              <a-input
                v-model="domain.value"
                placeholder="请输入标签值"
                style="width: 29.5%; margin-right: 8px"
              />
              <a-icon
                v-if="spuData.domains.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="spuData.domains.length === 1"
                @click="removeDomain(domain)"
              />
            </a-form-model-item>
            <a-form-model-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="dashed" style="width: 60%" @click="addDomain">
                <a-icon type="plus" /> 新增SPU数据
              </a-button>
            </a-form-model-item>
          </a-form-model>
          <!-- *SKU----------------- -->
          <a-form-model
            ref="skuData"
            :model="skuData"
            v-bind="formItemLayoutWithOutLabel"
          >
            <a-form-model-item
              v-for="(domain, index) in skuData.domains"
              :key="index"
              v-bind="index === 0 ? formItemLayout : {}"
              :label="index === 0 ? 'SKU增加与修改' : ''"
              :prop="'domains.' + index + '.value'"
              :rules="{
                required: true,
                message: '数据不能为空！',
                trigger: 'blur',
              }"
            >
              <a-input
                v-model="domain.key"
                placeholder="请输入标签名"
                style="width: 29.5%; margin-right: 8px"
              />
              <a-input
                v-model="domain.value"
                placeholder="请输入标签值"
                style="width: 29.5%; margin-right: 8px"
              />
              <a-icon
                v-if="skuData.domains.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="skuData.domains.length === 1"
                @click="removeDomain2(domain)"
              />
            </a-form-model-item>
            <a-form-model-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="dashed" style="width: 60%" @click="addDomain2">
                <a-icon type="plus" /> 新增SKU数据
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-form-model>
      </a-modal>
      <a-table
        bordered
        :data-source="dataSource"
        :columns="columns"
        :pagination="{ pageSize: 7 }"
        :row-key="(dataSource) => dataSource.good_id"
      >
        <template slot="good_name" slot-scope="text">
          <span>{{ text }}</span>
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
            <a href="javascript:;"> 删除</a>
          </a-popconfirm>
          <a href="javascript:;" @click="onEdit(record)"> 编辑</a>
        </template>
      </a-table>
      <!-- *wwwwwwwwwwww -->
      <div class="spinning">
        <a-spin :spinning="spinning" />
      </div>
      <!-- ********* -->
    </div>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
const axios = require("axios");
// *单个封面上传
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
// *批量上传
function getbatchBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const key = "updatable";
export default {
  components: {
    quillEditor,
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
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      spuData: {
        domains: [],
      },
      skuData: {
        domains: [],
      },
      // *弹窗信息
      ruleForm: {
        goodName: "",
        goodPrice: "",
      },
      // *封面图片
      imageUrl: "",
      imgPic: "",
      // *图片合集
      imagesArr: [],
      // *分类id
      firstID: "",
      seconedID: "",
      mode: "",
      // *富文本
      fullHtml: "",
      content: `欢迎使用`,
      editorOption: {},
      previewVisible: false,
      arr: [1140, 1166],
      previewImage: "",
      fileList: [],
      options: [],
      // *接收新数组
      classicArr: [],
      rules: {
        goodName: [{ validator: validatePass, trigger: "change" }],
        goodPrice: [{ validator: validatePass2, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      selectedRowKeys: [], // Check here to configure the default column
      dataSource: [],
      count: 2,
      checked: true,
      loading: false,

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
      addAndEdit: "添加商品信息",
      spinning: false,
      editGood_id: "",
      editFile_List: [],
      types: [],
    };
  },
  mounted() {
    // *获取整个商品列表
    this.getGoodList();
    this.getClassic();
    console.log(this.options);
  },
  computed: {
    // *富文本
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  methods: {
    // *富文本框所有事件
    onEditorReady(editor) {
      // 准备编辑器
      console.log(editor);
    },
    onEditorBlur(e) {
      console.log(e.html, "失去焦点事件");
    }, // 失去焦点事件
    onEditorFocus(e) {
      console.log(e, "获得焦点事件");
    }, // 获得焦点事件
    onEditorChange(e) {
      console.log(e, "内容改变事件");
      this.fullHtml = e.html;
      console.log(this.fullHtml);
    }, // 内容改变事件

    // *分类选择
    chooseClassic(value, type_id) {
      console.log(value, type_id[0].good_type_id, type_id[1].good_type_id);
      this.firstID = type_id[0].good_type_id;
      this.seconedID = type_id[1].good_type_id;
      this.arr = value;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submit!");
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
        url: "api/admin/banGood",
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
        url: "api/admin/goodList",
        data: {
          token: localStorage.getItem("token"),
          page: "1",
          size: "1000",
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
          url: "api/admin/deleteGood",
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
      this.mode = "add";
      this.ruleForm = {
        goodName: "",
        goodPrice: "",
      };
      this.content = "";
      this.fileList = [];
      this.imageUrl = "";
      this.arr = [];
      this.addAndEdit = "添加商品信息";
      this.spuData.domains = [];
      this.skuData.domains = [];
      this.visible = true;
    },
    // *添加按键
    handleOk(formName, txt) {
      if (txt == "add") {
        let tmp = [];
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].response.code == 2000) {
            tmp.push(
              "http://api_devs.wanxikeji.cn/" + this.fileList[i].response.data
            );
          }
        }
        this.imagesArr = tmp;
        // 发送 POST 请求
        this.$axios({
          method: "POST",
          url: "api/admin/addModifyGood",
          data: {
            token: localStorage.getItem("token"),
            good_name: this.ruleForm.goodName,
            price: this.ruleForm.goodPrice,
            type_parent_id: this.firstID.toString(),
            type_id: this.seconedID.toString(),
            img: this.imgPic,
            imgs: JSON.stringify(this.imagesArr),
            info: this.fullHtml,
            colour: JSON.stringify(this.spuData.domains),
            edition: JSON.stringify(this.skuData.domains),
            // good_id: "1034",
          },
        }).then((res) => {
          console.log(res);
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
                // *获取整个商品列表
                this.getGoodList();
              }, 1000);
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        });
      } else if (txt == "edit") {
        // 发送 POST 请求
        console.log(this.fullHtml, "htlllll");
        this.$axios({
          method: "POST",
          url: "api/admin/addModifyGood",
          data: {
            token: localStorage.getItem("token"),
            good_name: this.ruleForm.goodName,
            price: this.ruleForm.goodPrice,
            type_parent_id: this.types[0].toString(),
            type_id: this.types[1].toString(),
            img: this.imageUrl,
            imgs: JSON.stringify(this.editFile_List),
            info: this.content,
            colour: JSON.stringify(this.spuData.domains),
            edition: JSON.stringify(this.skuData.domains),
            good_id: this.editGood_id,
          },
        }).then((res) => {
          if (res.data.code == 2000) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.confirmLoading = true;
                console.log(this.ruleForm.goodName, this.ruleForm.goodPrice);

                setTimeout(() => {
                  this.visible = false;
                  this.confirmLoading = false;
                  this.$message.success("编辑商品成功!", 2);
                  // *获取整个商品列表
                  this.getGoodList();
                }, 1000);
              } else {
                console.log("error submit!!");
                return false;
              }
            });
          } else {
            this.$message.error(res.data.msg, 1);
          }
          console.log(res);
        });
      } else {
        this.$message.error("操作有误！", 1);
      }
      console.log(this.imageUrl, formName);
      console.log(txt, "txttxttxt");
    },
    // *编辑
    onEdit(record) {
      console.log(record);
      this.addAndEdit = "编辑商品信息";

      this.$axios({
        method: "POST",
        url: "api/admin/goodInfo",
        data: {
          token: localStorage.getItem("token"),
          good_id: record.good_id,
        },
      }).then((res) => {
        console.log(res.data.data, "datas");
        this.editGood_id = res.data.data.good_id;
        this.ruleForm.goodName = res.data.data.good_name;
        this.ruleForm.goodPrice = res.data.data.price;
        this.arr = [res.data.data.type_parent_id, res.data.data.type_id];
        this.setClassicy();
        this.content = JSON.parse(res.data.data.info[0].info);
        console.log(JSON.parse(res.data.data.info[0].edition), "wwwwwww");
        let editList = JSON.parse(res.data.data.info[0].edition);
        let colour = JSON.parse(res.data.data.info[0].colour);

        console.log(typeof colour, "list");
        for (let key in colour) {
          console.log(colour[key], "2");
          this.spuData.domains.push({
            key: key,
            value: colour[key],
          });
        }

        // this.spuData = [{ ...editList }];
        for (let i = 0; i < editList.length; i++) {
          for (let j in editList[i]) {
            this.skuData.domains.push({
              key: j,
              value: editList[i][j],
            });
            // console.log(j + ":" + editList[i][j]);
          }
        }
        let list = JSON.parse(res.data.data.info[0].imgs);
        this.editFile_List = list;
        this.fileList = [];
        console.log(list);
        for (let i = 0; i < list.length; i++) {
          let tmp = {
            uid: "-" + i + 1,
            url: list[i],
            name: "img" + i,
            status: "done",
          };
          this.fileList.push(tmp);
        }
        this.imageUrl = res.data.data.img;
        console.log(JSON.parse(res.data.data.info[0].imgs), this.fileList);
        this.mode = "edit";
        this.visible = true;
      });
    },
    // *关闭添加弹窗
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
      this.$message.info({ content: "取消添加商品!", key, duration: 2 });
      this.spuData.domains = [];
      this.skuData.domains = [];
      // this.domains = {};
      // this.$el
    },
    // *封面上传
    handleChangeimg(info) {
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
        this.imgPic =
          "http://api_devs.wanxikeji.cn/" + info.fileList[0].response.data;
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("仅限于JPG格式图片！");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片必须小于2MB！");
      }
      return isJpgOrPng && isLt2M;
    },
    // *批量上传商品图片
    batchImg({ fileList }) {
      this.fileList = fileList;
    },
    batchCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      let forms = new FormData();
      forms.append("img", file.originFileObj);
      axios({
        method: "POST",
        url: "api/savePic",
        header: { "Content-Type": "multipart/form-data" },
        data: forms,
      }).then((res) => {
        let imgURL = res.config.baseURL + res.data.data;
        console.log(imgURL, "imgURL");
      });
      if (!file.url && !file.preview) {
        file.preview = await getbatchBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // *分类获取
    getClassic() {
      axios({
        method: "POST",
        url: "api/admin/goodsTypeList",
        data: { token: localStorage.getItem("token") },
      }).then((res) => {
        this.parentDeal(res.data.data, 0, this.options);
      });

      // this.options[0].shit = "hahahhah";
      // console.log(this.options);
    },
    parentDeal(data, pid, list) {
      data.forEach((item) => {
        if (item.parent_id === pid) {
          delete item.parent_id;
          item.value = item.type_name;
          item.label = item.type_name;
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
          item.value = item.type_name;
          item.label = item.type_name;
          itemData.children.push(item);
          this.childrenDeal(arr, item, item.good_type_id);
        }
      });
      if (itemData.children.length == 0) {
        delete itemData.children;
      }
    },
    // *spu
    removeDomain(item) {
      let index = this.spuData.domains.indexOf(item);
      if (index !== -1) {
        this.spuData.domains.splice(index, 1);
      }
    },
    addDomain() {
      console.log(this.spuData, "spu");
      this.spuData.domains.push({
        key: "",
        value: "",
      });
    },
    // *sku
    removeDomain2(item) {
      let index = this.skuData.domains.indexOf(item);
      if (index !== -1) {
        this.skuData.domains.splice(index, 1);
      }
    },
    addDomain2() {
      console.log(this.skuData, "sku");
      this.skuData.domains.push({
        key: "",
        value: "",
      });
    },
    // **
    imgFile(file) {
      return { img: file };
    },
    // *分类
    setClassicy() {
      this.types = this.arr;
      let tmp = [];
      for (let i = 0; i < this.options.length; i++) {
        for (let j = 0; j < this.arr.length; j++) {
          if (this.options[i].good_type_id == this.arr[j]) {
            tmp.push(this.options[i].value);
          }
          for (let k = 0; k < this.options[i].children.length; k++) {
            if (this.options[i].children[k].good_type_id == this.arr[j]) {
              tmp.push(this.options[i].children[k].value);
            }
          }
        }
      }
      this.arr = tmp;
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
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card {
  .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.spinning {
  width: 1400px;
  text-align: center;
  position: fixed;
  top: 300px;
}
</style>
