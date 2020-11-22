<template>
	<div>
		<div>
			<label style="margin-left: 10px;">开户银行ID：</label>
			<el-input placeholder="开户银行ID" v-model="agencyID" style="width: 105px;"></el-input>
			<label style="margin-left: 10px;">名称：</label>
			<el-input placeholder="名称" v-model="name" style="width: 150px;"></el-input>
			<label style="margin-left: 10px;">电话：</label>
			<el-input placeholder="电话" v-model="telephone" style="width: 150px;"></el-input>
			<label style="margin-left: 15px;">日期选择：</label>
			<el-date-picker v-model="dateValue" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"
			 end-placeholder="结束日期">
			</el-date-picker>
			<el-button type="primary" @click="searchPublicUser_searchButton()" icon="el-icon-search" style="border: 0px ;margin-left: 10px;">搜索</el-button>
		</div>
		<el-table :data="publicUserList" style="width: 100%" @row-click="publicUserDetail">
			<el-table-column prop="name" label="名称" width="200">
			</el-table-column>
			<el-table-column prop="agencyName" label="开户银行" width="200">
			</el-table-column>
			<el-table-column prop="authDate" label="开户日期" width="220">
			</el-table-column>
			<el-table-column prop="telephoneNum" label="电话" width="280">
			</el-table-column>
			<el-table-column label="查看" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="getDetail(scope.row.id)">查看详细</el-button>
					<el-button type="text" @click="getAccount(scope.row.id)">查看账户</el-button>
				</template>

			</el-table-column>
			<el-table-column label="操作" align="center" min-width="100" v-if="AllowCreateAccount == true">
				<template slot-scope="scope">
					<el-button type="text" @click="addPublicAccount(scope.row.id)">新增账户</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="text-align: center;">
			<el-pagination @current-change="searchPublicUser" :current-page="currentPage" :page-size="10" layout="prev, pager, next"
			 :total="publicUserNumber">
			</el-pagination>
		</div>

		<el-dialog title="提示" :visible.sync="dialogVisible1" width="90%">
			<el-dialog width="60%" title="金额" :visible.sync="innerVisible" append-to-body>
				<el-table :data="List" style="width: 100%">
					<el-table-column prop="amount" label="数额" width="150">
					</el-table-column>
					<el-table-column prop="loanDate" v-if="isLoan" label="贷款时间" width="250">
					</el-table-column>
					<el-table-column prop="scheduledPayment" v-if="isLoan" label="应还款时间" width="250">
					</el-table-column>
					<el-table-column prop="depositDate" v-if="!isLoan" label="存款时间" width="250">
					</el-table-column>
					<el-table-column prop="scheduledWithdrawDate" v-if="!isLoan" label="到期时间" width="250">
					</el-table-column>
				</el-table>
			</el-dialog>
			<el-table :data="AccountDetail" style="width: 100%">
				<el-table-column prop="id" label="账号" width="250">
				</el-table-column>
				<el-table-column label="账号类别" width="220">
					<template slot-scope="scope">
						<span v-if="scope.row.accountType == 1">I类卡</span>
						<span v-if="scope.row.accountType == 2">II 类卡</span>
					</template>
				</el-table-column>
				<el-table-column prop="balance" label="活期余额" width="220">
				</el-table-column>
				<el-table-column prop="authDate" label="开户时间" width="280">
				</el-table-column>
				<el-table-column label="状态信息" width="280">
					<template slot-scope="scope">
						<span v-if="scope.row.available == true">启用</span>
						<span v-if="scope.row.available == false">冻结</span>
					</template>
				</el-table-column>
				<el-table-column label="查看" align="center" min-width="100">
					<template slot-scope="scope">
						<el-button type="text" @click="getBalance(scope.row,true)">查看贷款</el-button>
						<el-button type="text" @click="getBalance(scope.row,false)">查看定期存款</el-button>
						<el-button type="text" @click="getAccountList(scope.row)">查看流水账务</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
			</span>
		</el-dialog>


		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
			<el-form ref="form" :model="form" label-width="150px">
				<el-form-item label="客户名:">
					<span>{{form.name}}</span>
				</el-form-item>
				<el-form-item label="地址:">
					<span>{{form.address}}</span>
				</el-form-item>
				<el-form-item label="国籍:">
					<span>{{form.nation}}</span>
				</el-form-item>
				<el-form-item label="邮政编码:">
					<span>{{form.postalCode}}</span>
				</el-form-item>
				<el-form-item label="证件类别:">
					<span v-if="form.credentialsType == 1">身份证</span>
					<span v-if="form.credentialsType == 2">户口簿</span>
					<span v-if="form.credentialsType == 3">护照</span>
					<span v-if="form.credentialsType == 4">军官（警官）证</span>
				</el-form-item>
				<el-form-item label="证件号:">
					<span>{{form.credentialsNumber}}</span>
				</el-form-item>
				<el-form-item label="签发地:">
					<span>{{form.credentialsLocation}}</span>
				</el-form-item>
				<el-form-item label="联系电话:">
					<span>{{form.telephoneNum}}</span>
				</el-form-item>
				<el-form-item label="注册时间:">
					<span>{{form.authDate}}</span>
				</el-form-item>
				<el-form-item label="备注:">
					<span>{{form.note}}</span>
				</el-form-item>
			</el-form>
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
				publicUserList: [],
				publicUserNumber: null,
				currentPage: 1,
				publicUserName: null,
				agencyID: null,
				name: null,
				telephone: null,
				dateValue: null,
				dialogVisible: false,
				form: [],
				AccountDetail:[],
				dialogVisible1:false,
				AllowCreateAccount:null,
				innerVisible:false,
				balance:null,
				timeBalance:null,
				loan:0,
				isLoan:null,
				List:[],
			}
		},
		methods: {
			getDefaultPublicUserList() {
				axios.get('/api/clientSearch/personalPage', {
						params: {
							IDNumber: '',
							agencyID: -1,
							authDateEnd: '',
							authDateStart: '',
							name: '',
							telephone: '',
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.publicUserNumber = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});

				axios.get('/api/clientSearch/personalList', {
						params: {
							IDNumber: '',
							agencyID: -1,
							authDateEnd: '',
							authDateStart: '',
							name: '',
							page: 1,
							telephone: '',
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.publicUserList = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			searchPublicUser_searchButton() {
				var authDateStart,authDateEnd;
				if (this.dateValue == null) {
					authDateStart = '';
					authDateEnd = '';
				} else {
					authDateStart = this.dateValue[0];
					authDateEnd = this.dateValue[1];
				}
				axios.get('/api/clientSearch/personalList', {
						params: {
							IDNumber: '',
							agencyID: this.agencyID,
							authDateStart: authDateStart,
							authDateEnd: authDateEnd,
							name: this.name,
							telephone: this.telephone,
							page: 1
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.publicUserList = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			searchPublicUser(currentpage) {
				var authDateStart,authDateEnd;
				this.currentPage = currentpage;
				if (this.dateValue == null) {
					authDateStart = '';
					authDateEnd = '';
				} else {
					authDateStart = this.dateValue[0];
					authDateEnd = this.dateValue[1];
				}
				axios.get('/api/clientSearch/personalList', {
						params: {
							IDNumber: '',
							agencyID: this.agencyID,
							authDateStart: authDateStart,
							authDateEnd: authDateEnd,
							name: this.name,
							telephone: this.telephone,
							page: this.currentPage
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.publicUserList = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getDetail(id) {
				axios.get('/api/clientSearch/personalDetail', {
						params: {
							id: id
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.form = eval(res.data);
						this.dialogVisible = true;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			publicUserDetail(row, event) {
				localStorage.setItem("publicUserId", row.id);
			},
			addPublicAccount(id) {
				localStorage.setItem('clientID', id);
				this.$router.push({
					path: '/addPersonalAccount'
				});
			},
			getAccount(id){
				axios.get('/api/clientSearch/personalAccount', {
					params: {
						clientID:id
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.AccountDetail = eval(res.data);
					this.dialogVisible1 = true;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			isAllowCreateAccount(){
				axios.get('/api/personalService/allowCreateAccount', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.AllowCreateAccount = res.data;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			getBalance(index,isLoan){
				this.isLoan = isLoan;
				this.balance = index.balance;
				if(isLoan){
					var api = '/api/loanSearch/accountLoan';
				}
				else{
					var api = '/api/personalTime/deposit';
				}
				axios.get(api, {
					params: {
						accountID:index.id
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.List = eval(res.data);
					this.innerVisible = true;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			getAccountList(index){
				// 查询客户的流水账务
				var accountID = index.id;
				this.$router.push({path:"Transaction?accountID=" + accountID});
			}
		},

		beforeMount: function() {
			this.getDefaultPublicUserList();
			this.isAllowCreateAccount();
		}
	}
</script>
