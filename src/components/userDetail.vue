<template>
	<div>
		<el-form label-width="80px" v-model="detail">
			<el-form-item label="机构id">
				<el-input style="width: 80px;" v-model="detail.agencyID" class="inp"></el-input>
				<el-button type="primary" icon="el-icon-plus" @click='dialogVisible = true' style="margin-left: 15px;">选择开户机构</el-button>
			</el-form-item>
			<el-form-item label="用户名">
				<el-input v-model="detail.username" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="detail.nickName" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input type="password" v-model="detail.pwd" style="width: 200px;"></el-input>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="value8" filterable placeholder="请选择状态">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="detail.role" filterable placeholder="请选择角色">
					<el-option v-for="item1 in roleList" :key="item1.roleID" :label="item1.roleName" :value="item1.roleID"></el-option>
					</el-select>
				</el-form-item>

			<el-form-item label="E-mail" >
				<el-input type="email" v-model="detail.email" style="width: 500px;"></el-input>
			</el-form-item>
			<el-form-item label="电话">
				<el-input v-model="detail.phoneNumber" style="width: 500px;"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="value9" filterable placeholder="请选择性别">
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
				<el-button type="primary" icon="el-icon-plus" style="border: 0px ;">选择头像文件</el-button>
			</el-upload>
			<el-button type="primary" @click="sendPic()" v-if="fileList.length !=0" icon="el-icon-check" style="border: 0px ;">确认上传的文件</el-button>
			</el-form-item >
			<el-form-item label="缩略图"  v-if="imageUrl" >
			<img style="height: 100px;width: 100px;" :src="imageUrl">
			</el-form-item>
		</el-form>
		<el-button type="primary" icon="el-icon-upload2" style="float: right;" @click="update()">上传</el-button>
		<el-button type="warning" icon="el-icon-delete" @click="deleteUser()">删除该用户</el-button>
		
		<el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
			<el-table  style="width: 100%;" :data="agencyList">
				<el-table-column prop="name" label="机构名" width="250">
				</el-table-column>
				<el-table-column label="机构码" prop="bankCode" width="80">
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="100">
					<template slot-scope="scope">
						<el-button type="text" @click="choseAgency(scope.row.id)">选择该机构</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @current-change="search_page" :current-page="currentPage"
			layout=" prev, pager, next"  :total="agencyNumber" align='center'>
			</el-pagination>
		</el-dialog>
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

					var index1 = 0;
					var index2 = 0;
					var i = 0;
					for (i = 0; i < 3; i++) {
						if (this.value8 == this.options[i].value) {
							index1 = i;
						}
					};
					for (i = 0; i < 3; i++) {
						if (this.value9 == this.sex[i].value) {
							index2 = i;
						}
					};
					if (this.pwd != '') {
						this.pwd = this.$md5(this.pwd);
					}
					var changedDetail = new URLSearchParams();
					changedDetail.append("userID", localStorage.getItem("chosenUser"));
					changedDetail.append("username", this.detail.username);
					changedDetail.append("agencyID", this.detail.agencyID);
					changedDetail.append("nickName", this.detail.nickName, );
					changedDetail.append("status", index1);
					changedDetail.append("role", this.detail.role);
					changedDetail.append("email", this.detail.email);
					changedDetail.append("phoneNumber", this.detail.phoneNumber);
					changedDetail.append("sex", index2);
					changedDetail.append("pwd", this.$md5(this.data.pwd));
					changedDetail.append("birthday", this.detail.birthday);
					changedDetail.append("pictureUrl", this.pictureUrl);
					axios.put('/api/user/userDetail', changedDetail, {
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res=> {
							if (res.data == "USER_EDIT_SUCCESS")
								alert("上传成功");
						});
				}
			},
			choseAgency(row){
				this.agencyID = row;
				this.dialogVisible = false;
			},
			search_page(currentPage){
				this.currentPage = currentPage;
				axios.get('/api/agency/agencyList', {
					params: {
						keywords:'',
						page:this.currentPage,
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
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				console.log(this.imageUrl);
			},
			getDefaultAgencyList(){
				axios.get('/api/agency/agencyPage', {
					params: {
						keywords:'',
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
						keywords:'',
						page:1,
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
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			sendPic(){
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
								this.imageUrl = '/upload'+this.pictureUrl;
						});
				},
				handleChange(file, fileList) {
					this.fileList = fileList.slice(-3);
				},
				getDetail(){
					axios.get('/api/user/userDetail', {
							params: {
								userID: localStorage.getItem("chosenUser"),
							},
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res => {
							var response = res.data;
							this.detail = [];
							this.detail = eval(response);
							console.log(this.detail.username);
							this.value8 = this.options[this.detail.status].label;
							this.value9 = this.sex[this.detail.sex].label;
						})
						.catch(function(error) {
							alert("请求失败！");
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
		},
		data() {
			return {
				detail: [],
				options: [{
					value: '0',
					label: '禁用'
				}, {
					value: '1',
					label: '允许'
				}, {
					value: '2',
					label: '注销'
				}],
				value8: '',
				sex: [{
					value: '0',
					label: '男'
				}, {
					value: '1',
					label: '女'
				}, {
					value: '2',
					label: '未知'
				}],
				value9: '',
				pwd: '',
				imageUrl:null,
				path:'/user/pic/',
				fileList:[],
				pictureUrl:null,
				dialogVisible:false,
				currentPage:1,
				agencyNumber:null,
				agencyList:[],
				roleList:[],
			}
		},
		beforeMount:function(){
			this.getDetail();
			this.getDefaultAgencyList();
			this.getRole();
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
