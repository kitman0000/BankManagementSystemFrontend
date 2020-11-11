<template>
	<div>
		<div>
			<label style="margin-left: 10px;">账户：</label>
			<el-input v-model="accountID" style="width: 300px;"></el-input>
			<label style="margin-left: 10px;">还款状态：</label>
			<el-select v-model="repaymentStatus" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="primary" @click="list_button()" icon="el-icon-search" style="background: #24375E;border: 0px ;margin-left: 10px;">搜索</el-button>
		</div>
		<el-table :data="loanList" style="width: 100%">
			<el-table-column prop="account" label="账号" width="200">
			</el-table-column>
			<el-table-column prop="amount" label="数额" width="150">
			</el-table-column>
			<el-table-column prop="loanDate" label="贷款时间" width="250">
			</el-table-column>
			<el-table-column  label="贷款状态" width="80">
				<template slot-scope="scope">
					<span v-if='scope.row.repaymentStatus == 0'>未还款</span>
					<span v-if='scope.row.repaymentStatus == 1'>已还款</span>
				</template>
			</el-table-column>
			<el-table-column label="查看" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="getDetail(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>

		</el-table>
		<el-pagination @current-change="search_page" :current-page="currentLoanPage" layout=" prev, pager, next" :total="loanPage"
		 align='center'>
		</el-pagination>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<!-- 抵押 -->
			<div v-if="guaranteeType == 1">
				<el-form ref="form" :model="form" label-width="100px">
					<el-form-item label="抵押人:">
						<span style="width: 100px;">{{form.name}}</span>
					</el-form-item>
					<el-form-item label="证件类型:">
						<span style="width: 150px;">{{form.type}}</span>
					</el-form-item>
					<el-form-item label="证件号码:">
						<span style="width: 300px;">{{form.IDnumber}}</span>
					</el-form-item>
					<el-form-item label="移动电话:">
						<span style="width: 250px;">{{form.phonenumber}}</span>
					</el-form-item>
					<el-form-item label="抵押物地址:">
						<span style="width: 350px;">{{form.address}}</span>
					</el-form-item>
					<el-form-item label="产权证号:">
						<span style="width: 300px;">{{form.certificateNumber}}</span>
					</el-form-item>
					<el-form-item label="抵押物价值:">
						<span style="width: 150px;">{{form.value}}</span>
					</el-form-item>
				</el-form>
			</div>
			<!-- 质押 -->
			<div v-if="guaranteeType == 2">
				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="出质人:">
						<span v-model="form.name"></span>
					</el-form-item>
					<el-form-item label="证件类型:">
						<span v-model="form.type"></span>
					</el-form-item>
					<el-form-item label="证件号码:">
						<span v-model="form.IDnumber"></span>
					</el-form-item>
					<el-form-item label="移动电话:">
						<span v-model="form.phonenumber"></span>
					</el-form-item>
					<el-form-item label="通讯地址:">
						<span v-model="form.address"></span>
					</el-form-item>
					<el-form-item label="质押物品:">
						<span v-model="form.goods"></span>
					</el-form-item>
					<el-form-item label="物品总价值:">
						<span v-model="form.value"></span>
					</el-form-item>
				</el-form>
			</div>
			<!-- 保证 -->
			<div v-if="guaranteeType == 3">
				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="保证人:">
						<span v-model="form.name"></span>
					</el-form-item>
					<el-form-item label="证件类型:">
						<span v-model="form.type"></span>
					</el-form-item>
					<el-form-item label="证件号码:">
						<span v-model="form.IDnumber"></span>
					</el-form-item>
					<el-form-item label="通讯地址:">
						<span v-model="form.address"></span>
					</el-form-item>
					<el-form-item label="联系电话:">
						<span v-model="form.phonenumber"></span>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				id: null,
				loanList: [],
				accountID: '',
				loanPage: null,
				currentLoanPage: 1,
				dialogVisible: false,
				content: null,
				author: null,
				guaranteeType:'',
				repaymentStatus:'',
				form: {},
				dialogVisible_edit: false,
				title_detail: null,
				options: [{
						label: '未还款',
						value: 0
					},
					{
						label: '已还款',
						value: 1
					},
				]
			}
		},
		methods: {
			getDefaultLoanList() {
				axios.get('/api/loanSearch/loanPage', {
						params: {
							accountID: '',
							repaymentStatus: -1
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.loanPage = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});



				axios.get('/api/loanSearch/loan', {
						params: {
							accountID: '',
							repaymentStatus: -1,
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.loanList = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			search_page(currentPage) {
				this.currentLoanPage = currentPage;
				axios.get('/api/loanSearch/loan', {
						params: {
							accountID: this.accountID,
							repaymentStatus: -1,
							page: this.currentLoanPage,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.loanList = eval(res.data);
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			list_button() {
				axios.get('/api/loanSearch/loan', {
						params: {
							accountID: this.accountID,
							repaymentStatus: -1,
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

				axios.get('/api/loanSearch/loanPage', {
						params: {
							accountID: this.accountID,
							repaymentStatus: -1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.currentLoanPage = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getDetail(row) {
				this.dialogVisible = true;
				this.guaranteeType = row.guaranteeType;
				this.form = JSON.parse(row.guaranteeInfo);
			},

			handleLoan(row, result) {
				var parmas = new URLSearchParams();
				parmas.append("id", row.id);
				parmas.append("result", result);
				axios.post('/api/loan/handleLoanApply', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.da == "HANDLE_SUCCESS") {
							this.$alert('处理完成', '提示', {
								confirmButtonText: '确定',
							});
						} else {
							this.$alert('处理失败', '提示', {
								confirmButtonText: '确定',
							});
						}

					}).catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			}

		},
		beforeMount: function() {
			this.getDefaultLoanList();
		}
	}
</script>

<style>

</style>
