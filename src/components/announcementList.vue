<template>
	<div>
		<div>
			<label style="margin-left: 10px;">发布人：</label>
			<el-input v-model="userName" style="width: 150px;"></el-input>
			<label style="margin-left: 10px;">标题：</label>
			<el-input v-model="title" style="width: 150px;"></el-input>

			<el-button type="primary" @click="list_button()" icon="el-icon-search" style="background: #24375E;border: 0px ;margin-left: 10px;">搜索</el-button>
		</div>
		<el-table :data="announcement" style="width: 100%">
			<el-table-column prop="author" label="发布人" width="200">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="220">
			</el-table-column>

			<el-table-column label="查看" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="getDetail(scope.row)">查看详情</el-button>
				</template>
			</el-table-column>

			

			<el-table-column label="操作" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="editAnnouncement_rea(scope.row)">修改公告</el-button>
					<el-button type="text" @click="deleteAnnouncement(scope.row)">删除</el-button>
				</template>
			</el-table-column>

		</el-table>
		<el-pagination @current-change="search_page" :current-page="currentAnnouncementPage" layout=" prev, pager, next"
		 :total="announcementPage" align='center'>
		</el-pagination>
		
		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
			<label>发布者：</label><span>{{author}}</span></br></br>
			<label>标题：</label><span>{{title_detail}}</span></br></br>
			<el-form>
				<el-form-item label="内容:" style="padding-bottom: 0px;">
					<textarea readonly="readonly" v-model="content" style="width: 800px;border: 0px;padding-top: 12px;" rows="15" ></textarea>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog title="提示" :visible.sync="dialogVisible_edit" width="70%">
			<el-form label-width="80px">
				<el-form-item label="发布人">
					<el-input v-model="author" :disabled="true" style="width: 500px;"></el-input>
				</el-form-item>
				<el-form-item label="标题">
					<el-input v-model="title_detail" style="width: 500px;"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input type="textarea" v-model="content" rows="15" style="width: 800px;"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editAnnouncement()">确定修改</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				id:null,
				announcement: [],
				announcementPage: null,
				currentAnnouncementPage: 1,
				userName: '',
				title: '',
				dialogVisible:false,
				content:null,
				author:null,
				dialogVisible_edit:false,
				title_detail:null,
			}
		},
		methods: {
			getDefaultAnnouncementList() {
				axios.get('/api/announcement/announcementPageNumber', {
						params: {
							title: '',
							userName: ''
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.announcementPage = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});



				axios.get('/api/announcement/announcementList', {
						params: {
							title: '',
							userName: '',
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.announcement = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			search_page(currentPage) {
				this.currentAnnouncementPage = currentPage;
				axios.get('/api/announcement/announcementList', {
						params: {
							title: this.title,
							userName: this.userName,
							page: this.currentAnnouncementPage,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.announcement = eval(res.data);
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			list_button() {
				axios.get('/api/announcement/announcementList', {
						params: {
							title: this.title,
							userName: this.userName,
							page: 1,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.announcement = eval(res.data);
						this.currentAnnouncementPage = 1;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});

				axios.get('/api/announcement/announcementPageNumber', {
						params: {
							title: this.title,
							userName: this.userName,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.announcementPage = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getDetail(row){
				
				axios.get('/api/announcement/announcementDetail', {
					params: {
						announcementID:row.id
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					var a =eval(res.data);
					this.author = a.author;
					this.content = a.content;
					this.title_detail = a.title;
					this.dialogVisible = true;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			editAnnouncement_rea(row){
				axios.get('/api/announcement/announcementDetail', {
					params: {
						announcementID:row.id
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					var a =eval(res.data);
					this.author = a.author;
					this.content = a.content;
					this.title_detail = a.title;
					this.dialogVisible_edit = true;
					this.id = a.id;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			editAnnouncement(){
				var parmas = new URLSearchParams();
				parmas.append("id",this.id);
				parmas.append("title",this.title_detail);
				parmas.append("content",this.content);
				axios.put('/api/announcement/announcement', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "HANDLE_ANNOUNCEMENT_SUCCESS"){
							this.$alert('修改成功', '提示', {
							         confirmButtonText: '确定',
							       });
							window.location.reload();
						}
						else{
							this.$alert('修改失败', '提示', {
							         confirmButtonText: '确定',
							       });
						}
				
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			},
			deleteAnnouncement(row){
				 this.$confirm('此操作将删除该公告, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							axios.delete('/api/announcement/announcement', {
								params: {
									announcementID:row.id
								},
								headers: {
									"token": localStorage.getItem("token"),
								}
							})
							.then(res=> {
								if(res.data == "HANDLE_ANNOUNCEMENT_SUCCESS"){
									this.$alert('删除成功', '提示', {
									         confirmButtonText: '确定',
									       });
										   window.location.reload();
								}
								else{
									this.$alert('删除失败', '提示', {
									         confirmButtonText: '确定',
									       });
								}
								
							})
							.catch(err=> {
								this.$alert('请求失败', '提示', {
								         confirmButtonText: '确定',
								       });
							});
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			}
		},
		beforeMount: function() {
			this.getDefaultAnnouncementList();
		}
	}
</script>

<style>

</style>
