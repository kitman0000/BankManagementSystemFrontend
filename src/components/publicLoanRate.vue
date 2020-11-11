<template>
	<div>
		<el-button type="primary" style="float: right;margin-top: 15px;margin-right: 10px;border: 0px ;"
		 icon="el-icon-plus" @click="addRate()">添加利率</el-button>
		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible1"
		  width="30%">
		  <el-form label-width="120px">
		  	<el-form-item label="起:">
		  		<el-input v-model="startMonth" style="width: 150px;">
		  		</el-input>
		  	</el-form-item>
					<el-form-item label="至:">
						<el-input v-model="endMonth" style="width: 150px;">
						</el-input>
					</el-form-item>
			<el-form-item label="利率:">
				<el-input v-model="rate" style="width: 150px;">
				</el-input>
			</el-form-item>
			</el-form>
			<el-button @click='uploadRate()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认更新</el-button>
		</el-dialog>
		<el-table :data="tableData2" style="width: 100%"  >
			<el-table-column prop="startMonth" label="从" width="80">
			</el-table-column>
			<el-table-column prop="endMonth" label="至" width="80">
			</el-table-column>
			<el-table-column prop="rate" label="利率" width="220">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text"  @click="deleteRate(scope.row)">删除利率</el-button>
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
				tableData2:[],
				dialogVisible:false,
				month:null,
				rate:null,
				id:null,
				dialogVisible1:false,
				endMonth:null,
				startMonth:null,
			}
		},
		methods:{
			getRate(){
				axios.get('/api/rate/publicLoanRate', {
					params: {
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.tableData2 = eval(res.data);
				})
				.catch(err=>	 {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			deleteRate(row){
				this.$confirm('此操作将取消该利率, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          axios.delete('/api/rate/publicLoanRate', {
				          	params: {
				          		id:row.id
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
			addRate(){
				this.dialogVisible1 = true;
				this.startMonth = null;
				this.endMonth = null;
				this.rate = null;
			},
			uploadRate(){
				var parmas = new URLSearchParams();
				parmas.append("startMonth",this.startMonth);
				parmas.append("endMonth",this.endMonth);
				parmas.append("rate",this.rate);
				axios.post('/api/rate/publicLoanRate', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "SUCCESS"){
							this.$alert('修改成功', '提示', {
							         confirmButtonText: '确定',
							       });
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
			}
		},
		beforeMount:function(){
			this.getRate();
		}
		}
</script>

<style>
</style>
