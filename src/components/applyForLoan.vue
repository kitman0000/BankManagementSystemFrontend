<template>
	<div>
		<div style="display: inline-block;width: 50%;float: left;">
		<el-form label-width="100px">
			<el-form-item label="账户ID:">
				<el-input v-model="accountID" style="width: 300px;">
				</el-input>
			</el-form-item>
			<el-form-item label="贷款类型:">
				<el-input v-model="personOrPublic" :disabled="true" style="width: 120px;">
				</el-input>
			</el-form-item>
			<el-form-item label="贷款金额:">
				<el-input v-model="amount" style="width: 150px;">
				</el-input>
			</el-form-item>
			<el-form-item label="贷款期限(月):">
				<el-input v-model="month" style="width: 80px;">
				</el-input>
			</el-form-item>
			<el-form-item label="担保类型:">
				<el-select v-model="guaranteeType" placeholder="请选择">
					<el-option v-for="item in GType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="担保文件:">
					<el-button type="primary" icon="el-icon-plus" style="border: 0px ;" @click='dialogVisible = true'>填写文件</el-button>
			</el-form-item>
			<el-form-item label="贷款日期:">
				<el-date-picker v-model="loanDate" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="用途:">
				<el-input v-model="usage" style="width: 300px;">
				</el-input>
			</el-form-item>
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
		<el-button @click='applyLoan()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认申请</el-button>
		</div>
		<div style="display: inline-block;width: 50%;">
			<h2>{{rateType}}</h2>
			<el-table :data="tableData2" style="width: 100%"  >
				<el-table-column prop="startMonth" label="从" width="80">
				</el-table-column>
				<el-table-column prop="endMonth" label="至" width="80">
				</el-table-column>
				<el-table-column prop="rate" label="利率" width="220">
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
			<!-- 抵押 -->
			<div v-if="guaranteeType == 1">
			<el-form ref="form" :model="form" label-width="100px">
			  <el-form-item label="抵押人:">
			    <el-input v-model="form.name" style="width: 100px;"></el-input>
			  </el-form-item>
			  <el-form-item label="证件类型:">
			    <el-input v-model="form.type" style="width: 150px;"></el-input>
			  </el-form-item>
			  <el-form-item label="证件号码:">
			    <el-input v-model="form.IDnumber" style="width: 300px;"></el-input>
			  </el-form-item>
			  <el-form-item label="移动电话:">
			    <el-input v-model="form.phonenumber" style="width: 250px;"></el-input>
			  </el-form-item>
			  <el-form-item label="抵押物地址:">
			    <el-input v-model="form.address" style="width: 350px;"></el-input>
			  </el-form-item>
			  <el-form-item label="产权证号:">
			    <el-input v-model="form.certificateNumber" style="width: 300px;"></el-input>
			  </el-form-item>
			  <el-form-item label="抵押物价值:">
			    <el-input v-model="form.value" style="width: 150px;"></el-input>
			  </el-form-item>
			 </el-form>
			 </div>
			 <!-- 质押 -->
			 <div  v-if="guaranteeType == 2">
			 <el-form ref="form" :model="form" label-width="80px">
			   <el-form-item label="出质人:">
			     <el-input v-model="form.name"></el-input>
			   </el-form-item>
			   <el-form-item label="证件类型:">
			     <el-input v-model="form.type"></el-input>
			   </el-form-item>
			   <el-form-item label="证件号码:">
			     <el-input v-model="form.IDnumber"></el-input>
			   </el-form-item>
			   <el-form-item label="移动电话:">
			     <el-input v-model="form.phonenumber"></el-input>
			   </el-form-item>
			   <el-form-item label="通讯地址:">
			     <el-input v-model="form.address"></el-input>
			   </el-form-item>
			   <el-form-item label="质押物品:">
			     <el-input v-model="form.goods"></el-input>
			   </el-form-item>
			   <el-form-item label="物品总价值:">
			     <el-input v-model="form.value"></el-input>
			   </el-form-item>
			  </el-form>
			  </div>
			   <!-- 保证 -->
			  <div  v-if="guaranteeType == 3">
			  <el-form ref="form" :model="form" label-width="80px">
			    <el-form-item label="保证人:">
			      <el-input v-model="form.name"></el-input>
			    </el-form-item>
				<el-form-item label="证件类型:">
				  <el-input v-model="form.type"></el-input>
				</el-form-item>
				<el-form-item label="证件号码:">
				  <el-input v-model="form.IDnumber"></el-input>
				</el-form-item>
				<el-form-item label="通讯地址:">
				  <el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="联系电话:">
				  <el-input v-model="form.phonenumber"></el-input>
				</el-form-item>
			   </el-form>
			   </div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				pwd: null,
				status: null,
				msg: 'INPUT',
				websock: null,
				accountID: null,
				amount: null,
				type: null,
				month: null,
				rate: null,
				loanDate: null,
				dialogVisible:false,
				usage: null,
				rateType:null,
				guaranteeType: null,
				fileList: [],
				tableData2:[],
				path: '/loanGuaranteeInfo/',
				options: [{
						label: '请输入密码',
						value: 'INPUT'
					},
					{
						label: '重置',
						value: 'RESET'
					},
					{
						label: '操作成功',
						value: 'SUCCESS'
					},
					{
						label: '密码错误',
						value: 'FAILED'
					}
				],
				Type: [{
						id: 1,
						label: '个人贷款'
					},
					{
						id: 2,
						label: '公司贷款'
					},
				],
				GType: [{
						id: 1,
						label: '抵押'
					},
					{
						id: 2,
						label: '质押'
					},
					{
						id: 3,
						label: '保证'
					},
				],
				form:{
					name:null,
					type:null,
					IDnumber:null,
					phonenumber:null,
					address:null,
					certificateNumber:null,
					goods:null,
					value:null,
				},
				personOrPublic:null,
			}
		},
		methods: {
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
			sendFile() {
				var fileParmas = new FormData();

				fileParmas.append('multipartFile', this.fileList[0].raw);
				fileParmas.append('path', this.path);
				axios.post('/api/file/file', fileParmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.$alert('文件上传成功', '提示', {
							confirmButtonText: '确定',
						});
						this.guaranteeInfo = this.path + res.data;
					});
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			applyLoan() {
				var parmas = new URLSearchParams();
				this.guaranteeInfo = JSON.stringify(this.form);
				parmas.append("accountID", this.accountID);
				parmas.append("amount", this.amount);
				parmas.append("guaranteeType", this.guaranteeType);
				parmas.append("guaranteeInfo", this.guaranteeInfo);
				parmas.append("loanDate", this.loanDate);
				parmas.append("month", this.month);
				parmas.append("pwd", this.pwd);
				parmas.append("type", this.type);
				parmas.append("usage", this.usage);
				axios.post('/api/loan/request', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.data == "LOAN_SUCCESS") {
							this.$alert('申请成功', '提示', {
								confirmButtonText: '确定',
							});
							this.websock.send("SUCCESS");
						} else {
							this.$alert('申请失败', '提示', {
								confirmButtonText: '确定',
							});
							this.websock.send("FAILED");
						}
					}).catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getType(){
				this.type = this.$route.query.type;
				if(this.type == 1){
					this.personOrPublic = '个人贷款';
					axios.get('/api/rate/personalLoanRate', {
						params: {
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.tableData2 = eval(res.data);
						this.rateType = "个人贷款利率"
					})
					.catch(err=>	 {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
				}
				else if(this.type == 2){
					this.personOrPublic = '对公贷款';
					axios.get('/api/rate/publicLoanRate', {
						params: {
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.tableData2 = eval(res.data);
						this.rateType = "对公贷款利率"
					})
					.catch(err=>	 {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
				}
			}
		},
		beforeMount: function() {
			this.getType();
		},
		created() {
			this.initWebSocket();
		},
		destroyed() {
			this.websock.close() //离开路由之后断开websocket连接
		},
	}
</script>

<style>
</style>
