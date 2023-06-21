<template>
    <div class="chat_commento">
        <div class="top-con"></div>
        <div class="chat_middle" ref="frends">
            <van-cell-group inset>
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="item in list" :key="item" :title="item.name" :to="'/chat/'+item.id" />
                </van-list>
            </van-cell-group>
        </div>
    </div>
    <div class="fixed-bottom" id="bottom">
        <van-cell-group inset>
            <van-button type="default" color="linear-gradient(to right, #08F5D5, #E915B8)" to="/" block>index</van-button>
            <van-button type="default" color="linear-gradient(to right, #f1f2b5 0%, #bbc1bf 19%, #eea2a2 42%, #b49fda 79%, #18545a 100%)" to="/astro" block>astro</van-button>
        </van-cell-group>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { request } from "../utils/request";
    import { obj2UrlQuery } from "../utils/rium";
    import '../assets/chat.css';

    const frends = ref(null);
    onMounted( _ => {
        // 设定记录自动高度
        let height = (document.getElementById('bottom').clientHeight + document.getElementsByClassName('top-con')[0].clientHeight) / document.getElementById('app').clientHeight * 100;
        frends.value.style.height = `${96 - height}%`;
    });

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    let page = 1;
    let size = 15;

    const onLoad = () => {
        request('user'+obj2UrlQuery({page, size}), 'GET').then(r => {
            page * size >= r.data.total && (finished.value = true);
            r.data.list && (r.data.list.map(x => list.value.push(x)));
            loading.value = false;
            page++;
        });
    };
</script>