<template>
	<div>
		<el-button type="primary" style="float: right;margin-top: 15px;margin-right: 10px;border: 0px ;"
		 icon="el-icon-plus" @click="addTrunk()">添加尾箱</el-button>
		<el-table style="width: 100%;" :data="trunkList">
			<el-table-column label="柜员名称" prop="tellerName" width="150">
			</el-table-column>
			<el-table-column label="现金" prop="cash" width="150">
			</el-table-column>
			<el-table-column label="尾箱编号" prop="number" width="100">
			</el-table-column>
			<el-table-column label="尾箱管理" align="center" width="230">
				<template slot-scope="scope">
					<el-button type="text" @click="deleteTrunk(scope.row)">删除尾箱</el-button>
					<el-button type="text" @click="editTrunk(scope.row)">编辑尾箱</el-button>
					<el-button type="text" @click="setTeller(scope.row)">指定柜员</el-button>
					
				</template>
			</el-table-column>
			<el-table-column label="尾箱现金管理" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="text" @click="addCash(scope.row)">添加现金</el-button>
					<el-button type="text" @click="removeCash(scope.row)">移出现金</el-button>
				</template>
			</el-table-column>
			<el-table-column label="详情" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="text" @click="trunkCard(scope.row)">查看详细</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="选择负责人" :visible.sync="selectTeller">
			<el-table :data="Allstaff">
				<el-table-column label="用户名" prop="username" width="100">
				</el-table-column>
				<el-table-column label="昵称" prop="nickName" width="100">
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="50">
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
	export default {
		data() {
			return {
				trunkList:[],
				selectTeller:false,
				currentStaffPage:1,
				id:null,
				Allstaff:[],
				staffNumber:null
			}
		},
		methods: {
			getTrunk(){
				axios.get('/api/trunk/trunk', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.trunkList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			deleteTrunk(row){
				var id  = row.id;
				this.$confirm('此操作将删除尾箱, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          axios.delete('/api/trunk/trunk', {
				          	params: {
				          		id:id
				          	},
				          	headers: {
				          		"token": localStorage.getItem("token"),
				          	}
				          })
				          .then(res=> {
				          		if(res.data == "DELETE_TRUNK_SUCCESS"){
									this.$alert('删除成功', '提示', {
									         confirmButtonText: '确定',
									       });
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
			},
			editTrunk(row){
				var id = row.id;
				this.$prompt('请输入尾箱编号', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
							var parmas = new URLSearchParams();
							parmas.append("id",id);
							parmas.append("number",value);
							axios.put('/api/trunk/trunk', parmas, {
									headers: {
										"token": localStorage.getItem("token"),
									}
								})
								.then(res => {
									if(res.data == "EDIT_TRUNK_SUCCESS"){
										this.$alert('编辑成功', '提示', {
										         confirmButtonText: '确定',
										       });
										window.location.reload();
									}
									else{
										this.$alert('编辑失败', '提示', {
										         confirmButtonText: '确定',
										       });
									}
								}).catch(err=> {
									this.$alert('请求失败', '提示', {
									         confirmButtonText: '确定',
									       });
								});
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消输入'
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
			selectBankOwner(owner) {
				var parmas = new URLSearchParams();
				parmas.append("userID",owner.userID);
				parmas.append("id",this.id);
				axios.post('/api/trunk/teller', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "TELLER_SET_SUCCESS"){
							this.$alert('指定人员成功', '提示', {
							         confirmButtonText: '确定',
							       });
							window.location.reload();
						}
						else{
							this.$alert('指定人员失败', '提示', {
							         confirmButtonText: '确定',
							       });
						}
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			},
			setTeller(row){
				this.id = row.id;
				this.selectTeller = true;
			},
			addCash(row){
				var id = row.id;
				this.$prompt('请输入添加的现金数额', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
							var parmas = new URLSearchParams();
							parmas.append("id",id);
							parmas.append("amount",value);
							axios.post('/api/trunkCash/addCash', parmas, {
									headers: {
										"token": localStorage.getItem("token"),
									}
								})
								.then(res => {
									if(res.data == "UPDATE_SUCCESS"){
										this.$alert('添加成功', '提示', {
										         confirmButtonText: '确定',
										       });
										window.location.reload();
									}
									else{
										this.$alert('添加失败', '提示', {
										         confirmButtonText: '确定',
										       });
									}
								}).catch(err=> {
									this.$alert('请求失败', '提示', {
									         confirmButtonText: '确定',
									       });
								});
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消输入'
				          });       
				        });
			},
			removeCash(row){
				var id = row.id;
				this.$prompt('请输入移出的现金数额', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
							var parmas = new URLSearchParams();
							parmas.append("id",id);
							parmas.append("amount",value);
							axios.post('/api/trunkCash/removeCash', parmas, {
									headers: {
										"token": localStorage.getItem("token"),
									}
								})
								.then(res => {
									if(res.data == "UPDATE_SUCCESS"){
										this.$alert('移出成功', '提示', {
										         confirmButtonText: '确定',
										       });
										window.location.reload();
									}
									else{
										this.$alert('移出失败', '提示', {
										         confirmButtonText: '确定',
										       });
									}
								}).catch(err=> {
									this.$alert('请求失败', '提示', {
									         confirmButtonText: '确定',
									       });
								});
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消输入'
				          });       
				        });
			},
			addTrunk(){
				this.$prompt('请输入尾箱编号', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
							var parmas = new URLSearchParams();
							parmas.append("number",value);
							axios.put('/api/trunk/trunk', parmas, {
									headers: {
										"token": localStorage.getItem("token"),
									}
								})
								.then(res => {
									if(res.data == "ADD_TRUNK_SUCCESS"){
										this.$alert('添加成功', '提示', {
										         confirmButtonText: '确定',
										       });
									}
									else{
										this.$alert('添加失败', '提示', {
										         confirmButtonText: '确定',
										       });
									}
								}).catch(err=> {
									this.$alert('请求失败', '提示', {
									         confirmButtonText: '确定',
									       });
								});
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '取消输入'
				          });       
				        });
			},
			trunkCard(row){
				localStorage.setItem('cardDetail',JSON.stringify(row));
				this.$router.push({path:"/trunkcard"});
			}
		},
		beforeMount: function() {
			this.getTrunk();
			this.getDefaultStaff();
		}
	}
</script>

<style>
</style>
