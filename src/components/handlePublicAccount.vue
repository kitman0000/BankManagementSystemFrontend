<template>
	<div>
		<el-table style="width: 100%;" :data="handlePublicAccountList">
			<el-table-column prop="name" label="账户名" width="250">
			</el-table-column>
			<el-table-column label="客户名" prop="clientName" width="180">
			</el-table-column>
			<el-table-column label="账户类别" width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.accountType == 1">基本账户</span>
					<span v-if="scope.row.accountType == 2">一般账户</span>
					<span v-if="scope.row.accountType == 3">临时账户</span>
					<span v-if="scope.row.accountType == 4">专业账户</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="handleApple(scope.row.id,true)">同意</el-button>
					<el-button type="text" @click="handleApple(scope.row.id,false)">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="search_page" :current-page="currentPage"
		layout=" prev, pager, next"  :total="publicAccountPage" align='center'>
		</el-pagination>
	</div>
</template>
<script>
	import axios from 'axios';
	export default {

		data() {
			return {
				handlePublicAccountList:[],
				publicAccountPage:null,
				currentPage:1,
			}
		},
		methods: {
			getDefaultPublicAccountLIst(){
				axios.get('/api/publicAccountApply/page', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"), 
					}
				})
				.then(res => {
					this.publicAccountPage = res.data*10;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
				axios.get('/api/publicAccountApply/ApplyList', {
					params: {
						page:1,
					},
					headers: {
						"token": localStorage.getItem("token"), 
					}
				})
				.then(res => {
					this.handlePublicAccountList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			search_page(currentPage){
				this.currentPage = currentPage;
				axios.get('/api/publicAccountApply/ApplyList', {
					params: {
						page:this.currentPage,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.handlePublicAccountList = eval(res.data);
				})
				.catch(function(error) {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			handleApple(id,result){
				var parmas = new URLSearchParams();
				parmas.append("id",id);
				if(result){
					var a = 1;
				}
				else{
					var a = 0;
				}
				parmas.append("result",a);
				axios.post('/api/publicAccountApply/apply', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "HANDLE_SUCCESS"){
							this.$alert('处理成功', '提示', {
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
		beforeMount:function(){
			this.getDefaultPublicAccountLIst();
		}
		
	}
</script>

<style>
</style>
