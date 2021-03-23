<template>
    <div>
        <el-card>
            <h3 style="text-align: center">Forgot password</h3>
            <p>We'll send a recovery link to</p>
            <el-form :model="ruleForgotPassword" :rules="rules" ref="ruleForgotPassword">
                <el-form-item prop="email">
                    <el-input
                        placeholder="Enter email"
                        v-model="ruleForgotPassword.email"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSend('ruleForgotPassword')">Send recover link</el-button>
            </el-form>
            <div class="link">
                <el-link >
                    <router-link :to="{ name: 'Login' }" class="router-link">
                        Back to login
                    </router-link>
                </el-link>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "ForgotPassword",
    data() {
        return {
            ruleForgotPassword: {
                email: ''
            },
            rules: {
                email: [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                    { type: 'email', message: 'Please input correct email address', trigger: ['blur'] },
                ],
            }
        }
    },
    methods: {
        handleSend(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message({
                        message: 'Email has been send !',
                        type: 'success',
                    });
                    this.$router.push({name: 'Login'})
                } else {
                    this.$message({
                        message: 'Register failed !',
                        type: 'error'                   
                    });
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.el-card {
    background: transparent;
    border: none;
    h3 {
        color: #fff;
    }
    p {
        color: #fff;
        margin-bottom: 0;
        font-size: 12px;
        font-weight: 600;
    }
    .el-button {
        width: 100%;
        background: #6e85d3;
        padding: 20px 12px;
    }
    .link {
        text-align: center;
        margin-top: 8px;
        margin-bottom: 24px;
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