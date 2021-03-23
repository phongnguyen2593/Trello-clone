<template>
    <div id="app">
        <AdminLayout v-if="isAuthenticated" />
        <LoginLayout v-else />
    </div>
</template>

<script>
    import AdminLayout from './layouts/AdminLayout'
    import LoginLayout from './layouts/LoginLayout'
    import {mapState} from 'vuex'

    export default {
        name: 'App',
        computed: {
            ...mapState('auth', ['isAuthenticated']),
        },
        components: {
            AdminLayout,
            LoginLayout,
        }
    }
</script>

<style lang="scss">
@import "./assets/styles/variables";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $colorDefault;
    ::-webkit-scrollbar {
        height: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(194, 191, 191, 0.65);;
        border-radius: 6px;

    }
    ::-webkit-scrollbar-track-piece {
        background: rgba(0,0,0,.15);
    }
    height: 100vh;
    font-family: Arial, Helvetica, sans-serif !important;
}

body {
    margin: 0;
}
</style>
