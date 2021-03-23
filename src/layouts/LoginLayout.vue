<template>
    <div class="container" id="container">
        <div class="subContainer">
            <div class="logoContainer">
                <img src="@/assets/images/logo.png" alt="Logo" class="logo">
                <img src="@/assets/images/logo-text.png" alt="Text" class="text">
            </div>
            <div class="formContainer">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginLayout',
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/login-layout.scss';
</style>
