<template>
    <div id="user">
        <div class="close">
            <router-link :to="{ name: 'Home' }"><i class="el-icon-close close-icon"></i></router-link>
        </div>
        <el-row :gutter="20">
            <el-col :span="8" :offset="8">
                <div class="user-info">
                    <h5>MY ACCOUNT</h5>
                    <div class="information">
                        <div class="information-content">
                            <el-row>
                                <el-col :span="4">
                                    <div class="block">
                                        <label class="avatar">
                                            <img v-if="authUser.avatar" :src="baseUrl + authUser.avatar" class="img">
                                            <img v-else :src="defaultAvatar" alt="" class="img">
                                        </label>
                                    </div>
                                </el-col>
                                <el-col :span="15" class="user-name">
                                    <span>{{authUser.name}}</span>
                                    <el-button
                                        ref="btnEdit"
                                        type="primary"
                                        icon="el-icon-edit"
                                        style="border:none;background-color:transparent"
                                        @click="formProfile = true">
                                    </el-button>
                                    <el-dialog
                                        title="Edit profile"
                                        :visible.sync="formProfile"
                                        width="30%"
                                        class="form-change-profile">
                                        <el-form>
                                            <div for="avatar" class="avatar" style="margin-left:150px;cursor:pointer">
                                                <img
                                                    v-if="authUser.avatar"
                                                    @click="thisFileUpload()"
                                                    :src="baseUrl + authUser.avatar"
                                                    style="width: 120px;height: 120px;border-radius: 50%;">
                                                <img v-else @click="thisFileUpload()" :src="defaultAvatar" class="img">
                                                <div class="image-upload" v-if="isImg">
                                                    <img :src="imageLocal">
                                                    <i class="el-icon-circle-close closeBtn" @click="close"></i>
                                                </div>
                                            </div>
                                            <input type="file" ref="inputFile" accept="image/*" id="avatar" style="display:none" @change="onChangeUpload">
                                            <el-form-item label="Name">
                                                <el-input v-model="name" type="text"></el-input>
                                                <span ref="errorName" class="error"></span>
                                            </el-form-item>
                                            <el-form-item label-position="right">
                                                <el-button @click="dialogVisible = false">Cancel</el-button>
                                                <el-button type="primary" @click="handleEditProfile()">
                                                    Confirm
                                                </el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-dialog>
                                </el-col>
                                <el-col>
                                    <div class="information-content__base">
                                        <el-row>
                                            <el-col>
                                                <div class="information-content__base-content">
                                                    <h6>name</h6>
                                                    <span>{{authUser.name}}</span>

                                                </div>
                                            </el-col>
                                            <el-col>
                                                <div class="information-content__base-content">
                                                    <h6>Email</h6>
                                                    <span>{{authUser.email}}</span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="line"></div>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="password">
                    <h5>PASSWORD</h5>
                    <el-button class="btn-change-password" type="primary" @click="dialogVisible = true">
                        Change Password
                    </el-button>
                    <el-dialog
                        title="Change your password"
                        :visible.sync="dialogVisible"
                        width="30%"
                        class="form-change-password">
                        <el-form :model="formChangePassword" :rules="rules" ref="formChangePassword">
                            <el-form-item label="New Password" prop="password">
                                <el-input v-model="formChangePassword.password" type="password"></el-input>
                            </el-form-item>
                            <el-form-item label="Confirm New Password" prop="confirmPassword">
                                <el-input v-model="formChangePassword.confirmPassword" type="password"></el-input>
                            </el-form-item>
                            <el-form-item label-position="right">
                                <el-button @click="dialogVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="handleChangePassword('formChangePassword')">
                                    Confirm
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="line"></div>
            </el-col>
            <el-col :span="8" :offset="8">
                <div class="logout">
                    <el-button type="danger" class="btn-logout" @click.native="logout">Logout</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import api from '@/api'

export default {
    name: 'UserLayout',
    computed: {
        ...mapState('auth', ['authUser'])
    },
    data() {
        let confirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('This field is required'));
            } else if (value !== this.formChangePassword.password) {
                callback(new Error('Password must match'));
            } else {
                callback();
            }
        };
        return {
            defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            dialogVisible: false,
            formProfile: false,
            image: '',
            imageLocal: '',
            isImg:false,
            name: '',
            baseUrl: 'http://vuecourse.zent.edu.vn/storage/users/',
            formChangePassword: {
                confirmPassword: '',
                password: '',
            },
            rules: {
                password: [
                    { required: true, message: 'Please enter new password', trigger: 'blur' },
                    { min: 6, message: 'Length should be more than 5', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: 'Please enter new password again', trigger: 'blur' },
                    { validator: confirm, trigger: ['blur', 'change'] },
                ],
            },
        }
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapMutations('auth', ['updateAuthUser']),
        handleChangePassword(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        password: this.formChangePassword.password,
                        password_confirmation: this.formChangePassword.confirmPassword,
                    }
                    api.changePassword(data).then(() => {
                        this.$message({
                            message: 'Update password success!',
                            type: 'success',
                        }),
                        this.dialogVisible = !this.dialogVisible
                    }).catch(() => {
                        this.$message({
                            message: 'Update password fail!',
                            type: 'error',
                        });
                    })
                } else {
                    return false;
                }
            });
        },
        handleEditProfile() {
            let error = false
            if (!this.name.length) {
                error = true
                this.$refs.errorName.innerHTML = 'Please enter your name'
            }
            if (this.name.length < 6) {
                error = true
                this.$refs.errorName.innerHTML = 'Name must be more than 5'
            }
            if (!error) {
                const frmData = new FormData()
                frmData.append('name', this.name)
                if (this.image != '') {
                    frmData.append('avatar', this.image)
                }
                api.updateUserProfile(frmData).then(() => {
                    this.getUserData()
                    this.imageLocal = ''
                    this.isImg = false
                    this.formProfile = false
                    error = false
                    this.$message({
                        message: 'Update profile success!',
                        type: 'success'
                    });
                }).catch(() => {
                    console.log('Error')
                })
            }
        },
        thisFileUpload(){
            this.$refs.inputFile.click();
        },
        onChangeUpload(e){
            if (e.target.files.length) {
                this.image = e.target.files[0]
                this.isImg = true;
                this.imageLocal = URL.createObjectURL(this.image);
            }
        },
        close() {
            this.imageLocal = '';
            this.isImg = false;
            this.image = ''; 
        },
        getUserData() {
            api.getAuthUser().then((response) => {
                if (response) {
                    this.updateAuthUser(response.data)
                }
            })
        },
    },
    mounted () {
        this.name = this.authUser.name;
    },
    watch: {
        name() {
            this.$refs.errorName.innerHTML = ''
        }
    }
    
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/user.scss'
</style>