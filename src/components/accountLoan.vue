<template>
	<div>
		<div>
			<label style="margin-left: 10px;">账户：</label>
			<el-input v-model="accountID" style="width: 300px;"></el-input>
			<el-button type="primary" @click="list_button()" icon="el-icon-search" style="background: #24375E;border: 0px ;margin-left: 10px;">搜索</el-button>
		</div>
		<el-table :data="loanList" style="width: 100%">
			<el-table-column prop="account" label="账号" width="200">
			</el-table-column>
			<el-table-column prop="amount" label="数额" width="150">
			</el-table-column>
			<el-table-column prop="loanDate" label="贷款时间" width="250">
			</el-table-column>
			<el-table-column label="查看" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="getDetail(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>

			<el-table-column label="还款" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="rea(scope.row),dialogVisible_repay = true">还款</el-button>
				</template>
			</el-table-column>

		</el-table>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<label>账号：</label><span>{{account}}</span></br></br>
			<label>金额：</label><span>{{amount}}</span></br></br>
			<label>贷款时间：</label><span>{{loanDate}}</span></br></br>
			<label>应还款时间：</label><span>{{scheduledPayment}}</span></br></br>
			<label>保证类型：</label><span>{{guaranteeType}}</span></br></br>
			<label>保证文件：</label><span>{{guaranteeInfo}}</span></br></br>
			<label>用途：</label><span>{{usage}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="提示" :visible.sync="dialogVisible_repay" width="30%">
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
			<el-button @click='submit()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认还款</el-button>
		</el-dialog>

	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				id: null,
				pwd: null,
				status: null,
				msg: null,
				websock: null,
				amount: null,
				loanList: [],
				accountID: '',
				loanPage: null,
				currentLoanPage: 1,
				dialogVisible: false,
				content: null,
				author: null,
				dialogVisible_repay: false,
				title_detail: null,
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
			}
		},
		methods: {

			list_button() {
				axios.get('/api/loanSearch/loan', {
						params: {
							accountID: this.accountID,
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.loanList = eval(res.data);
						this.currentLoanPage = 1;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});

			},
			getDetail(row) {
				this.dialogVisible = true;
				this.account = row.account;
				this.amount = row.amount;
				this.loanDate = row.loanDate;
				this.rate = row.rate;
				this.scheduledPayment = row.scheduledPayment;
				this.guaranteeType = row.guaranteeType;
				this.guaranteeInfo = row.guaranteeInfo;
				this.usage = row.usage;
			},
			rea(row){
				this.id = row.id;
			},
			submit(){
				var parmas = new URLSearchParams();
				parmas.append("id",this.id);
				parmas.append("pwd",this.pwd);
				axios.post('/api/loan/repay', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "REPAYMENT_FAILED"){
							this.$alert('还款失败', '提示', {
							         confirmButtonText: '确定',
							       });
						}
						else{
							this.$alert('还款成功', '提示', {
							         confirmButtonText: '确定',
							       });
						}
				
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			}

		},
		beforeMount: function() {

		}
	}
</script>

<style>

</style>
