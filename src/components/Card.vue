<template>
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
            <span class="card-title" @click="emitCardDetail()">{{ card.title }}</span>
            <div class="badges">
                <el-button
                    ref="btn"
                    v-if="(formatDate(card.deadline) < moment().format('YYYY-MM-DD HH:mm:ss')) && card.status == 0"
                    type="danger"
                    icon="el-icon-time"
                    @click="updateCardStatus">
                    {{ fomatDateCard(card.deadline) }}
                </el-button>
                <el-button
                    ref="btn"
                    v-else-if="card.status == 1"
                    type="success"
                    icon="el-icon-time">
                    {{ fomatDateCard(card.deadline) }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import api from '@/api'
export default {
    name: "Card",
    props: ['card'],
    methods: {
        emitCardDetail() {
            let cardDetail = this.card
            console.log(this.card);
            this.$emit('emitCardDetail', cardDetail)
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
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/card.scss';
</style>