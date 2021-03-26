<template>
    <div class="directory-content">
        <div class="directory-header">
            <div>
                <p @click="editDirectoryTitle" ref="directoryTitle">
                    {{ directory.title }}
                </p>
                <input
                style="width:200px;display:none;"
                type="text"
                v-model="directory.title"
                @keydown.enter="updateDirectoryTitle"
                ref="inputDirectoryTitle">
            </div>
            <div class="directory-header-extras" @click="deleteDerectory">
                <span class="el-icon-delete"></span>
            </div>
        </div>
        <div class="directory-main">
            <draggable :directory="directory.card" item-key="id" :animation="108" group="todo" :id="directory.id" @change="changeCard">
                <div v-for="(card, index) in directory.cards" :key="index">
                    <div class="card">
                        <div class="card-detail">
                            <div class="card-labels">
                                <el-tag
                                    v-for="(label, index) in card.labels" :key="index"
                                    :color="label.color"
                                    effect="dark"
                                    style="margin-right: 5px; border: 0; height: 8px; width: 40px">
                                </el-tag>
                            </div>
                            <span class="card-title" @click="opentDialogCard(card.id)">{{ card.title }}</span>
                            <div class="badges">
                                <el-button
                                    ref="btn"
                                    v-if="card.status == 1"
                                    type="danger"
                                    icon="el-icon-time"
                                    @click="updateCardStatus">
                                    {{ fomatDateCard(card.deadline) }}
                                </el-button>
                                <el-button
                                    ref="btn"
                                    v-else-if="card.status == 3"
                                    type="success"
                                    icon="el-icon-time">
                                    {{ fomatDateCard(card.deadline) }}
                                </el-button>
                                <el-button
                                    ref="btn"
                                    v-else-if="card.status == 2"
                                    type="warning"
                                    icon="el-icon-time">
                                    {{ fomatDateCard(card.deadline) }}
                                </el-button>
                                
                                <el-button
                                    ref="btn"
                                    v-else-if="card.status == 0"
                                    icon="el-icon-time">
                                    {{ fomatDateCard(card.deadline) }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>
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
                        <input
                            ref="cardTitle"
                            class="detail-card-title"
                            v-model="card.title"
                            @keydown.enter="updateCardTitle">
                    </div>
                    <el-row>
                        <el-col :span="22" :offset="2">
                            <div v-if="card.labels != 0" class="" style="margin-bottom: 10px">
                                <span class="text-small">
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
                                <span class="text-small">
                                    DUE DATE
                                </span>
                                <el-checkbox @change="handleChangeDeadlineStatus()" ref="deadlineCheck">
                                <div class="due-date-checkbox">
                                    {{formatDate(card.deadline)}}
                                    <div class="overdue" v-if="card.status == 1">
                                            <span>OVER DUE</span>
                                    </div>
                                    <div class="complete" v-else-if="card.status == 3">
                                        <span>COMPLETE</span>
                                    </div>
                                    <div 
                                        class="due-soon"
                                        v-else-if="card.status == 2">
                                        <span>DUE SOON</span>
                                    </div>
                                    <div 
                                        class="none"
                                        v-else-if="card.status == 0">
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
                                <el-button
                                    v-if="card.description"
                                    size="small"
                                    style="padding: 5px 10px; margin-left: 5px"
                                    @click="showFormEditCardDescription()" plain>
                                    Edit
                                </el-button>
                            </div>
                            <div v-if="card.description" class="card-description">
                                <p ref="cardDescription"  @click="showFormEditCardDescription()">{{ card.description }}</p>
                            </div>
                            <div
                                v-else
                                class="add-card-description"
                                ref="btnAddCardDescription"
                                @click="showFormEditCardDescription()">
                                <span>Add a more detailed description…</span>
                            </div>
                            <div ref="formEditCardDescription" style="display:none">
                                <textarea
                                    @blur="updateCardDescription"
                                    v-model="card.description"
                                    class="add-card-description-textarea">
                                </textarea>
                                <div class="edit-controls">
                                    <el-button @click="updateCardDescription()" type="success">Lưu</el-button>
                                    <span @click="cancelUpdateCardDescription()" class="icon el-icon-close"></span>
                                </div>
                            </div>
                            
                        </el-col>
                    </el-row>
                    <el-row>
                        <div v-if="card.check_lists">
                            <el-row v-for="(checklist, index) in card.check_lists" :key="index" class="card-info" >
                                <el-col :span="2" style="font-size: 20px">
                                    <i class="el-icon-s-claim"> </i>
                                </el-col>
                                <el-col :span="22" style="padding-right: 18px">
                                    <div class="card-info-title">
                                        {{checklist.title}}
                                        <el-button
                                            size="small"
                                            class="btn-delete-checklist" 
                                            @click="handleDeleteChecklist(checklist.id)"
                                            plain>
                                            Delete
                                        </el-button>
                                    </div>
                                <div v-if="checklist.check_list_childs.length != 0 ">
                                    <el-progress :percentage="checkPercentComplete(checklist.check_list_childs)" style="margin-bottom: 15px" ></el-progress>
                                </div>
                                <div v-for="(child, indexChild) in checklist.check_list_childs" :key="child.id" class="check-list-childs">
                                    <el-checkbox
                                        v-model="child.status"
                                        :ref="getNameRef(index, indexChild)"
                                        @change="changeStatusChecklistChild(index, indexChild, child.id)"
                                        :checked="child.status ? true : false">
                                        {{child.title}}
                                    </el-checkbox>
                                    <el-button
                                            size="small"
                                            class="btn-delete-checklist-child" 
                                            @click="handleDeleteChecklistChild(child.id)"
                                            plain>
                                            Delete
                                        </el-button>
                                </div>
                                <input
                                    v-if="addSubCheckList"
                                    type="text"
                                    class="input-sub-check-list"
                                    placeholder="Enter title ..."
                                    ref="inputSubCheckList"
                                    v-model="subChecklistName">
                                <div
                                    v-if="addSubCheckList"
                                    ref="btnSubCheckList">
                                    <el-button type="success" size="small" @click="handleCreateSubCheckList(checklist.id)">Add</el-button>
                                    <el-button size="small" @click="closeAddSubCheckList">Cancel</el-button>
                                </div>
                                <div
                                    v-if="!addSubCheckList"
                                    class="card-action-btn"
                                    ref="btnAddSubCheckList"
                                    style="width: 130px"
                                    @click="openAddSubCheckList()">
                                    Add checklist child
                                </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-row>
                    <el-row v-if="card.files" class="card-info">
                        <el-col :span="2" style="font-size: 20px">
                            <i class="el-icon-paperclip"></i>
                        </el-col>
                        <el-col :span="19" style="padding-right: 18px">
                            <div class="card-info-title">
                                <span>Attachments</span>
                            </div>
                            <div class="file-item" v-for="file in card.files" :key="file.id">
                                <img class="card-files" :src="baseFileUrl + file.path">
                                <div class="card-files-info">
                                    <p class="file-name">
                                        {{file.name}}
                                    </p>
                                    <el-link type="info">Delete</el-link>
                                    -
                                    <el-popover
                                        placement="top-start"
                                        width="300"
                                        trigger="click">
                                        <div class="add-labels">
                                            <div class="add-labels-header">
                                                <span>Edit</span>
                                            </div>
                                            <div class="form-add-labels">
                                                <span>Name</span>
                                                <br>
                                                <input type="text" class="label-name" ref="inputLabel" v-model="fileName" >
                                                <el-button type="success" size="small" @click="handleChangeFileName(file.id)">
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
                    </el-row>
                </el-col>
                <el-col :span="6" class="card-info-left">
                    <div class="card-info-left__head">
                        <span class="card-info-left__head-title">
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
                                <div class="form-add-labels">
                                    <span>Name</span>
                                    <br>
                                    <input
                                        type="text"
                                        class="label-name"
                                        ref="inputLabel"
                                        v-model="labelName">
                                    <p style="margin: 0 0 5px 0">Select color</p>
                                    <div
                                        style="background-color: #61bd4f;"
                                        class="color-picker"
                                        @click="selectlabelColor('#61bd4f')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #f2d600;"
                                        class="color-picker"
                                        @click="selectlabelColor('#f2d600')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #ff9f1a;"
                                        class="color-picker"
                                        @click="selectlabelColor('#ff9f1a')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #eb5a46;"
                                        class="color-picker"
                                        @click="selectlabelColor('#eb5a46')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div 
                                        style="background-color: #c377e0;"
                                        class="color-picker"
                                        @click="selectlabelColor('#c377e0')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div 
                                        style="background-color: #0079bf;"
                                        class="color-picker"
                                        @click="selectlabelColor('#0079bf')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #00c2e0;"
                                        class="color-picker"
                                        @click="selectlabelColor('#00c2e0')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #51e898;"
                                        class="color-picker"
                                        @click="selectlabelColor('#51e898')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #ff78cb;"
                                        class="color-picker"
                                        @click="selectlabelColor('#ff78cb')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <div
                                        style="background-color: #344563;"
                                        class="color-picker"
                                        @click="selectlabelColor('#344563')">
                                        <i class="check-color el-icon-check" style="display: none;"></i>
                                    </div>
                                    <el-button class="btn-save-label" type="success" size="small" @click="addLabel">Create</el-button>
                                </div>
                            </div>
                            <div class="prop-action-btn" slot="reference">
                                <span style="font-family: Arial" class="card-action-btn">Add label</span>
                            </div>
                        </el-popover>
                        <div class="card-action-btn" slot="reference">
                            <i class="el-icon-collection-tag card-info-left__icon"> </i>
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
                                    class="label-name"
                                    v-model="checklistName">
                                <el-button
                                    class="btn-save-label"
                                    type="success" size="small"
                                    @click="handleAddCheckList()"
                                    style="margin-left:6px">
                                    Add todo list
                                </el-button>
                            </div>
                        </div>
                        <div class="card-action-btn" slot="reference">
                            <i class="el-icon-s-claim card-info-left__icon"></i>
                            Toto list
                        </div>
                    </el-popover>
                    <div class="card-action-btn">
                        <i class="el-icon-time card-info-left__icon"></i>
                        <span class="card-info-left__time-title">Due date</span>
                        <el-date-picker
                            v-model="deadline"
                            type="datetime"
                            size="mini"
                            @change="updateDuedate()"
                            class="card-info-left__time-picker">
                        </el-date-picker>
                    </div>
                    <label for="file">
                        <div class="card-action-btn">
                            <i class="el-icon-link card-info-left__icon"> </i>
                            <span>Attachment</span>
                        </div>
                    </label>
                    <input
                        style="display: none"
                        ref="file"
                        type="file"
                        accept="image/*"
                        id="file"
                        @change="handleUploadFile">
                    <el-button type="danger" class="btn-delete-card" @click="deleteCard"> Delete</el-button>
                </el-col>
                
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api'
import moment from 'moment'
import draggable from 'vuedraggable'

export default {
    name: "Directory",
    props: ['directory'],
    components: {
        draggable
    },
    data() {
        return {
            showFormAddCard: false,
            card: '',
            cardName: '',
            cardDescription: '',
            dialogcardDetail: false,
            labels: [],
            labelName: '',
            labelColor: '',
            deadline: '',
            checklistName: '',
            subChecklistName: '',
            addSubCheckList: false,
            deadlineStatus: '',
            baseFileUrl: 'http://vuecourse.zent.edu.vn/storage/',
            fileName: '',
        }
    },
    methods: {
        // DIRECTORY
        editDirectoryTitle() {
            console.log(this.card);
            this.$refs.directoryTitle.style.display = 'none'
            this.$refs.inputDirectoryTitle.style.display = 'block';
        },
        updateDirectoryTitle() {
            this.$refs.directoryTitle.style.display = 'block'
            this.$refs.inputDirectoryTitle.style.display = 'none'

            let data = {
                title: this.$refs.inputDirectoryTitle.value
            }

            api.updateDirectory(data, this.directory.id).then((response) => {
                if (response) {
                    this.reloadDirectories()
                    this.$message({
                        message: 'Update directory success!',
                        type: 'success'
                    })
                }
            })
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

        // CARD
        opentDialogCard(id) {
            this.dialogcardDetail = true
            this.getCardDetail(id)
            console.log(this.card);
        },
        fomatDateCard(date) {
            return moment(date).format('DD - MMM')
        },
        formatDate (dateString) {
            return moment(dateString).format('YYYY-MM-DD HH:mm:ss')
        },
        updateCardStatus() {
            if (this.card.status == 0) {
                let data = {
                    status: 1
                }
                api.updateCardStatus(this.card.id, data).then(() => {
                    this.$refs.btn.style.backgroundColor = '#67C23A'
                    this.$refs.btn.style.borderColor = '#67C23A'
                    
                })
            } else if (this.card.status == 1) {
                let data = {
                    status: 0
                }
                api.updateCardStatus(this.card.id, data).then(() => {
                    this.$refs.btn.style.backgroundColor = '#F56C6C'
                    this.$refs.btn.style.borderColor = '#F56C6C'
                })
            }
        },
        addCard() {
            if (this.cardName !== '') {
                let data = {
                    title: this.cardName,
                    index: this.directory.cards.length + 1,
                    directory_id: this.directory.id
                }
                api.storeCard(data).then(() => {
                    this.reloadDirectories()
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
        getCardDetail(id) {
            api.getCardDetail(id).then((response) => {
                this.card = response.data.data
            })
        },
        updateCardTitle() {
            if (this.card.title != '') {
                let data = {
                    title: this.card.title
                }
                api.editCard(this.card.id, data).then(() => {
                    this.$refs.cardTitle.blur()
                    this.$message({
                        message: 'Update card success!',
                        type: 'success'
                    })
                })
            } else {
                return false
            }
        },

        showFormEditCardDescription() {
            if (this.card.description) {
                this.$refs.cardDescription.style.display = 'none'
                this.$refs.formEditCardDescription.style.display = 'block'
            } else {
                this.$refs.btnAddCardDescription.style.display = 'none'
                this.$refs.formEditCardDescription.style.display = 'block'
            }
        },
        cancelUpdateCardDescription () {
            if (this.card.description) {
                this.$refs.cardDescription.style.display = 'block'
                this.$refs.formEditCardDescription.style.display = 'none'
            } else {
                this.$refs.btnAddCardDescription.style.display = 'block'
                this.$refs.formEditCardDescription.style.display = 'none'
            }
        },
        updateCardDescription() {
            let data = {
                description: this.card.description
            }
            api.editCard(this.card.id, data).then(() => {
                this.$message({
                    message: 'Update card desciption success!',
                    type: 'success'
                });
                this.getCardDetail(this.card.id)
                if (this.card.description) {
                    this.$refs.cardDescription.style.display = 'block'
                    this.$refs.formEditCardDescription.style.display = 'none'
                } else {
                    this.$refs.btnAddCardDescription.style.display = 'block'
                    this.$refs.formEditCardDescription.style.display = 'none'
            }
            })
        },
        deleteCard() {
            api.destroyCard(this.card.id).then(() => {
                this.$message({
                    message: 'Delete success!',
                    type: 'success'
                });
                this.reloadDirectories()
                this.dialogcardDetail = false
            })
        },

        //Labels
        addLabel() {
            if (this.labelName && this.labelColor) {
                let data = {
                    name: this.labelName,
                    color: this.labelColor
                }
                api.createLabel(this.card.id, data).then(() => {
                    this.labelName = ''
                    this.labelColor = ''
                    this.$refs.inputLabel.style.background = '#ffffff'
                    this.$refs.inputLabel.style.color = '#000000'
                    this.getCardDetail(this.card.id)
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
                this.getCardDetail(this.card.id)
                this.reloadDirectories()
                this.$message({
                    message: 'Create due date success!',
                    type: 'success'
                });
            })
        },
        handleChangeDeadlineStatus() {
            let isChecked = this.$refs.deadlineCheck.checked;
            if (isChecked) {
                let data = {
                    status: 3
                }
                api.updateCardStatus(this.card.id, data).then(() => {
                    this.getCardDetail(this.card.id)
                    this.reloadDirectories()
                })
            } else {
                this.checkStatusDeadline(this.card.deadline);
            }
        },
        checkStatusDeadline(deadline) {
            let deadTime = this.formatDate(deadline)
            let status = this.checkStatus(deadTime)
            let data = {
                status: status
            }
            console.log(this.card.id);
            api.cardDeadline(this.card.id, data).then(() => {
                this.reloadDirectories();
                this.getCardDetail(this.card.id);
            })
        },
        checkStatus(time){
            let status = 0;
            let now = moment().format('YYYY-MM-DD');
            if (time < now) {
                status = 1;
            } else if (moment(time).format('YYYY-MM-DD') == now) {
                status = 2;
            }
            return status;
        },

        //Checklist
        handleAddCheckList() {
            let data = {
                title: this.checklistName,
                card_id: this.card.id
            }
            api.storeChecklist(data).then(() => {
                this.getCardDetail(this.card.id)
            })
        },
        handleDeleteChecklist(id) {
            api.deleteChecklist(id).then(() => {
                this.getCardDetail(this.card.id)
                this.reloadDirectories()
            })
        },
        openAddSubCheckList() {
            this.addSubCheckList = true
            console.log(this.directory.cards);
        },
        closeAddSubCheckList() {
            this.addSubCheckList = false
        },
        handleCreateSubCheckList(id) {
            let data = {
                title: this.subChecklistName,
                check_list_id: id
            }
            api.storeChecklistChild(data).then(() => {
                this.reloadDirectories();
                this.getCardDetail(this.card.id);
                this.subChecklistName = '';
                this.$message({
                    message: 'Create checklist child success',
                    type: 'success'
                });
            })
        },
        getNameRef(index,indexChild){
            return index + '' +  indexChild;
        },
        changeStatusChecklistChild(index, indexChild, id) {
            let refName = index + '' +  indexChild
            let isChecked = this.$refs.[refName][0].checked
            let status = 0
            if (isChecked) {
                status = 1
            }
            let data = {
                status: status
            }
            api.updateStatusChecklistChild(id, data).then(() => {
                this.reloadDirectories()
            })
        },
        checkPercentComplete(array) {
            let totalChild = array.length;
            let flag = 0;
            array.forEach((i) => {
                if (i.status == 1) {
                    flag = flag + 1;
                }
            })
            return Math.ceil(flag / totalChild * 100);
        },
        handleDeleteChecklistChild(id) {
            api.destroyChecklistChid(id).then(() => {
                this.reloadDirectories()
                this.getCardDetail(this.card.id)
                this.$message({
                    message: 'Delete checklist child success',
                    type: 'success'
                });
            })
        },
        

        //UPLOAD FILE
        handleUploadFile(e) {
            let file =  e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)
            api.uploadFileForCard(formData, this.card.id).then(() => {
                this.getCardDetail(this.card.id)
            })
        },

        //DRAGGABLE
        changeCard(event){
            if (event.from === event.to) {
                let data = {
                    'index': event.newIndex,
                }
                api.changeIndexCard(data, event.clone.getAttribute('id')).then((response) => {
                    if (response) {
                        this.reloadDirectories();
                    }
                })
            } else {
                let data = {
                    'index': event.newIndex,
                    'directory_id': event.to.getAttribute('id'),
                }
                api.changeIndexCardFromDirectory(data, event.clone.getAttribute('id')).then((response) => {
                    if (response) {
                        this.reloadDirectories();
                    }
                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/directory.scss'
</style>