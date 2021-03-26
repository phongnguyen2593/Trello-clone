<template>
    <div>
        <el-card>
            <h3 style="text-align: center">Create an account</h3>
            <el-form :model="ruleRegister" :rules="rules" ref="ruleRegister">
                <el-form-item prop="name">
                    <el-input
                        placeholder="Name"
                        v-model="ruleRegister.name"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input
                        placeholder="Email"
                        v-model="ruleRegister.email"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="Password"
                        v-model="ruleRegister.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input
                        type="password"
                        placeholder="Confirm password"
                        v-model="ruleRegister.confirmPassword"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleRegister('ruleRegister')">
                    REGISTER
                </el-button>
            </el-form>
            <div class="link">
                <el-link >
                    <router-link :to="{ name: 'Login' }" class="router-link">
                        Already have an account? Log In
                    </router-link>
                </el-link>
            </div>
        </el-card>
    </div>
</template>

<script>
import api from '@/api'
import {mapState} from 'vuex'

export default {
    name: "Register",
    data() {
        let confirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('This field is required'));
            } else if (value !== this.ruleRegister.password) {
                callback(new Error('Password must match'));
            } else {
                callback();
            }
        };
        return {
            ruleRegister: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            rules: {
                name: [
                    { required: true, message: 'This field is required', trigger: ['blur'] },
                    { min: 6, message: 'Length should be more than 5', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                    { type: 'email', message: 'Please input correct email address', trigger: ['blur'] },
                ],
                password: [
                    { required: true, message: 'This field is required', trigger: ['blur', 'change'] },
                ],
                confirmPassword: [
                    { validator: confirm, trigger: ['blur', 'change'] },
                ],
            },
        }
    },
    methods: {
        handleRegister(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        name: this.ruleRegister.name,
                        email: this.ruleRegister.email,
                        password: this.ruleRegister.password,
                    }
                    api.register(data).then(() => {
                        this.name='',
                        this.email='',
                        this.password='',
                        this.$message({
                            message: 'Register successfully !',
                            type: 'success'
                        }),
                        this.$router.push({ name: 'Login' })
                    }).catch(() => {
                        this.$message({
                            message: 'Register failure !',
                            type: 'error'
                        });
                    })
                }
            });
        }
    },
    computed: {
        ...mapState('login', ['isAuthenticated']),
    },
}
</script>

<style lang="scss" scoped>
.el-card {
    background: transparent;
    border: none;
    h3 {
        color: #fff;
    }
    .link {
        text-align: center;
        margin-top: 20px;
        .el-link {
            .router-link {
                color: #fff;
                text-decoration: none;
                &:hover {
                    color: #409eff;
                }
            }
        }
    }
    .el-button {
        width: 100%;
        background: #6e85d3;
        padding: 20px 12px;
    }
}
</style>
