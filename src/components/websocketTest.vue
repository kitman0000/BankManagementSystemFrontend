<template>
  <div class="test">
		<el-input v-model="mes"></el-input>
		<el-button @click='send()'></el-button>
		<el-input v-model="mes"></el-input>
  </div>
</template>

<script>
  export default {
    name : 'test',
    data() {
      return {
        websock: null,
		mes:null,
		getmes:null,
      }
    },
    created() {
      this.initWebSocket();
    },
    destroyed() {
      
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://localhost:4649/Service";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        
      },
      websocketonerror(){//连接建立失败重连
        
      },
      websocketonmessage(e){ //数据接收
        this.getmes = e.data;
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        
      },
	  send(){
		  this.websocketsend(this.mes);
		  console.log(this.msg);
	  }
    },
  }
</script>
<style lang='less'>
 
</style>
