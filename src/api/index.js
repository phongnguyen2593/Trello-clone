import axios from 'axios'
import store from "../store";
import router from "../router";

const baseUrl = process.env.VUE_APP_BASE_URL;

export const apiAxios = axios.create({
    baseURL:`${baseUrl}/api`,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

apiAxios.interceptors.request.use(config => {
    let token = store.state.auth.accessToken
    if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
    }
        return config
    }, error => {
        return Promise.reject(error)
})

apiAxios.interceptors.response.use(undefined, (error) => {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && router.currentRoute.name !== 'Login') {
            store.commit('auth/updateLoginStatus', false)
            store.commit('auth/updateAuthUser', {})
            store.commit('auth/updateAccessToken', '')
            return router.push({name: 'Login'})
        }
    }
})

export default {
    //AUTH
    getAuthUser () {
        return apiAxios({
            method: 'get',
            url: '/auth/me'
        })
    },
    login (data) {
        return apiAxios({
            method: 'post',
            url: 'auth/login',
            data: data
        })
    },
    register (data) {
        return apiAxios({
            method: 'post',
            url: 'auth/register',
            data: data
        })
    },

    //DIRECTORY
    getDirectories() {
        return apiAxios({
            method: 'get',
            url: '/directories'
        })
    },
    storeDirectory(data) {
        return apiAxios({
            method: 'post',
            url: '/directories',
            data: data,
        })
    },
    
    updateDirectory(data, id) {
        return apiAxios({
            method: 'put',
            url: '/directories/' + id,
            data: data,
        })
    },
    destroyDirectory(id) {
        return apiAxios({
            method: 'delete',
            url: '/directories/' + id
        })
    },
    changeIndexDirectory(data, id){
        return apiAxios({
            method: 'put',
            url: '/directories/' + id + '/index',
            data: data,
        })
    },

    //CARD
    getCardDetail(id) {
        return apiAxios({
            method: 'get',
            url: '/cards/' + id,
        })
    },
    storeCard(data) {
        return apiAxios({
            method: 'post',
            url: '/cards',
            data: data
        })
    },
    editCard(id, data) {
        return apiAxios({
            method: 'put',
            url: '/cards/' + id,
            data: data
        })
    },
    cardDeadline(id, data) {
        return apiAxios({
            method: 'put',
            url: '/cards/'+ id +'/change-status-deadline',
            data: data
        })
    },
    updateCardStatus(id, data) {
        return apiAxios({
            method: 'put',
            url: '/cards/'+ id +'/change-status',
            data: data
        })
    },
    destroyCard(id) {
        return apiAxios({
            method: 'delete',
            url: '/cards/'+ id,
        })
    },
    storeLabel(id, data) {
        return apiAxios({
            method: 'post',
            url: '/cards/' + id + '/label',
            data: data
        })
    },

    //CHECKLIST
    storeChecklist(data) {
        return apiAxios({
            method: 'post',
            url: '/check-lists',
            data: data
        })
    },
    deleteChecklist(id) {
        return apiAxios({
            method: 'delete',
            url: '/check-lists/' + id,
        })
    },
    storeChecklistChild(data) {
        return apiAxios({
            method: 'post',
            url: '/check-list-childs',
            data: data
        })
    },
    updateStatusChecklistChild(id, status) {
        return apiAxios({
            method: 'put',
            url: '/check-list-childs/' + id + '/change-status',
            status: status
        })
    },
    destroyChecklistChid(id){
        return apiAxios({
            method: 'delete',
            url: '/check-list-childs/' + id
        })
    },

    //FILE
    uploadFileForCard(data, id){
        return apiAxios({
            method: 'post',
            url: '/cards/'+ id +'/upload-file',
            data: data,
        })
    },
    updateFile(data, id){
        return apiAxios({
            method: 'put',
            url: '/files/'+ id,
            data: data,
        })
    },
    
    // USER
    changePassword(data) {
        return apiAxios({
            method: 'put',
            url: '/users/password',
            data: data
        })
    },
    updateUserProfile(data){
        return apiAxios({
            method: 'post',
            url: '/users',
            data: data
        })
    },
}
