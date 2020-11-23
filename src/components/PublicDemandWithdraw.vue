<template>
	<div>
		<el-form label-width="120px">
			<el-form-item label="账号:">
				<el-input v-model="accountID" style="width: 300px;">
				</el-input>
			</el-form-item>
			<el-form-item label="金额:">
				<el-input v-model="amount"  style="width: 150px;">
				</el-input>
			</el-form-item>
			<el-form-item label="账户密码:">
				<span v-if="!pwd">密码未输入</span>
				<span v-if="pwd">密码已输入</span>
			</el-form-item>
			<el-form-item label="密码器指令:">
				<el-select v-model="msg" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				<el-button @click='send()' type="primary"  style="border: 0px;position: relative;margin-left: 15px;">指令发送</el-button>
			</el-form-item>
			<el-form-item label="密码器状态:">
				<el-link type="primary">{{status}}</el-link>
			</el-form-item>
		</el-form>
		<el-button @click='submit()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认活期取款</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				pwd:null,
				status:null,
				msg:'INPUT',
				websock: null,
				accountID:null,
				amount:null,
				options:[
					{
						label:'请输入密码',
						value:'INPUT'
					},
					{
						label:'重置',
						value:'RESET'
					},
					{
						label:'操作成功',
						value:'SUCCESS'
					},
					{
						label:'密码错误',
						value:'FAILED'
					}
				],
			}
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
			  this.status = '密码器连接成功'
			},
			websocketonerror(){//连接建立失败重连
			  this.status = '密码器未连接，请重启密码器并刷新页面';
			},
			websocketonmessage(e){ //数据接收
			  this.pwd = e.data;
			},
			websocketsend(Data){//数据发送
			  this.websock.send(Data);
			},
			websocketclose(e){  //关闭
			 this.status = '密码器连接断开';
			},
			send(){
				this.websocketsend(this.msg);
			},
			submit(){
				var parmas = new URLSearchParams();
				parmas.append("accountID",this.accountID);
				parmas.append("amount",this.amount);
				parmas.append("pwd",this.pwd);
				axios.post('/api/publicDemand/withDraw', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "DEMAND_WITHDRAW_SUCCESS"){
							this.$alert('活期取款成功', '提示', {
							         confirmButtonText: '确定',
							       });
								this.websock.send("SUCCESS");
						}
						else{
							this.$alert('取款失败', '提示', {
							         confirmButtonText: '确定',
							       });
							this.websock.send("FAILED");
						}
				
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			}
		},
		created() {
		  this.initWebSocket();
		},
		destroyed() {
		  this.websock.close() //离开路由之后断开websocket连接
		},
	}
</script>
