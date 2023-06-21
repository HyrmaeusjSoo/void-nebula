<template>
    <div class="chat_commento">
        <div class="top-con">
            <van-cell-group inset>
                <van-field center clearable v-model="name" autocomplete="off" placeholder="nebula">
                    <template #button>
                        <van-button size="small" type="default" :disabled="!name" @click="onLoad">Query</van-button>
                    </template>
                </van-field>
            </van-cell-group>
        </div>
        <div>&nbsp;</div>
        <div class="chat_middle" ref="ad">
            <van-cell-group v-for="v in astro" inset>
                <van-cell :title="v.C"/>
                <van-cell :title="v.E"/>
            </van-cell-group>
        </div>
    </div>
    <div class="fixed-bottom" id="bottom">
        <van-cell-group inset>
            <van-button type="default" color="linear-gradient(to right, #f1f2b5 0%, #bbc1bf 19%, #eea2a2 42%, #b49fda 79%, #18545a 100%)" to="/" block>index</van-button>
            <van-button type="default" color="linear-gradient(to right, #08F5D5, #E915B8)" to="/friends" block>chat</van-button>
        </van-cell-group>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { request } from "../utils/request";
    import '../assets/chat.css';

    const ad = ref(null);
    onMounted( _ => {
        // 设定记录自动高度
        let height = (document.getElementById('bottom').clientHeight + document.getElementsByClassName('top-con')[0].clientHeight) / document.getElementById('app').clientHeight * 100;
        ad.value.style.height = `${93 - height}%`;
    });

    const name = ref('暗物质');
    const astro = ref([]);

    const onLoad = () => {
        request(`astro/${name.value}`, 'GET').then(r => {
            astro.value = r.data.AstroDict;
        });
    };
</script>