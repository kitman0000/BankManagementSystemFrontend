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
			<el-table-column prop="rate" label="税率" width="80">
			</el-table-column>
			<el-table-column label="担保方式" width="80">
				<template slot-scope="scope">
					<span v-if="scope.row.guaranteeType == 1">抵押</span>
					<span v-if="scope.row.guaranteeType == 2">质押</span>
					<span v-if="scope.row.guaranteeType == 3">保证</span>
				</template>
			</el-table-column>
			<el-table-column label="查看" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="getDetail(scope.row)">查看担保信息</el-button>
				</template>
			</el-table-column>
			<el-table-column label="处理" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="handleLoan(scope.row,1)">同意</el-button>
					<el-button type="text" @click="handleLoan(scope.row,2)">拒绝</el-button>
				</template>
			</el-table-column>

		</el-table>
		<el-pagination @current-change="search_page" :current-page="currentLoanPage" layout=" prev, pager, next"
		 :total="loanPage" align='center'>
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
			    <span  style="width: 300px;">{{form.IDnumber}}</span>
			  </el-form-item>
			  <el-form-item label="移动电话:">
			    <span  style="width: 250px;">{{form.phonenumber}}</span>
			  </el-form-item>
			  <el-form-item label="抵押物地址:">
			    <span  style="width: 350px;">{{form.address}}</span>
			  </el-form-item>
			  <el-form-item label="产权证号:">
			    <span  style="width: 300px;">{{form.certificateNumber}}</span>
			  </el-form-item>
			  <el-form-item label="抵押物价值:">
			    <span style="width: 150px;">{{form.value}}</span>
			  </el-form-item>
			 </el-form>
			 </div>
			 <!-- 质押 -->
			 <div  v-if="guaranteeType == 2">
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
			  <div  v-if="guaranteeType == 3">
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
				id:null,
				loanList: [],
				accountID:'',
				loanPage: null,
				currentLoanPage: 1,
				dialogVisible:false,
				content:null,
				path:'/loanGuaranteeInfo/',
				author:null,
				dialogVisible_edit:false,
				title_detail:null,
				guaranteeType:null,
				form:{
					name:null,
					type:null,
					IDnumber:null,
					phonenumber:null,
					address:null,
					certificateNumber:null,
					goods:null,
					value:null,
				}
			}
		},
		methods: {
			getDefaultLoanList() {
				axios.get('/api/loanSearch/unhandledLoanPage', {
						params: {
							accountID: '',
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



				axios.get('/api/loanSearch/unhandledLoan', {
						params: {
							accountID: '',
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
				axios.get('/api/loanSearch/unhandledLoan', {
						params: {
							accountID:this.accountID,
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
				axios.get('/api/loanSearch/unhandledLoan', {
						params: {
							accountID:this.accountID,
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

				axios.get('/api/loanSearch/unhandledLoanPage', {
						params: {
							accountID:this.accountID,
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
			getDetail(row){
				this.dialogVisible = true;
				this.guaranteeType = row.guaranteeType;
				this.form = JSON.parse(row.guaranteeInfo);
			},
			handleLoan(row,result){
				var parmas = new URLSearchParams();
				parmas.append("id",row.id);
				parmas.append("result",result);
				axios.post('/api/loan/handleLoanApply', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data== "HANDLE_SUCCESS"){
							this.$alert('处理完成', '提示', {
							         confirmButtonText: '确定',
							       });
							window.location.reload();
						}
						else if(res.data=="NO_DEPOSIT_RESERVE"){
							this.$alert('准备金不足', '提示', {
							         confirmButtonText: '确定',
							       });
								   window.location.reload();
						}
						else{
							this.$alert('处理失败', '提示', {
							         confirmButtonText: '确定',
							       });
								   window.location.reload();
						}
				
					}).catch(err=> {
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
