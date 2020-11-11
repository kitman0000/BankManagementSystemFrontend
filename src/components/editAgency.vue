<template>
	<div>
		<el-form label-width="120px">
			<el-form-item label="地址:">
				<el-input style="width: 300px;" v-model="address" placeholder="请输入地址" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="所在城市:">
				<el-select v-model="city" filterable placeholder="请输入关键词">
					<el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="名称:">
				<el-input style="width: 500px;" placeholder="请输入名称" v-model="name" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="机构码:">
				<el-input style="width: 300px;" v-model="bankCode" placeholder="请输入机构码" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="负责人:">
				<el-input v-model="owner" v-if="owner" :disabled="true" style="width: 100px;">
				</el-input>
				<el-button type="primary" style="margin-left: 10px;border: 0px ;" icon="el-icon-plus" @click="selectOwner = true">选择负责人</el-button>
	
				<el-dialog title="选择负责人" :visible.sync="selectOwner">
					<el-table :data="Allstaff">
						<el-table-column label="用户名" prop="username" width="100">
						</el-table-column>
						<el-table-column label="昵称" prop="nickName" width="100">
						</el-table-column>
						<el-table-column label="操作" align="center" min-width="100">
							<template slot-scope="scope">
								<el-button type="text" @click="selectBankOwner(scope.row)">选择该人员</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination @current-change="search_page" :current-page="currentStaffPage" layout=" prev, pager, next" :total="staffNumber"
					 align='center'>
					</el-pagination>
				</el-dialog>
			</el-form-item>
		</el-form>
		<el-button @click='editAgency()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px;margin-top: 25px;">确认提交</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				address: null,
				currentPage: 1,
				city: null,
				name: null,
				area: [],
				Allstaff: [],
				owner: null,
				selectOwner: false,
				staffNumber: null,
				currentStaffPage: 1,
				ownerID: null,
				bankCode:null,
				id:null,
			}
		},
		methods: {
			search_page(currentPage) {
				this.currentStaffPage = currentPage;
				axios.get('/api/user/user', {
						params: {
							status: 1,
							username: '',
							page: this.currentStaffPage,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.Allstaff = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getDefaultStaff() {
				axios.get('/api/user/userPageNumber', {
						params: {
							status: 1,
							username: '',
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
	
						this.staffNumber = res.data * 10;
						console.log(this.staffNumber);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
	
				axios.get('/api/user/user', {
						params: {
							status: 1,
							username: '',
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.Allstaff = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			selectBankOwner(owner) {
				this.ownerID = owner.userID;
				this.owner = owner.username;
				this.selectOwner = false;
			},
			getCity() {
				axios.get('/api/agency/city', {
						params: {
							keywords: '',
						},
						headers: {
							"token": localStorage.getItem("token")
						}
					})
					.then(res => {
						this.area = res.data;
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			editAgency(){
				var parmas = new URLSearchParams();
				parmas.append("address",this.address);
				parmas.append("id",this.id);
				parmas.append("city",this.city);
				parmas.append("name",this.name);
				parmas.append("bankCode",this.bankCode);
				parmas.append("ownerID",this.ownerID);
				axios.put('/api/agency/agency', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "AGENCY_EDIT_SUCCESS"){
							this.$alert('发送成功', '提示', {
							         confirmButtonText: '确定',
							       });
						}
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			},
			getAgency(){
				var a = localStorage.getItem('editAgency');
				var selectedAgency = JSON.parse(a);
				this.id = selectedAgency.id;
				this.address = selectedAgency.address;
				this.city = selectedAgency.city;
				this.name = selectedAgency.name;
				this.ownerID = selectedAgency.ownerID;
				this.bankCode = selectedAgency.bankCode;
			},
		},
		beforeMount: function() {
			this.getDefaultStaff();
			this.getCity();
			this.getAgency();
		}
	}
</script>

<style>
</style>
