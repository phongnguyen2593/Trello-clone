<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="23" >
                    <img src="@/assets/images/logo-text.png" style="width:110px;height:20px;margin-top:9px">
                </el-col>
                <el-col :span="1" class="avatar">
                    <el-dropdown >
                        <div v-if="authUser.avatar">
                            <el-avatar :src="baseUrl + authUser.avatar"></el-avatar>
                        </div>
                        <el-avatar v-else velse icon="el-icon-user-solid"></el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="redirectProfile">
                                Thông tin tài khoản
                            </el-dropdown-item>
                            <el-dropdown-item style="border-top: 1px solid #F1F3F8" @click.native="logout">
                                Đăng xuất
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <div id="content">
                <div class="main-content">
                    <div class="directory" v-for="(directory) in directories" :key="directory.id">
                        <draggable :directory="directories" item-key="id" :animation="108" @change="changeDirectory">
                            <Directory :directory="directory" @reloadDirectories="getDataDirectory" />
                        </draggable>
                    </div>
                    <div class="directory add-directory is-idle">
                        <span
                            class="open-add-directory"
                            @click="showFormAddDirectory = !showFormAddDirectory"
                            ref="btnAddDirectory"
                            v-show="!showFormAddDirectory">
                            <i class="el-icon-plus"></i>
                            Add a directory
                        </span>
                        <div class="form-add-directory" v-show="showFormAddDirectory">
                            <el-input
                                size="small"
                                placeholder="Enter ditectory title ..."
                                v-model="directoryTitle"
                                @keyup.enter="handleAddDirectory()">
                            </el-input>
                            <div class="directory-add-controls">
                                <el-button
                                    type="success"
                                    class="btn-save"
                                    @click="handleAddDirectory()">
                                    Add Directory
                                </el-button>
                                <i class="el-icon-close" @click="showFormAddDirectory = !showFormAddDirectory"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
// @ is an alias to /src
import api from '@/api'
import { mapMutations, mapActions, mapState } from 'vuex'
import Directory from '@/components/Directory'
import draggable from 'vuedraggable'

export default {
    name: 'Home',
    components: {
        Directory,
        draggable
    },
    data() {
        return {
            showFormAddDirectory: false,
            directoryTitle: '',
            directories: [],
            baseUrl: 'http://vuecourse.zent.edu.vn/storage/users/',
        }
    },
    computed: {
        ...mapState('auth', ['authUser']),
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapMutations('auth', ['updateAuthUser']),
        handleAddDirectory() {
            if (this.directoryTitle !== '') {
                let data = {
                    title: this.directoryTitle,
                    index: this.directories.length + 1
                }
                api.storeDirectory(data).then(() => {
                    this.getDataDirectory()
                    this.directoryTitle = ''
                    this.showFormAddDirectory = !this.showFormAddDirectory
                    this.$message({
                        message: 'Created directory successfully!',
                        type: "success",
                    })
                }).catch(() => {
                    this.$message({
                        message: 'Created failure !',
                        type: "error"
                    })
                })
            }
        },
        getDataDirectory() {
            api.getDirectories().then((response) => {
                this.directories = response.data.data
            })
        },
        redirectProfile() {
            this.$router.push({ path: '/user' })
        },
        changeDirectory(e){
            let newIndex = e.moved.newIndex
            let directoryId = e.moved.element.id
            let data = {
                'index': newIndex
            }
            api.changeIndexDirectory(data, directoryId).then((response) => {
                if (response) {
                    this.getDirectories();
                }
            })
            
        },
    },
    mounted() {
        this.getDataDirectory()
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/home.scss';
</style>
