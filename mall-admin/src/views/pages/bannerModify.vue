// 轮播管理
<template>
  <div>
    <a-button @click="add()" type="primary" style="margin-bottom:20px"
      >添加轮播图</a-button
    >
    <a-table
      :loading="load"
      :columns="columns"
      bordered
      :data-source="dataList"
      :row-key="(dataList) => dataList.banner_id"
      :pagination="{ pageSize: 6 }"
    >
      <template slot="pic" slot-scope="text">
        <img :src="text" style="width:100px" />
      </template>
      <template slot="switch" slot-scope="record">
        <a-switch
          :loading="loads"
          @click="onChange(record.banner_id)"
          :checked="ban(record.status)"
        />
      </template>
      <template slot="operation" slot-scope="record">
        <a-popconfirm
          v-if="dataList.length"
          title="要删除此图片嘛？"
          @confirm="() => onDelete(record.banner_id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>

        <a href="javascript:;" style="padding-left:20px" @click="edit(record)"
          >编辑</a
        >
      </template>
    </a-table>
    <a-modal
      class="register"
      v-model="visibleAdd"
      title="添加新轮播图"
      @ok="addBanner"
    >
      <a-input
        size="default"
        v-model="title"
        placeholder="请输入标题"
        class="name"
      >
        <span slot="addonBefore">标题</span>
      </a-input>
      <div style="height:20px;width:100%"></div>
      <a-upload
        action="http://api_devs.wanxikeji.cn/api/savePic"
        method="post"
        :header="{ 'Content-type': 'multipart/form-data' }"
        @change="handleChange"
        :data="imgFile"
      >
        <a-button> <a-icon type="upload" /> Upload </a-button>
      </a-upload>
    </a-modal>
    <a-modal
      class="register"
      v-model="visibleEdit"
      title="编辑轮播图"
      @ok="editBanner"
    >
      <a-input
        size="default"
        v-model="editdData.title"
        placeholder="请输入要修改的标题"
        class="name"
      >
        <span slot="addonBefore">标题</span>
      </a-input>
      <div style="height:20px;width:100%"></div>

      <a-input
        size="default"
        v-model="editdData.sort"
        placeholder="请输入要修改的排序"
        class="name"
      >
        <span slot="addonBefore">排序</span>
      </a-input>
      <div style="height:20px;width:100%"></div>
      <a-input
        size="default"
        v-model="editdData.pic"
        placeholder="请输入要修改的banner地址（网络）"
        class="name"
        :disabled="true"
      >
        <span slot="addonBefore">banner</span>
      </a-input>
      <div style="height:20px;width:100%"></div>

      <a-input
        size="default"
        v-model="editdData.url"
        placeholder="请输入要修改的目标地址（网络）"
        class="name"
        :disabled="true"
      >
        <span slot="addonBefore">目标地址</span>
      </a-input>
    </a-modal>
  </div>
</template>
<script>
// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// }
export default {
  data() {
    return {
      editdData: {
        id: "",
        title: "",
        pic: "",
        url: "",
        sort: "",
      },
      loading: false,
      imageUrl: "",
      title: "",
      pic: "",
      visibleEdit: false,
      visibleAdd: false,
      load: true,
      loads: false,
      dataList: [],
      columns: [
        {
          title: "ID",
          dataIndex: "banner_id",
          // width: "40%",
          align: "center",

          scopedSlots: { customRender: "ID" },
        },
        {
          title: "轮播图标题",
          dataIndex: "title",
          width: "20%",
          align: "center",
        },
        {
          title: "略缩图",
          dataIndex: "pic",
          scopedSlots: { customRender: "pic" },
          align: "center",
          width: "20%",
        },
        {
          title: "创建时间",
          dataIndex: "create_time",
          scopedSlots: { customRender: "create_time" },
          align: "center",
          width: "10%",
        },
        {
          title: "创建时间",
          dataIndex: "update_time",
          scopedSlots: { customRender: "update_time" },
          align: "center",
          width: "10%",
        },
        {
          title: "禁用轮播图",
          scopedSlots: { customRender: "switch" },
          align: "center",
          width: "10%",
        },
        {
          title: "操作",
          // dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: "10%",
        },
      ],
      token: localStorage.getItem("token"),
      fileList: "",
    };
  },
  methods: {
    editBanner() {
      if (this.editdData.title != "" && this.editdData.sort != "") {
        this.$axios({
          url: "api/admin/bannerAddModify",
          method: "post",
          data: {
            id: this.editdData.id,
            token: this.token,
            title: this.editdData.title,
            pic: this.editdData.pic,
            url: this.editdData.url,
            sort: this.editdData.sort,
          },
        }).then((res) => {
          console.log(res, "eeeee");
          this.visibleEdit = false;
          this.$message.success("修改成功", 1);
          this.getData();
        });
      } else {
        this.$message.warning("请填写完整信息", 1);
      }
    },
    imgFile(file) {
      return { img: file };
    },
    handleChange(info) {
      let fileList = [...info.fileList];
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2);
      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;
      console.log(fileList);
      if (fileList[0].response) {
        this.imageUrl =
          "http://api_devs.wanxikeji.cn/" + fileList[0].response.data;
      }
      console.log(this.imageUrl, "wd");
    },
    add() {
      this.visibleAdd = true;
      console.log(this.imageUrl);
    },
    edit(key) {
      console.log(key, "w");
      this.editdData.id = key.banner_id;
      this.editdData.title = key.title;
      this.editdData.sort = key.sort;
      this.editdData.pic = key.pic;
      this.editdData.url = key.url;
      this.visibleEdit = true;
    },
    addBanner() {
      if (this.title != "") {
        this.$axios({
          url: "api/admin/bannerAddModify",
          method: "post",
          data: {
            token: this.token,
            title: this.title,
            pic: this.imageUrl,
            url: this.imageUrl,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 2000) {
            this.visibleAdd = false;
            this.$message.success("添加成功", 1);
            this.getData();
          }
        });
      } else {
        this.$message.warning("请上传图片或者填写标题");
      }
    },
    async getData() {
      let res = await this.$axios({
        method: "post",
        url: "api/admin/bannerList",
        data: {
          token: this.token,
          page: "1",
          size: "100",
        },
      });
      console.log(res.data.data.data);
      if (res.data.code == 2000) {
        this.dataList = res.data.data.data;
        this.load = false;
      } else {
        this.$message.error("请求错误！", 1);
      }
    },
    ban(status) {
      if (status == 1) {
        return false;
      } else {
        return true;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataList];
      this.dataList = dataSource.filter((item) => item.banner_id !== key);
      this.$axios({
        method: "post",
        url: "api/admin/bannerDelete",
        data: {
          token: this.token,
          id: key,
        },
      }).then((res) => {
        if (res.data.code == 2000) {
          this.$message.success("已删除！", 1);
          this.load = false;
          this.getData();
        }
      });
    },
    async onChange(rec) {
      this.loads = true;
      let res = await this.$axios({
        method: "post",
        url: "api/admin/bannerBan",
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
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scoped></style>
