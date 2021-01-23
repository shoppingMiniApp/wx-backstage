// 分类修改
<template>
  <div>分类修改</div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.myaxios({
      url: "api/admin/goodsTypeList",
      method: "post",
    });
  },
  methods: {},
};
</script>
<style lang="less" scoped></style>
