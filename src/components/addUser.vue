<template>
	<div>
		<el-form label-width="80px" v-model="detail">
			<el-form-item label="所属机构">
				<el-input style="width: 200px;" v-model="detail.agencyName" class="inp"></el-input>
				<el-button type="primary" icon="el-icon-plus" @click='dialogVisible = true' style="margin-left: 15px;">选择开户机构</el-button>
			</el-form-item>
			<el-form-item label="用户名">
				<el-input v-model="detail.username" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="detail.nickName" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="密码" style="width: 350px;">
				<el-input type="password" v-model="password"></el-input>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="detail.status" filterable placeholder="请选择状态">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="角色">
				<el-select v-model="detail.role" filterable placeholder="请选择角色">
				<el-option v-for="item1 in roleList" :key="item1.roleID" :label="item1.roleName" :value="item1.roleID"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="E-mail">
				<el-input type="email" v-model="detail.email" style="width: 350px;"></el-input>
			</el-form-item>
			<el-form-item label="电话">
				<el-input v-model="detail.phoneNumber" style="width: 350px;"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="detail.sex" filterable placeholder="请选择性别">
					<el-option v-for="item1 in sex" :key="item1.value" :label="item1.label" :value="item1.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="生日">
				<el-date-picker v-model="detail.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="头像">
				<el-upload class="upload-demo" :auto-upload='false' action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange"
				 :file-list="fileList">
					<el-button type="primary" icon="el-icon-plus" style="border: 0px ;">选择头像文件，大小不大于1MB</el-button>
				</el-upload>
				<el-button type="primary" @click="sendPic()" v-if="fileList.length !=0" icon="el-icon-check" style="border: 0px ;">确认上传的文件</el-button>
			</el-form-item>
			<el-form-item label="缩略图" v-if="imageUrl">
				<img style="height: 100px;width: 100px;" :src="imageUrl">
			</el-form-item>
		</el-form>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
			<el-table style="width: 100%;" :data="agencyList">
				<el-table-column prop="name" label="机构名" width="250">
				</el-table-column>
				<el-table-column label="机构码" prop="bankCode" width="80">
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="100">
					<template slot-scope="scope">
						<el-button type="text" @click="choseAgency(scope.row)">选择该机构</el-button>
					</template>
				</el-table-column>


			</el-table>
			<el-pagination @current-change="search_page" :current-page="currentPage" layout=" prev, pager, next" :total="agencyNumber"
			 align='center'>
			</el-pagination>
		</el-dialog>
		<el-button type="primary" icon="el-icon-upload2" style="float: right;" @click="update()">上传</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		methods: {
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			},
			update() {
				var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				if (this.detail.email != '' && !regEmail.test(this.detail.email)) {
					this.$message({
						message: '邮箱格式不正确',
						type: 'error'
					})
					this.detail.email = ''
				} else if (this.detail.email == "") {
					alert("邮箱不能为空");
				} else {
					if (this.password != '') {
						this.password = this.$md5(this.password);
					}
					var addDetail = new URLSearchParams();
					addDetail.append("username", this.detail.username);
					addDetail.append("agencyID", this.detail.agencyID);
					addDetail.append("nickName", this.detail.nickName, );
					addDetail.append("status", this.detail.status);
					addDetail.append("role", this.detail.role);
					addDetail.append("email", this.detail.email);
					addDetail.append("phoneNumber", this.detail.phoneNumber);
					addDetail.append("sex", this.detail.sex);
					addDetail.append("pwd", this.password);
					addDetail.append("birthday", this.detail.birthday);
					addDetail.append("pictureUrl", this.pictureUrl);
					axios.post('/api/user/userDetail', addDetail, {
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(function(response) {
							if (response == "USER_ADD_SUCCESS")
								alert("上传成功");
						});
				}
			},
			deleteUser() {
				axios.delete('/api/user/user', {
						params: {
							userID: localStorage.getItem("chosenUser")
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.catch(function(error) {
						alert("请求失败！");
					});
			},
			choseAgency(row) {
				this.detail.agencyID = row.id;
				this.detail.agencyName = row.name;
				this.dialogVisible = false;
			},
			search_page(currentPage) {
				this.currentPage = currentPage;
				axios.get('/api/agency/agencyList', {
						params: {
							keywords: '',
							page: this.currentPage,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.agencyList = eval(res.data);
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getDefaultAgencyList() {
				axios.get('/api/agency/agencyPage', {
						params: {
							keywords: '',
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.agencyNumber = res.data * 10;
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});



				axios.get('/api/agency/agencyList', {
						params: {
							keywords: '',
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.agencyList = eval(res.data);
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getRole(){
				axios.get('/api/role/role', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.roleList = eval(res.data);
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			sendPic() {
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
						this.pictureUrl = this.path + res.data;
						this.imageUrl = '/upload' + this.pictureUrl;
					}).catch(err => {
						this.$alert('请求失败，图片可能过大', '提示', {
							confirmButtonText: '确定',
						});
						window.location.reload();
					});
			},
		},

		data() {
			return {
				detail: [],
				options: [{
					value: 0,
					label: '禁用'
				}, {
					value: 1,
					label: '允许'
				}, {
					value: 2,
					label: '注销'
				}],
				value8: '',
				sex: [{
					value: 0,
					label: '男'
				}, {
					value: 1,
					label: '女'
				}, {
					value: 2,
					label: '未知'
				}],
				value9: '',
				password: '',
				imageUrl: null,
				path: '/user/pic/',
				fileList: [],
				pictureUrl: null,
				dialogVisible: false,
				currentPage: 1,
				agencyNumber: null,
				agencyList: [],
				roleList:[],
				agencyID:null,
			}
		},
		beforeMount:function(){
			this.getDefaultAgencyList();
			this.getRole();
		}
	}
</script>

<style>
</style>
