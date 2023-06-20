<template>
    <div style="padding-top: 5px;padding-bottom: 5px;">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item.name" :to="'/chat/'+item.id" />
        </van-list>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { request } from "../utils/request";
    import { obj2UrlQuery } from "../utils/rium";

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    let page = 1;
    let size = 15;

    const onLoad = () => {
        request('user'+obj2UrlQuery({page, size}), 'GET').then(r => {
            if (page * size >= r.data.total) {
                finished.value = true;
            }

            for (const x of r.data.list) {
                list.value.push(x);
            }
            loading.value = false;
            page++;
        });
    };
</script>