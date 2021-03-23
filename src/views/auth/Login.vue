<template>
    <div>
        <el-card>
            <h3 style="text-align: center">Wellcome back</h3>
            <el-form :model="ruleLogin" :rules="rules" ref="ruleLogin">
                <el-form-item prop="email">
                    <el-input
                        placeholder="Email"
                        v-model="ruleLogin.email">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="Password"
                        v-model="ruleLogin.password">
                    </el-input>
                </el-form-item>
                <div class="link">
                    <el-link type="primary">
                        <router-link :to="{ path: '/forgot-password' }" class="router-link">
                            Forgot Password ?
                        </router-link>
                    </el-link>
                </div>
                <el-button type="primary" @click="handleLogin('ruleLogin')">LOGIN</el-button>
            </el-form>
            <div class="link-register">
                <el-link type="primary">
                    <router-link :to="{ path: '/register' }" class="router-link">
                        Don't have an account? Register
                    </router-link>
                </el-link>
            </div>
        </el-card>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import api from '@/api'
import _ from 'lodash'
  
export default {
name: "Login",
data () {
    return {
        ruleLogin: {
            email: '',
            password: '',
        },
        rules: {
            email: [
                { required: true, message: 'This field is required', trigger: 'blur' },
                { type: 'email', message: 'Please input correct email address', trigger: ['blur'] },
            ],
            password: [
                { required: true, message: 'This field is required', trigger: 'change' },
            ],
        },
    }
},
computed: {
    ...mapState('auth', ['isAuthenticated'])
},
methods: {
    ...mapMutations('auth', [
        'updateLoginStatus',
        'updateAccessToken'
    ]),
    handleLogin (formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                let data = {
                    email: this.ruleLogin.email,
                    password: this.ruleLogin.password,
                }
                api.login(data).then((response) => {
                    this.updateAccessToken(_.get(response, 'data.access_token'))
                    this.updateLoginStatus({isAuthenticated: true})
                    if (this.$router.currentRoute.name !== 'Home') {
                        this.$router.push({ name: 'Home' })
                    }
                    this.ruleLogin.email = ''
                    this.ruleLogin.password = ''
                }).catch(() => {
                    this.$message({
                        message: 'Email or password is invalid',
                        type: 'error'
                    });
                })
            } else {
                return false;
            }
        })
    }
},
}
</script>

<style lang="scss">
.el-card {
    background: transparent;
    border: none;
    h3 {
        color: #fff;
    }
    .el-button {
        width: 100%;
        background: #6e85d3;
        padding: 20px 12px;
    }
    .link {
        text-align: right;
        margin-bottom: 10px;
        .router-link {
            color: #fff;
            text-decoration: none;
            &:hover {
                color: #409eff;
            }
        }
    }
    .link-register {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
        .router-link {
            color: #fff;
            text-decoration: none;
            &:hover {
                color: #409eff;
            }
        }
    }
}
</style>