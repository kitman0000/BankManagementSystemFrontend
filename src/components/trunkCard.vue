<template>
	<div>
		<el-button type="primary" style="float: right;margin-top: 15px;margin-right: 10px;border: 0px ;"
		 icon="el-icon-plus" @click="addTrunkCard()">添加尾箱银行卡</el-button>
		<el-table style="width: 100%;" :data="trunkCardList">
			<el-table-column prop="account" label="银行卡号" width="300">
			</el-table-column>
			<el-table-column label="尾箱号" prop="trunkID" width="150">
			</el-table-column>
			<el-table-column label="尾箱银行卡管理" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="text" @click="deleteCard(scope.row)">删除此卡</el-button>
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
				trunkCardList:[],
			}
		},
		methods: {
			getTrunkCard(){
				var a =JSON.parse(localStorage.getItem('cardDetail'));
				axios.get('/api/trunkCard/card', {
					params: {
						userID:a.tellerID
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.trunkCardList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			deleteCard(row){
				var accountID  = row.accountID;
				var trunkID  = row.trunkID;
				this.$confirm('此操作将删除该银行卡, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          axios.delete('/api/trunkCard/card', {
				          	params: {
				          		accountID:accountID,
				          		trunkID:trunkID
				          	},
				          	headers: {
				          		"token": localStorage.getItem("token"),
				          	}
				          })
				          .then(res=> {
				          		if(res.data == "SUCCESS"){
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
			addTrunkCard(){
				var a =JSON.parse(localStorage.getItem('cardDetail'));
				this.$confirm('添加50张尾箱银行卡？', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							var parmas = new URLSearchParams();
							parmas.append("trunkID",a.id);
							axios.post('/api/trunkCard/card', parmas, {
									headers: {
										"token": localStorage.getItem("token"),
									}
								})
								.then(res => {
									if(res.data == "SUCCESS"){
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
				            message: '已取消'
				          });          
				        });
			}
		},
		beforeMount: function() {
			this.getTrunkCard();
		}
	}
</script>

<style>
</style>
