<template>
    <div class="chat_commento">
        <div class="chat_top"><a href="/friends">&lt;&nbsp;&nbsp;&nbsp;&nbsp;</a>{{targetName}}</div>
        <div class="line"></div>
        <div class="chat_middle" id="haa" ref="chatHistory">
            <div v-for="v in messageShow" :key="v.id" :class="v.cls_chat">
                <div :class="v.cls_item1">{{v.cls_name}}</div>
                <div :class="v.cls_item2">
                    <div :class="v.cls_time">{{new Date(v.send_time).toLocaleString()}}</div>
                    <div :class="v.cls_content">
                        {{v.content}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="fixed-bottom" id="chat-input">
        <van-cell-group inset>
            <van-field v-model="message" rows="5" type="textarea" maxlength="512" placeholder="(●'◡'●)" />
            <van-button @click="sendMessage" type="default" color="linear-gradient(to right, #08F5D5, #E915B8)" block>send</van-button>
        </van-cell-group>
    </div>
</template>

<script setup>
    import { computed, ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { hostname, request } from "../utils/request";
    import '../assets/chat.css';

    // 模板调整
    const chatHistory = ref(null);
    const isScroll = ref(false);
    onMounted( _ => {
        // 设定记录自动高度
        let height = document.getElementById('chat-input').clientHeight / (document.body.clientHeight-100) * 100;
        chatHistory.value.style.height = (100 - height)+'%';
    });
    

    // 消息系列
    const message = ref('');
    let messageList = ref([]);
    const targetId = useRoute().params.id;
    const targetName = ref('');
    request('user/'+targetId, 'GET').then(r => (targetName.value = r.data.name, true) || (r.message && alert(r.message), true) || alert('登录失败'));
    const fromName = ref('');
    request('user/'+localStorage.getItem('userId'), 'GET').then(r => (fromName.value = r.data.name, true) || (r.message && alert(r.message), true) || alert('登录失败'));
    const messageShow = computed(_ => {
        const currentUserId = localStorage.getItem('userId');
        let infos = [];
        for (let x of messageList.value) {
            let iscurr = x.from_id==currentUserId;
            x['cls_chat'] = iscurr ? 'chat_right' : 'chat_left clearfix';
            x['cls_item1'] = iscurr ? 'chat_right_item_1' : 'chat_left_item_1';
            x['cls_name'] = iscurr ? fromName : targetName;
            x['cls_item2'] = iscurr ? 'chat_right_item_2' : 'chat_left_item_2';
            x['cls_time'] = iscurr ? 'chat_right_time' : 'chat_time';
            x['cls_content'] = iscurr ? 'chat_right_content' : 'chat_left_content';
            infos.push(x);
        }
        return infos;
    });
    // 有新消息滑动翻页
    watch(messageList.value, (x, y) => {
        if (chatHistory.value.scrollHeight-chatHistory.value.clientHeight-1 > chatHistory.value.scrollTop) {
            chatHistory.value.scrollTop += chatHistory.value.scrollHeight;
        }
    });

    // WebSocket
    let conn = new WebSocket(`ws://${hostname}:5555/api/v1/message/send?userId=${localStorage.getItem('userId')}&token=${localStorage.getItem('token')}`);
    conn.onopen = e => {
        console.log('ws:开启连接');
    };
    conn.onclose = e => {
        if (e.wasClean) {
            console.log(`ws:连接关闭`);
            alert(e.reason);
        } else {
            console.log('ws:连接断开');
        }
    };
    conn.onerror = e => {
        console.log(`ws:错误, ${e.message}`);
    };

    // 发送内容
    let sendMessage = _ => {
        let date = new Date();
        let content = {
            from_id: parseInt(localStorage.getItem('userId')),
            target_id: parseInt(targetId), 
            type: 1,
            content: message.value,
            send_time: date
        };
        conn.send(JSON.stringify(content));
        content.send_time = date.toLocaleString();
        messageList.value.push(content)
        message.value = "";
    }
    conn.onmessage = e => {
        e = JSON.parse(e.data);
        messageList.value.push(e);
    }
    const closeMessage = _ => {
        conn.close(1000, "关闭");
    }
</script>