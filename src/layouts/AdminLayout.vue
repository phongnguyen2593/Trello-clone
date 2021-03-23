<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
import api from '../api'
import {mapMutations} from 'vuex'

export default {
    name: 'AdminLayout',
    methods: {
      ...mapMutations('auth', ['updateAuthUser']),
    },
    mounted() {
        api.getAuthUser().then((response) => {
            if (response) {
                this.updateAuthUser(response.data)
            }
        })
    }
}
</script>
