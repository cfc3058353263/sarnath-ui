<template>
    <div class="login">
        <div class="flex flex-1">
            <div class="flex-1"></div>
            <div class="flex-1 flex flex-align-center flex-v">
                    <el-image  :src="require('../assets/images/loginTitle.png')" fit="fill"></el-image>
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" maxlength="50">
                            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin" maxlength="50">
                            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                        </el-input>
                    </el-form-item>

                    <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
                    <el-form-item style="width:100%;">
                        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                            <span v-if="!loading">登 录</span>
                            <span v-else>登 录 中...</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2018-2021 sarnath.vip All Rights Reserved.</span>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { title } from "@/settings";

export default {
    name: "Login",
    data() {
        return {
            title: title,
            codeUrl: "",
            cookiePassword: "",
            loginForm: {
                username: undefined,
                password: undefined,
                rememberMe: false,
                code: "",
                uuid: "",
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "用户名不能为空",
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "密码不能为空",
                    },
                ],
                code: [
                    {
                        required: true,
                        trigger: "change",
                        message: "验证码不能为空",
                    },
                ],
            },
            loading: false,
            redirect: undefined,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                if (Object.getOwnPropertyNames(route.query).length === 1) {
                    this.redirect = route.query && route.query.redirect;
                } else {
                    this.redirect = route.query.redirect;
                    for (let key in route.query) {
                        if (key !== "redirect") {
                            this.redirect =
                                this.redirect +
                                "&" +
                                key +
                                "=" +
                                route.query[key];
                        }
                    }
                }
            },
            immediate: true,
        },
    },
    created() {
        this.getCookie();
    },
    methods: {
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get("rememberMe");
            this.loginForm = {
                username:
                    username === undefined ? this.loginForm.username : username,
                password:
                    password === undefined
                        ? this.loginForm.password
                        : decrypt(password),
                rememberMe:
                    rememberMe === undefined ? false : Boolean(rememberMe),
            };
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("username", this.loginForm.username, {
                            expires: 30,
                        });
                        Cookies.set(
                            "password",
                            encrypt(this.loginForm.password),
                            { expires: 30 }
                        );
                        Cookies.set("rememberMe", this.loginForm.rememberMe, {
                            expires: 30,
                        });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove("rememberMe");
                    }
                    this.$store
                        .dispatch("Login", this.loginForm)
                        .then(() => {
                            this.$router
                                .push({ path: this.redirect || "/" })
                                .catch(() => {});
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login.jpg");
    background-size: cover;
}
.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: none;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
        height: 38px;
        input {
            height: 38px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 38px;
}
::v-deep .el-input--medium .el-input__inner {
    font-weight: 600;
}
</style>
