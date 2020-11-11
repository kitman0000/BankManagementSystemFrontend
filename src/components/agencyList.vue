<template>
	<div>
				<span class="demonstration">机构名称：</span>
				<el-input placeholder="请输入查询的机构名称" v-model="agencyName"  style="width: 15%; margin: 20px;"></el-input>
				<el-button type="primary" @click='search_button()' icon="el-icon-search">搜索</el-button>			
				<el-button type="primary" style="float: right;margin-top: 15px;border: 0px ;" icon="el-icon-delete"
				 @click="deleteAgencies()">删除所选机构</el-button>
				<el-button type="primary" style="float: right;margin-top: 15px;margin-right: 10px;border: 0px ;"
				 icon="el-icon-plus" @click="addAgency()">添加机构</el-button>
				<el-table ref="multipleTable" style="width: 100%;" :data="agencyList" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" ></el-table-column>
					<el-table-column prop="name" label="机构名" width="250">
					</el-table-column>
					<el-table-column label="机构码" prop="bankCode" width="80">
					</el-table-column>
					<el-table-column label="所在城市" prop="cityName" width="80">
					</el-table-column>
					<el-table-column label="地址" prop="address" width="350">
					</el-table-column>
					<el-table-column label="管理者名称" prop="ownerName" width="180">
					</el-table-column>
					<el-table-column label="操作" align="center" min-width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="deleteAgency(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="修改" align="center" min-width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="editAgency(scope.row)">编辑</el-button>
						</template>
						
					</el-table-column>
				</el-table>
				<el-pagination @current-change="search_page" :current-page="currentPage"
				layout=" prev, pager, next"  :total="agencyNumber" align='center'>
				</el-pagination>
	</div>
</template>

<script>
	import axios from 'axios';
	import qs from 'qs';
	export default {
		
		data() {			
			return {
				multipleSelection: [],
				agencyList:[],
				agencyNumber:null,
				currentPage:1,
				agencyName:'',
				selectedDataTemp: [],
				editAgencyView:false,
				city:null,
				area:[],
				owner:null,
				selectOwner:false,
				Allstaff:[],
				currentStaffPage:1,
				staffNumber:null,
				selectedBankCode:null,
				selectedName:null,
				selectedAddress:null,
				selectedAgencyID:null,
			}
		},
		methods:{
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
			search_page(currentPage){
				console.log(currentPage);
				this.currentPage = currentPage;
				axios.get('/api/agency/agencyList', {
					params: {
						keywords:this.agencyName,
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
			search_button(){
				axios.get('/api/agency/agencyList', {
					params: {
						keywords:this.agencyName,
						page:1,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyList = eval(res.data);
					this.currentPage=1;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
				axios.get('/api/agency/agencyPage', {
					params: {
						keywords:this.agencyName,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyNumber = res.data * 10;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			handleSelectionChange(val) {
				let that_ = this;
				that_.multipleSelection = val;
				let a = true;
				that_.selectedDataTemp = that_.multipleSelection;
				that_.selectedDataTemp = that_.multipleSelection.filter(item => {
					return !item.a
				});
			},
			addAgency(){
				this.$router.push({path:"/AddAgency"});
			},
			deleteAgency(id){
				axios.delete('/api/agency/agency', {
					params: {
						agencyID:id
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res=> {
						if(res.data == 'AGENCY_DELETE_SUCCESS')	{
							this.$alert('删除成功', '提示', {
							         confirmButtonText: '确定',
							       });
							window.location.reload();
						}
						else{
							this.$alert('删除失败，银行内还拥有现金', '提示', {
							         confirmButtonText: '确定',
							       });
						}
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			
			deleteAgencies() {
				var selectedArray = new Array();
				for (var i = 0; i < this.multipleSelection.length; i++) {
					selectedArray.push(this.multipleSelection[i].id);
				}
			    
				this.$confirm('删除这些机构, 是否确定?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axios.delete('/api/agency/agency', {
							params: {
								agencyID: selectedArray,
							},
							paramsSerializer: params => {
								return qs.stringify(params, {
									indices: false
								})
							},
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res=> {
							if(res.data == 'AGENCY_DELETE_SUCCESS')	{
								this.$alert('删除成功', '提示', {
								         confirmButtonText: '确定',
								       });
								window.location.reload();
							}
							else{
								this.$alert('删除失败，银行内还拥有现金', '提示', {
								         confirmButtonText: '确定',
								       });
							}
						})
						.catch(err=> {
							this.$alert(err, '提示', {
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
			editAgency(row){
				localStorage.setItem('editAgency',JSON.stringify(row));
				this.$router.push({path:"/editAgency"});
			},
			search_page_edit(currentPage) {
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
		},
		beforeMount:function(){
			this.getDefaultAgencyList();
			this.getCity();
			this.getDefaultStaff();
		}
		}
</script>

<style>
</style>
