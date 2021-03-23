<template>
    <div class="directory-content">
        <div class="directory-header">
            <div v-show="!editDirectoryTitle">
                <p @click="editDirectoryTitle = !editDirectoryTitle">{{ directoryTitle }}</p>
            </div>
            <input
                type="text"
                v-model="directoryTitle"
                v-show="editDirectoryTitle"
                @blur="editDirectoryTitle = !editDirectoryTitle"
                @keydown.enter="updateDirectoryTitle"
                ref="textDirectoryTitle"
                value="directoryTitle">
            <div class="directory-header-extras" @click="deleteDerectory">
                <span class="el-icon-delete"></span>
            </div>
        </div>
        <div class="directory-main">
            <div v-for="(card, index) in directory.cards" :key="index">
                <Card :card="card" @emitCardDetail="cardDetail"/>
            </div>
            <div class="form-add-card" v-show="showFormAddCard">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3}"
                    placeholder="Enter a title for this card…"
                    v-model="cardName"
                    >
                </el-input>
                <div class="card-add-controls">
                    <el-button
                        type="success"
                        class="btn-save"
                        @click="addCard">Add Card</el-button>
                    <i class="el-icon-close" @click="showFormAddCard = !showFormAddCard"></i>
                </div>
            </div>
        </div>
        <div class="directory-footer" v-show="!showFormAddCard">
            <a class="add-card" @click="showFormAddCard = !showFormAddCard">
                <span>
                    <i class="el-icon-plus"></i>
                    Add a card
                </span>
            </a>
        </div>

        <el-dialog
            :visible.sync="dialogcardDetail"
            width="50%"
            >
            <el-row style="min-height: 450px">
                <el-col :span="18">
                    <div class="detail-card-header">
                        <i class="el-icon-bank-card"></i>
                        <input class="detail-card-title" v-model="card.title" @keydown.enter="updateCardTitle">
                    </div>
                    <el-row>
                        <el-col :span="22" :offset="2">
                            <div v-if="card.labels" class="" style="margin-bottom: 10px">
                                <span 
                                    style="display:block;margin-bottom: 5px;font-size: 12px;font-weight: bold;color: #5e6c84;">
                                    LABELS
                                </span>
                                <el-tag 
                                    v-for="(label, index) in card.labels" :key="index"
                                    :color="label.color"
                                    effect="dark"
                                    style="margin-right: 5px; border: 0">
                                    {{label.name}}
                                </el-tag>
                            </div>
                            <div class="deadline" v-if="card.deadline">
                                <span style="display:block;margin-bottom: 5px;font-size: 12px;font-weight: bold;color: #5e6c84;">
                                    DUE DATE
                                </span>
                                <el-checkbox v-model="deadlineStatus" @change="handleChangeDeadlineStatus">
                                <div class="card-action-btn" style="padding-right: 7px
                                                                    width: 100%;
                                                                    height: 32px;
                                                                    border-radius: 3px;
                                                                    box-sizing: border-box;
                                                                    display: flex;
                                                                    align-items: center;
                                                                    padding-left: 7px;
                                                                    background-color: rgba(9,30,66,.04);
                                                                    margin-bottom: 7px;
                                                                    cursor: pointer;">
                                    {{formatDate(card.deadline)}}
                                    <div
                                        style="color: #ffffff;
                                            padding: 1px;
                                            font-size: 12px;
                                            background-color: #ec9488;
                                            border-radius: 3px;
                                            margin-left: 7px;"
                                        v-if="formatDate(deadline) < moment().format('YYYY-MM-DD HH:mm:ss') && card.status == 0">
                                            OVER DUE
                                    </div>
                                    <div style="color: #ffffff;
                                                padding: 2px 5px;
                                                font-size: 12px;
                                                background-color: #61bd4f;
                                                border-radius: 3px;
                                                margin-left: 7px;"
                                    v-else-if="card.status == 1">
                                        COMPLETE
                                    </div>
                                </div>
                                </el-checkbox>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="card-info">
                        <el-col :span="2" style="font-size: 20px">
                            <i class="el-icon-tickets"></i>
                        </el-col>
                        <el-col :span="22" style="padding-right: 18px">
                            <div class="card-info-title">
                                <span style="line-height: 23px;">Description</span>
                                <el-button size="small" style="padding: 5px 10px; margin-left: 5px" @click="openEditCardDescription" plain>
                                    Edit
                                </el-button>
                            </div>
                            <div v-if="card.description" class="card-description">
                                {{ card.description }}
                            </div>
                            <div
                                v-else
                                class="add-card-description"
                                ref="btnAddCardDescription">
                                Add a more detailed description…
                            </div>
                            <textarea
                                ref="cardDescription"
                                v-model="carDescription"
                                class="add-card-description-textarea">
                            </textarea>
                            <textarea
                                placeholder="Thêm mổ tả chi tiết..."
                                class="add-card-description-textarea"
                                @blur="updateCardDescription">
                            </textarea>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6" class="card-info">
                    <div style="margin-bottom: 7px">
                        <span style="font-size: 12px;font-weight: 600;color: #5e6c84;">
                            ADD TO CARD
                        </span>
                    </div>
                    <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click">
                        <el-popover
                            placement="bottom"
                            width="300"
                            trigger="click">
                            <div class="add-labels" style="font-family: Arial;">
                                <div style="display: flex;align-items: center;justify-content: center;height: 30px;
                                            border-bottom: 1px solid rgb(9 30 66 / 16%);
                                            margin-bottom: 10px;">
                                    <span>Labels</span>
                                </div>
                                <div class="form-add-labels">
                                    <span>Name</span>
                                    <br>
                                    <input
                                        type="text"
                                        class="label-name"
                                        ref="inputLabel"
                                        v-model="labelName"
                                        style="width: 98%;
                                            height: 30px;
                                            display: block;
                                            margin: 5px 0 10px 0;
                                            box-sizing: border-box;
                                            padding-left: 10px;
                                            border-radius: 5px;">
                                    <p style="margin: 0 0 5px 0">Select color</p>
                                    <div
                                        style="background-color: #61bd4f;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#61bd4f')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #f2d600;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#f2d600')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #ff9f1a;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#ff9f1a')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #eb5a46;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#eb5a46')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div 
                                        style="background-color: #c377e0;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#c377e0')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div 
                                        style="background-color: #0079bf;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#0079bf')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #00c2e0;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#00c2e0')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #51e898;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#51e898')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #ff78cb;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#ff78cb')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #344563;
                                                width: 55px;
                                                height: 32px;
                                                margin: 0 5px 5px 0;
                                                float: left;
                                                border-radius: 5px;
                                                cursor: pointer;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: #ffffff;"
                                        @click="selectlabelColor('#344563')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <el-button class="btn-save-label" type="success" size="small" @click="addLabel">Tạo mới</el-button>
                                </div>
                            </div>
                            <div class="prop-action-btn" style="justify-content: center; margin-top: 10px" slot="reference">
                                <span style="font-family: Arial" class="card-action-btn">Add label</span>
                            </div>
                        </el-popover>
                        <div class="card-action-btn" slot="reference">
                            <i class="el-icon-collection-tag" style="margin-right: 7px"> </i>
                            <span>Labels</span>
                        </div>
                    </el-popover>
                    <el-popover
                        placement="bottom"
                        width="300"
                        trigger="click">
                        <div class="pop-add-labels" style="font-family: Arial;">
                            <div class="form-add-labels">
                                <span>Title</span>
                                <br>
                                <input
                                    type="text"
                                    style=" width: 98%;
                                            height: 30px;
                                            display: block;
                                            margin: 5px 0 10px 0;
                                            box-sizing: border-box;
                                            padding-left: 10px;
                                            border-radius: 5px;"
                                    v-model="checkListName">
                                <el-button
                                    class="btn-save-label"
                                    type="success" size="small"
                                    @click="addCheckList"
                                    style="margin-left:6px">
                                    Add todo list
                                </el-button>
                            </div>
                        </div>
                        <div class="card-action-btn" slot="reference">
                            <i class="el-icon-s-claim" style="margin-right: 7px"></i>
                            Toto list
                        </div>
                    </el-popover>
                    <div class="card-action-btn">
                        <i class="el-icon-time" style="margin-right: 7px;z-index:1000"></i>
                        <span style="position: absolute;z-index:1;right:96px;cursor:pointer">Due date</span>
                        <el-date-picker
                            v-model="deadline"
                            type="datetime"
                            size="mini"
                            @change="updateDuedate"
                            style="opacity: 0;z-index:10;cursor:pointer">
                        </el-date-picker>
                    </div>
                    <label for="file">
                        <div class="card-action-btn">
                            <i class="el-icon-link" style="margin-right: 7px"> </i>
                            <span>Attachment</span>
                        </div>
                    </label>
                    <input
                        style="display: none"
                        ref="file" type="file"
                        accept="image/*" id="file"
                        @change="handleUploadFile">
                    <el-button type="danger" style="padding: 5px 20px;" @click="deleteCard"> Delete</el-button>
                </el-col>
                <el-row style="" class="card-info" v-for="(checkList, index) in card.check_lists" :key="index">
                    <el-col :span="2" style="font-size: 20px">
                        <i class="el-icon-s-claim"> </i>
                    </el-col>
                    <el-col :span="22" style="padding-right: 18px">
                        <div class="card-info-title">
                            {{checkList.title}}
                            <el-button size="small"
                                style="padding: 5px 10px; margin-left: 5px; float: right" 
                                @click="handleDeleteCheckList(checkList.id)"
                                plain>
                                Delete
                            </el-button>
                        </div>
                    <el-progress :percentage="0" style="margin-bottom: 15px"></el-progress>
                    <div class="check-list-childs" v-for="(child, index) in checkList.check_list_childs" :key="index">
                        <el-checkbox v-model="child.status" @change="changeStatusCheckListChild(child.id, child.status)">
                            {{child.title}}
                        </el-checkbox>
                    </div>
                    <input
                        v-if="addSubCheckList"
                        type="text"
                        class="input-sub-check-list"
                        placeholder="Thêm một mục"
                        ref="inputSubCheckList"
                        v-model="subCheckListName">
                    <div v-if="addSubCheckList" ref="btnSubCheckList">
                        <el-button size="small" @click="closeAddSubCheckList">Cancel</el-button>
                        <el-button type="success" size="small" @click="handleCreateSubCheckList(checkList.id)">Add</el-button>
                    </div>
                    <div
                        v-if="!addSubCheckList"
                        class="card-action-btn"
                        ref="btnAddSubCheckList"
                        style="width: 110px"
                        @click="openAddSubCheckList">
                        Add an attactment
                    </div>
                    </el-col>
                </el-row>
                <!-- <el-row style="" class="card-info">
                    <el-col :span="2" style="font-size: 20px">
                        <i class="el-icon-paperclip"></i>
                    </el-col>
                    <el-col :span="22" style="padding-right: 18px">
                        <div class="card-info-title">
                            Attachments
                        </div>
                        <div class="file-item" v-for="file in card.files" :key="file.id">
                            <img class="card-files" :src="baseFileUrl + file.path" alt="">
                            <div class="card-files-info">
                                <div class="file-name">{{file.name}}</div>
                            <el-link type="info">Delete</el-link>
                            -
                                <el-popover
                                    placement="top-start"
                                    width="300"
                                    trigger="click">
                                    <div class="add-labels">
                                        <div class="add-labels-header">
                                            Edit
                                        </div>
                                        <div class="form-add-labels">
                                            Name
                                            <br>
                                            <input type="text" class="label-name" ref="inputLabel" v-model="fileName" >
                                            <el-button
                                                type="success"
                                                size="small"
                                                @click="handleChangeFileName(file.id)">
                                                Update
                                            </el-button>
                                        </div>
                                    </div>
                                    <el-link type="info" slot="reference" @click="openChangeFileName(file.name)">
                                        Edit
                                    </el-link>
                                </el-popover>
                            </div>
                        </div>
                    </el-col>
                </el-row> -->
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import api from '@/api'
import moment from 'moment'

export default {
    name: "Directory",
    props: ['directory'],
    components: {
        Card,
    },
    data() {
        return {
            showFormAddCard: false,
            editDirectoryTitle: false,
            directoryTitle: this.directory.title,
            cards: [],
            card: '',
            cardName: '',
            carDescription: false,
            dialogcardDetail: false,
            labels: [],
            labelName: '',
            labelColor: '',
            deadline: '',
            checkListName: '',
            subCheckListName: '',
            addSubCheckList: false,
            deadlineStatus: '',
            baseFileUrl: 'http://vuecourse.zent.edu.vn/storage/',
            fileName: '',
        }
    },
    methods: {
        addCard() {
            if (this.cardName !== '') {
                let data = {
                    title: this.cardName,
                    index: this.directory.cards.length + 1,
                    directory_id: this.directory.id
                }
                api.storeCard(data).then(() => {
                    this.reloadDirectories(),
                    this.$message({
                        message: 'Create card success!',
                        type: 'success'
                    })
                }).catch(() => {
                    this.$message({
                        message: 'Create card fail!',
                        type: 'error',
                    });
                })
                this.showFormAddCard = !this.showFormAddCard,
                this.cardName = ''
            }
        },
        updateDirectoryTitle() {
            console.log(1);
        },
        deleteDerectory() {
            this.$confirm('Are you sure want to delete?', 'Warning', {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                confirmButtonClass: 'btn-delete-list',
                type: 'warning'
            }).then(() => {
                api.destroyDirectory(this.directory.id).then(() => {
                    this.$message({
                        message: 'Directory deleted successfully!',
                        type: 'success'
                    });
                    this.reloadDirectories()
                }).catch(() => {
                    this.$message({
                        message: 'Directory deleted failure!',
                        type: 'error'
                    });
                })
            }).catch(() => {})
        },
        reloadDirectories() {
            this.$emit('reloadDirectories')
        },
        cardDetail(value) {
            this.dialogcardDetail = true
            this.card = value
        },
        getCardDetail() {
            api.getCardDetail(this.card.id).then((response) => {
                this.card = response.data.data
                this.carDescription = response.data.data.description
                if (this.card.status == 1) {
                    this.deadlineStatus = true
                } else {
                    this.deadlineStatus = false
                }
            })
        },
        updateCardTitle() {
            if (this.card.title != '') {
                let data = {
                    title: this.card.title
                }
                api.editCard(this.card.id, data).then(() => {
                    this.$message({
                        message: 'Update card success!',
                        type: 'success'
                    });
                })
            } else {
                return false
            }
        },
        openEditCardDescription() {
            if (!this.carDescription) {
                this.$refs.btnAddCardDescription.style.display = 'none'
            }
            this.$refs.cardDescription.style.display = 'block'
        },
        updateCardDescription() {
            let data = {
                description: this.carDescription
            }
            api.editCard(this.card.id, data).then(() => {
                this.$message({
                    message: 'Update success!',
                    type: 'success'
                });
                this.getDetailCard()
            })
        },
        deleteCard() {
            api.destroyCard(this.card.id).then(() => {
                this.$message({
                    message: 'Delete success!',
                    type: 'success'
                });
                this.dialogcardDetail = false
            })
        },
        addLabel() {
            if (this.labelName && this.labelColor) {
                let data = {
                    name: this.labelName,
                    color: this.labelColor
                }
                api.createLabel(this.card.id, data).then((response) => {
                    console.log(response)
                    this.labelName = ''
                    this.labelColor = ''
                    this.$refs.inputLabel.style.background = '#ffffff'
                    this.$refs.inputLabel.style.color = '#000000'
                    this.getCardDetail()
                    this.dialogVisible = true
                })
            }
        },
        selectlabelColor(color) {
            this.$refs.inputLabel.style.background = color
            this.$refs.inputLabel.style.color = '#ffffff'
            this.$refs.inputLabel.style.border = '#ffffff'
            this.labelColor = color
        },
        updateDuedate() {
            let data = {
                deadline: this.formatDate(this.deadline)
            }
            api.cardDeadline(this.card.id, data).then(() => {
                this.getCardDetail()
            })
        },
        handleChangeDeadlineStatus(e) {
            let data
            if (e) {
                data = {
                    status: 1
                }
            }else {
                data = {
                    status: 0
                }
            }
            api.updateCardStatus(this.card.id, data).then(() => {
                this.getCardDetail()
            })
        },
        addCheckList() {
            let data = {
                title: this.checkListName,
                card_id: this.card.id
            }
            api.createChecklist(data).then(() => {
                this.getCardDetail()
            })
        },
        handleUploadFile() {
            console.log(1);
        },
        formatDate (dateString) {
            return moment(dateString).format('YYYY-MM-DD HH:mm:ss')
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/directory.scss'
</style>