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
			<el-table-column prop="code" label="代码" width="280">
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
			<el-dialog width="60%" title="存款金额" :visible.sync="innerVisible" append-to-body>
				<el-form ref="form" label-width="150px">
					<el-form-item label="活期存款金额:">
						<span>{{balance}}</span>
					</el-form-item>
					<el-form-item label="定期存款金额:">
						<span>{{timeBalance}}</span>
					</el-form-item>
					<el-form-item label="贷款金额:">
						<span>{{loan}}</span>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-table :data="AccountDetail" style="width: 100%">
				<el-table-column prop="name" label="账户名" width="200">
				</el-table-column>
				<el-table-column prop="id" label="账号" width="200">
				</el-table-column>
				<el-table-column label="账号类别" width="220">
					<template slot-scope="scope">
						<span v-if="scope.row.accountType == 1">基本账户</span>
						<span v-if="scope.row.accountType == 2">一般账户</span>
						<span v-if="scope.row.accountType == 3">临时账户</span>
						<span v-if="scope.row.accountType == 4">专业账户</span>
					</template>
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
						<el-button type="text" @click="getBalance(scope.row)">查看存款金额</el-button>
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
				<el-form-item label="邮政编码:">
					<span>{{form.postalCode}}</span>
				</el-form-item>
				<el-form-item label="单位类型:">
					<span v-if="form.clientType == 1">企业法人</span>
					<span v-if="form.clientType == 2">机关</span>
					<span v-if="form.clientType == 3">事业单位</span>
					<span v-if="form.clientType == 4">社会团体</span>
					<span v-if="form.clientType == 5">军队</span>
					<span v-if="form.clientType == 6">武警部队</span>
					<span v-if="form.clientType == 7">民办非企业组织</span>
					<span v-if="form.clientType == 8">非法人企业</span>
					<span v-if="form.clientType == 9">外国驻华机构</span>
					<span v-if="form.clientType == 10">个体工商户</span>
					<span v-if="form.clientType == 11">单位设立的独立核算的附属机构</span>
				</el-form-item>
				<el-form-item label="责任人类别:">
					<span v-if="form.personType == 1">法定代表人</span>
					<span v-if="form.personType == 2">负责人</span>
				</el-form-item>
				<el-form-item label="责任人名:">
					<span>{{form.personName}}</span>
				</el-form-item>
				<el-form-item label="责任人证件类别:">
					<span v-if="form.personCredentialsType == 1">身份证</span>
					<span v-if="form.personCredentialsType == 2">户口簿</span>
					<span v-if="form.personCredentialsType == 3">护照</span>
					<span v-if="form.personCredentialsType == 4">军官（警官）证</span>
				</el-form-item>
				<el-form-item label="责任人证件号:">
					<span>{{form.personCredentialsNumber}}</span>
				</el-form-item>
				<el-form-item label="行业类别:">
					<span v-if="form.industryType == 'A'">农、林、牧、渔业</span>
					<span v-if="form.industryType == 'B'">采矿业</span>
					<span v-if="form.industryType == 'C'">制造业</span>
					<span v-if="form.industryType == 'D'">电力、热力、燃气及水生产和供应业</span>
					<span v-if="form.industryType == 'E'">建筑业</span>
					<span v-if="form.industryType == 'F'">批发和零售业</span>
					<span v-if="form.industryType == 'G'">交通运输、仓储和邮政业</span>
					<span v-if="form.industryType == 'H'">住宿和餐饮业</span>
					<span v-if="form.industryType == 'I'">信息传输、软件和信息技术服务业</span>
					<span v-if="form.industryType == 'J'">金融业</span>
					<span v-if="form.industryType =='K'">房地产业</span>
					<span v-if="form.industryType == 'L'">租赁和商务服务业</span>
					<span v-if="form.industryType == 'M'">科学研究和技术服务业</span>
					<span v-if="form.industryType == 'N'">水利、环境和公共设施管理业</span>
					<span v-if="form.industryType == 'O'">居民服务、修理和其他服务业</span>
					<span v-if="form.industryType == 'P'">教育</span>
					<span v-if="form.industryType == 'Q'">卫生和社会工作</span>
					<span v-if="form.industryType == 'R'">文化、体育和娱乐业</span>
					<span v-if="form.industryType == 'S'">公共管理、社会保障和社会组织</span>
					<span v-if="form.industryType == 'T'">国际组织</span>
				</el-form-item>
				<el-form-item label="经营范围:">
					<span>{{form.businessScope}}</span>
				</el-form-item>
				<el-form-item label="注册资金:">
					<span>{{form.regCapital}}</span>
				</el-form-item>
				<el-form-item label="地区码:">
					<span>{{form.areaCode}}</span>
				</el-form-item>
				<el-form-item label="证明文件:">
					<a :href="'/upload'+form.certifiedDocuments" download="">文件下载</a>
				</el-form-item>
				<el-form-item label="税务识别号:">
					<span>{{form.taxRegCertificateNum}}</span>
				</el-form-item>
				<el-form-item label="联系电话:">
					<span>{{form.telephone}}</span>
				</el-form-item>
				<el-form-item label="注册时间:">
					<span>{{form.authDate}}</span>
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
				dateValue: [],
				dialogVisible: false,
				form: [],
				AccountDetail: [],
				dialogVisible1: false,
				AllowCreateAccount: null,
				innerVisible:false,
				balance:null,
				timeBalance:null,
				loan:null,
			}
		},
		methods: {
			getDefaultPublicUserList() {
				axios.get('/api/clientSearch/publicPage', {
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

				axios.get('/api/clientSearch/publicList', {
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
				var authDateStart, authDateEnd;
				if (this.dateValue == '') {
					authDateStart = '';
					authDateEnd = '';
				} else {
					authDateStart = this.dateValue[0];
					authDateEnd = this.dateValue[1];
				}
				axios.get('/api/clientSearch/publicList', {
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
				var authDateStart, authDateEnd;
				this.currentPage = currentpage;
				if (this.dateValue == '') {
					authDateStart = '';
					authDateEnd = '';
				} else {
					authDateStart = this.dateValue[0];
					authDateEnd = this.dateValue[1];
				}
				axios.get('/api/clientSearch/publicList', {
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
				axios.get('/api/clientSearch/publicDetail', {
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
					path: '/addPublicAccount'
				});
			},
			getAccount(id) {
				axios.get('/api/clientSearch/publicAccount', {
						params: {
							clientID: id
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.AccountDetail = eval(res.data);
						this.dialogVisible1 = true;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			isAllowCreateAccount() {
				axios.get('/api/publicService/allowCreateAccount', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.AllowCreateAccount = res.data;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getBalance(index){
				this.balance = index.balance;
				axios.get('/api/publicTime/deposit', {
						params: {
							accountID:index.id
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						var a = res.data;
						if(a.length !=0){
							this.timeBalance = a[0].amount;
						}
						else{
							this.timeBalance = 0;
						}
						this.innerVisible = true;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			}
		},
		beforeMount: function() {
			this.getDefaultPublicUserList();
			this.isAllowCreateAccount();
		}
	}
</script>
