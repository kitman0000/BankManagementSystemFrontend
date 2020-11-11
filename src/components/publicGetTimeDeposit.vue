<template>
	<div>
		<span class="demonstration">账号：</span>
		<el-input placeholder="请输入查询的账号" v-model="account" style="width: 15%; margin: 20px;"></el-input>
		<el-button type="primary" @click='search_button()' icon="el-icon-search">搜索</el-button>
		</br>
		<el-table style="width: 100%;" :data="inf">
			<el-table-column prop="accountID" label="账号" width="250">
			</el-table-column>
			<el-table-column prop="amount" label="金额" width="150">
			</el-table-column>
			<el-table-column prop="depositDate" label="存款时间" width="200">
			</el-table-column>
			<el-table-column prop="rate" label="利率" width="80">
			</el-table-column>
			<el-table-column prop="scheduledWithdrawDate" label="预计到期时间" width="200">
			</el-table-column>
			<el-table-column label="操作" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="be(scope.row)">定期转活期</el-button>
				</template>
				<template slot-scope="scope">
					<el-button type="text" @click="twd(scope.row)">定期取款</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
			<el-form label-width="120px">
				<el-form-item label="账户密码:">
					<span v-if="!pwd">密码未输入</span>
					<span v-if="pwd">密码已输入</span>
				</el-form-item>
				<el-form-item label="密码器指令:">
					<el-select v-model="msg" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-button @click='send()' type="primary" style="border: 0px;position: relative;margin-left: 15px;">指令发送</el-button>
				</el-form-item>
				<el-form-item label="密码器状态:">
					<el-link type="primary">{{status}}</el-link>
				</el-form-item>
			</el-form>

			<el-button @click='TimeToDemand()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认</el-button>
		</el-dialog>
		
		<el-dialog title="提示" :visible.sync="dialogVisible1" width="70%">
			<el-form label-width="120px">
				<el-form-item label="账户密码:">
					<span v-if="!pwd">密码未输入</span>
					<span v-if="pwd">密码已输入</span>
				</el-form-item>
				<el-form-item label="密码器指令:">
					<el-select v-model="msg" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-button @click='send()' type="primary" style="border: 0px;position: relative;margin-left: 15px;">指令发送</el-button>
				</el-form-item>
				<el-form-item label="密码器状态:">
					<el-link type="primary">{{status}}</el-link>
				</el-form-item>
			</el-form>
		
			<el-button @click='WithDraw()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认</el-button>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				accountID: null,
				amount: null,
				depositDate: null,
				rate: null,
				getInfo: false,
				account: null,
				inf: [],
				dialogVisible: false,
				pwd: null,
				dialogVisible1: false,
			}
		},
		methods: {
			search_button() {
				axios.get('/api/publicTime/deposit', {
						params: {
							accountID: this.account,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.inf = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			be(row) {
				this.account = row.accountID;
				this.id = row.id;
				this.dialogVisible = true;
			},
			twd(row) {
				this.account = row.accountID;
				this.id = row.id;
				this.dialogVisible1 = true;
			},
			TimeToDemand() {
				axios.get('/api/publicTime/demand', {
						params: {
							account: this.account,
							id: this.id,
							pwd: this.pwd
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.data.result == "WITHDRAW_SUCCESS") {
							this.$alert('成功', '提示', {
								confirmButtonText: '确定',
							});
							window.location.reload();
						}
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			WithDraw() {
				axios.get('/api/publicTime/withdraw', {
						params: {
							account: this.account,
							id: this.id,
							pwd: this.pwd
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.data.result == "WITHDRAW_SUCCESS") {
							this.$alert('成功', '提示', {
								confirmButtonText: '确定',
							});
							window.location.reload();
						}
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			initWebSocket() { //初始化weosocket
				const wsuri = "ws://localhost:4649/Service";
				this.websock = new WebSocket(wsuri);
				this.websock.onmessage = this.websocketonmessage;
				this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { //连接建立之后执行send方法发送数据
				this.status = '密码器连接成功'
			},
			websocketonerror() { //连接建立失败重连
				this.status = '密码器未连接，请重启密码器并刷新页面';
			},
			websocketonmessage(e) { //数据接收
				this.pwd = e.data;
			},
			websocketsend(Data) { //数据发送
				this.websock.send(Data);
			},
			websocketclose(e) { //关闭
				this.status = '密码器连接断开';
			},
			send() {
				this.websocketsend(this.msg);
			},
		},
		created() {
			this.initWebSocket();
		},
		destroyed() {
			this.websock.close() //离开路由之后断开websocket连接
		},
	}
</script>
