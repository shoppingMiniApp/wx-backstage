<template>
  <div class="box">
    <div class="img">
      <img src="@/assets/loginBackground.jpg" alt="" />
    </div>
     <div class="login">
      <h1>Mall后台管理</h1>
      <p>
        <span><a-icon type="user" /></span>
        <input
          type="text"
          placeholder="请输入您的账号"
          ref="name"
          @focus="focus()"
          v-model="inputName"
        />
        <b ref="noname">name不能为空</b>
      </p>
      <p>
        <span><a-icon type="key" /></span>
        <a href="javascript:;" ref="open" v-if="show" @click="eyes()"
          ><a-icon type="eye"
        /></a>
        <a href="javascript:;" ref="close" v-else @click="eyes()"
          ><a-icon type="eye-invisible"
        /></a>
        <input
          type="password"
          placeholder="请输入您的密码"
          ref="password"
          @focus="focus()"
          v-model="inputPw"
        />
        <b ref="nopassword">nama不能为空</b>
      </p>
      <button @click="login()" ref="resever2">{{retext2}}</button>
      <a href="#" ref="resever1" @click="resever()">{{retext1}}</a>
    </div>
    <div class="message" ref="success">注册成功</div> -->
    
  </div>
</template>
<script>
const axios = require("axios");
export default {
  data() {
    return {
      show: false,
      token: "",
      inputName: "",
      inputPw: "",
      retext1: "注册",
      retext2: "登录",

    };
  },
  methods: {
    
    connect() {
      this.$axios({
        url: "api/admin/login",
        method: "post",
        data: {
          name: this.name,
          pw: this.password,
        },
        withCredentials: false,
      }).then((res) => {
        console.log(res);
        if (res.data.msg == "") {
          localStorage.setItem("token", res.data.data.token);
          this.$router.push("/main");
        }
      });
    },
    focus() {
      this.$refs.noname.style.display = "none";
      this.$refs.nopassword.style.display = "none";
    },
    eyes() {
      if (this.show) {
        this.$refs.password.type = "password";
        this.show = false;
      } else {
        this.$refs.password.type = "text";
        this.show = true;
      }
    },
    login() {
      if (this.inputName !== "") {
        if (this.inputPw !== "") {
          if (this.retext2 == "登录") {
            this.portLogin(this.inputName, this.inputPw);
          } else {
            this.portRegistered(this.inputName, this.inputPw);
          }
        } else {
          this.$refs.nopassword.innerHTML = "密码不能为空";
          this.$refs.nopassword.style.display = "block";
        }
      } else {
        this.$refs.noname.innerHTML = "账号不能为空";
        this.$refs.noname.style.display = "block";
      }
    },
    resever() {
      this.focus();
      this.inputName = "";
      this.inputPw = "";
      if (this.retext1 == "注册") {
        this.retext1 = "登录";
        this.retext2 = "注册";
      } else {
        this.retext1 = "注册";
        this.retext2 = "登录";
      }
    },
    portLogin(name, pw) {
      axios({
        methods: "post",
        url: "api/admin/login",
        params: {
          name,
          pw,
        },
      })
        .then((result) => {
          if (result.data.data.length == 0) {
            this.$refs.nopassword.style.display = "block";
            this.$refs.nopassword.innerHTML = result.data.msg;
          } else {
            localStorage.setItem("token", result.data.data.token);
            this.$router.push("/main");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    portRegistered(name, pw) {
      axios({
        methods: "post",
        url: "api/admin/login",
        params: {
          name: "1",
          pw: "1",
        },
      }).then((result) => {
        this.token = result.data.data.token;
        axios({
          methods: "post",
          url: "api/admin/register",
          params: {
            name,
            pw,
            token: this.token,
          },
        }).then((result) => {
          if (result.data.data.length == "0") {
            this.$refs.success.innerHTML = result.data.msg;
            this.$refs.success.style.display = "block";
            setTimeout(() => {
              this.$refs.success.style.display = "none";
            }, 1000);
          } else {
            this.$refs.success.innerHTML = "注册成功";
            this.$refs.success.style.display = "block";
            setTimeout(() => {
              this.$refs.success.style.display = "none";
            }, 1000);
            this.resever();
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
div,
img,
p,
span,
a,
button,
input {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login {
  width: 400px;
  height: 400px;
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  background-color: #fff;
  h1 {
    text-align: center;
    margin-bottom: 40px;
  }
  p {
    height: 40px;
    margin-bottom: 30px;
    position: relative;
    span {
      display: inline-block;
      width: 60px;
      position: absolute;
      top: 5px;
      left: 12px;
      font-size: 20px;
    }
    a {
      text-decoration: none;
      position: absolute;
      right: 10px;
      top: 8px;
      font-size: 16px;
      color: #999;
    }
    input {
      outline-style: none;
      border: none;
      height: 40px;
      background-color: rgb(255, 255, 255);
      padding: 0 40px;
      border-radius: 4px;
      width: 100%;
      border: 1px solid #999;
    }
    b {
      display: none;
      font-weight: normal;
      color: #f00;
      margin: 2px 0 12px 20px;
      font-size: 16px;
    }
  }
  button {
    width: 100%;
    height: 40px;
    background: #1c84c6;
    line-height: 40px;
    border-radius: 6px;
    margin-top: 20px;
    color: #fff;
    font-size: 18px;
    outline-style: none;
    border: none;
  }
  a {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
}

.img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  z-index: -1;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.message {
  display: none;
  width: 140px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  line-height: 140px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
}

</style>
