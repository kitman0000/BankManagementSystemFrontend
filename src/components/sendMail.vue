<template>
	<div>
		<el-form label-width="80px">
			<el-form-item label="收件人">
				<el-input v-model="value5" style="width: 150px;" placeholder="请选择">
				</el-input>
				<el-button type="primary" style="margin-left: 10px;border: 0px ;" icon="el-icon-plus" @click="selectOwner = true">选择负责人</el-button>
			</el-form-item>
			<el-form-item label="标题">
				<el-input v-model="title"></el-input>
			</el-form-item>
			<el-form-item label="内容">
				<el-input v-model="content" type="textarea"></el-input>
			</el-form-item>
			<el-form-item label="是否紧急">
				<el-select filterable placeholder="请选择状态" ref="isImportantSelector" v-model="IsImportantValue" style="width: 150px;">
					<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="文件上传">
				<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false" :on-change="handleChange"
				 :file-list="fileList3">
					<el-button type="primary" icon="el-icon-plus" style="background: #24375E;border: 0px ;">添加文件</el-button>	
				</el-upload>
				<el-button type="primary" @click="sendFile()" v-if="fileList3.length !=0" icon="el-icon-check" style="background: #24375E;border: 0px ;">确认上传的文件</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="sendMail()" icon="el-icon-check" style="background: #24375E;border: 0px ;">确认上传</el-button>
		
		<el-dialog title="选择收件人" :visible.sync="selectOwner">
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
	</div>
</template>

<script>
	import axios from 'axios';
	import qs from 'qs';
	export default {
		data() {
			return {
				options: [],
				selectOwner:false,
				Allstaff:[],
				options2: [{
					value: true,
					label: '紧急信息'
				}, {
					value: false,
					label: '普通信息'
				}],
				options3:[],
				value5: [],
				title: '',
				content: '',
				IsImportantValue: false,
				fileList3: [],
				value6:[],
				currentStaffPage:1,
				staffNumber:null,
				fileData:[],
				path:'/mail/'
			}
		},
		methods: {
			handleChange(file, fileList) {
				this.fileList3 = fileList.slice(-3);
			},
			department(){
				axios.get('/api/user/userPageNumber', {
						params: {
							status:-1,
							username:''
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
							for(var i = 1;i<=res.data;i++){
								this.options3.push({
									value: i,
									label:i
									});
							}
					})
					.catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			},
			getUser(){
				console.log(this.value6);
				axios.get('/api/user/user', {
						params: {
							status:-1,
							username:'',
							page:this.value6
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.options = [];
						var response = res.data;
						var a = eval(response);
						a.forEach((res)=>{
							this.options.push({
								value: res.userID,
								label:res.username
								});
						})

						console.log(this.options);
					})
					.catch(err=> {
						this.$alert('请求用户失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			},
			selectBankOwner(owner) {
				this.value5 = owner.userID;
				this.selectOwner = false;
			},
			sendMail(){
				if(this.value5.length == 0 || this.title == "" || this.content == ""){
					this.$alert('收件人，标题或内容不得为空！', '提示', {
					         confirmButtonText: '确定',
					       });
				}
				else{
					var parmas = new FormData();
					parmas.append("receiverID",this.value5);
					parmas.append("title",this.title);
					parmas.append("content",this.content);
					parmas.append("isImportant",this.IsImportantValue);
					parmas.append("file",this.fileData);
					axios.post('/api/mail/mail', parmas, {
						paramsSerializer: parmas => {
						      return qs.stringify(parmas, { indices: false })
						    },
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res => {
							if(res.data == 'EMAIL_SEND_SUCCESS'){
								this.$alert('发送成功', '提示', {
								         confirmButtonText: '确定',
								       });
							}
							else{
								this.$alert('发送失败', '提示', {
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
			sendFile(){
				console.log(this.fileList3);
				for(var i = 0;i<this.fileList3.length;i++){
					var fileParmas = new FormData();
					fileParmas.append('multipartFile',this.fileList3[i].raw);
					fileParmas.append('path',this.path);
					axios.post('/api/file/file', fileParmas, {
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res=> {
								var response = res.data;
								response = this.path +res.data;
								this.fileData.push(response);
								this.$alert('文件上传成功', '提示', {
								         confirmButtonText: '确定',
								       });
						});
						
				}
			},
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
		},
		beforeMount: function() {
				this.getDefaultStaff();
				
		}
	}
</script>

<style>
</style>
