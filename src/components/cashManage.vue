<template>
	<div>
		<el-table style="width: 100%;" :data="agencyList">
			<el-table-column prop="id" label="机构id" width="80">
			</el-table-column>
			<el-table-column label="机构名" prop="name" width="300">
			</el-table-column>
			<el-table-column label="现金数" prop="cash" width="100">
			</el-table-column>
			<el-table-column label="操作" align="center" min-width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="cashToFund(scope.row.id)">现金转流动金</el-button>
					<el-button type="text" @click="fundToCash(scope.row.id)">流动金转现金</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				agencyList:[]
			}
		},
		methods: {
			cashToFund(id){
				var id = id;
				this.$prompt('请输入金额', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
				          var parmas = new URLSearchParams();
				          parmas.append("agencyID",id);
						  parmas.append("amount",value);
				          axios.post('/api/cashManage/cashToFund', parmas, {
				          		headers: {
				          			"token": localStorage.getItem("token"),
				          		}
				          	})
				          	.then(res => {
				          		if(res.data == "TRANSFER_SUCCESS"){
				          			this.$alert('转换成功', '提示', {
				          			         confirmButtonText: '确定',
				          			       });
								window.location.reload();
				          		}
				          		else{
				          			this.$alert('转换失败', '提示', {
				          			         confirmButtonText: '确定',
				          			       });
									window.location.reload();
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
			getCash(){
				axios.get('/api/cashManage/cash', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			fundToCash(id){
				var id = id;
				this.$prompt('请输入金额', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value }) => {
				          var parmas = new URLSearchParams();
				          parmas.append("agencyID",id);
						  parmas.append("amount",value);
				          axios.post('/api/cashManage/fundToCash', parmas, {
				          		headers: {
				          			"token": localStorage.getItem("token"),
				          		}
				          	})
				          	.then(res => {
				          		if(res.data == "TRANSFER_SUCCESS"){
				          			this.$alert('转换成功', '提示', {
				          			         confirmButtonText: '确定',
				          			       });
									window.location.reload();
				          		}
				          		else{
				          			this.$alert('转换失败', '提示', {
				          			         confirmButtonText: '确定',
				          			       });
									window.location.reload();
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
		},
		beforeMount: function() {
			this.getCash();
		}
	}
</script>

<style>
</style>
