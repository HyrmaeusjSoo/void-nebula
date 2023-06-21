<template>
    <div class="top-con">
        <van-cell-group inset>
            <img style="width: 100%;" src="../../public/nebula.jpeg"/>
        </van-cell-group>
    </div>
    <div class="fixed-bottom">
        <van-cell-group inset>
            <form v-show="!signed">
                <van-field v-model="account" label="账号" autocomplete="off" placeholder="请输入账号" />
                <van-field v-model="password" type="password" label="密码" autocomplete="off" placeholder="请输入密码" />
            </form>
            <van-button type="default" @click="login" v-show="!signed" color="linear-gradient(to right, #14EE5C, #131AE5)" block>登录</van-button>
            <van-button type="default" :disabled="!signed" color="linear-gradient(to right, #08F5D5, #E915B8)" to="/friends" block>chat</van-button>
            <van-button type="default" :disabled="!signed" color="linear-gradient(to right, #f1f2b5 0%, #bbc1bf 19%, #eea2a2 42%, #b49fda 79%, #18545a 100%)" to="/astro" block>astro</van-button>
        </van-cell-group>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { request } from "../utils/request";

    const account = ref('');
    const password = ref('');

    let signed = ref(localStorage.getItem('token') && Date.now() < localStorage.getItem('expireTime'));
    const login = _ => {
        request('user/login', 'POST', {account: account.value, password: password.value}).then(r => 
            (r.data && r.data.userId && r.data.token && r.data.expireTime && (
                localStorage.setItem('userId', r.data.userId),
                localStorage.setItem('token', r.data.token),
                localStorage.setItem('expireTime', r.data.expireTime),
                document.cookie = 'userId='+r.data.userId,
                document.cookie = 'token='+r.data.token,
                signed.value = true,
                true
            )) || (r.message && alert(r.message), true) || alert('登录失败'));
    }
</script>
