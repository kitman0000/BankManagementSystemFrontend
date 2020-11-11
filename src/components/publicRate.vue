<template>
	<div>
	<div>
		<h2>对公业务活期利率</h2>
		<label>利率(%)：</label>
		<span>{{depositRate}}</span>
		<el-button type="primary" style="margin-top: 0px;border: 0px ;margin-left: 10px;" icon="el-icon-plus"
		 @click="dialogVisible = true">修改利率</el-button>
	</div>
	<div>
		<h2>对公业务定期利率</h2>
		<el-button type="primary" style="float: right;margin-top: 0px;margin-right: 10px;border: 0px ;" icon="el-icon-plus"
		 @click="addRate()">添加利率</el-button>
		 <el-table style="width: 100%;" :data="tableData2">
			<el-table-column prop="month" label="月份" width="200">
			</el-table-column>
			<el-table-column prop="rate" label="利率(%)" width="220">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="editRate(scope.row)">修改利率</el-button>
					<el-button type="text" @click="deleteRate(scope.row)">删除利率</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		

		<el-dialog title="提示" :visible.sync="dialogVisible1" width="30%">
			<el-form label-width="120px">
				<el-form-item label="月份">
					<el-input v-model="month" style="width: 150px;">
					</el-input>
				</el-form-item>
				<el-form-item label="利率">
					<el-input v-model="rate" style="width: 150px;">
					</el-input>
				</el-form-item>
			</el-form>
			<el-button @click='rateUpdate()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认修改</el-button>
		</el-dialog>
		
		<el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
			<el-form label-width="120px">
				<el-form-item label="月份">
					<el-input v-model="month" style="width: 150px;">
					</el-input>
				</el-form-item>
				<el-form-item label="利率">
					<el-input v-model="rate" style="width: 150px;">
					</el-input>
				</el-form-item>
			</el-form>
			<el-button @click='uploaRate()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认修改</el-button>
		</el-dialog>
		
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<el-form label-width="120px">
				<el-form-item label="利率">
					<el-input v-model="depositRate" style="width: 150px;">
					</el-input>
				</el-form-item>
			</el-form>
			<el-button @click='DepositRateUpdate()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认修改</el-button>
		</el-dialog>
	</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				tableData2: [],
				dialogVisible: false,
				dialogVisible1:false,
				month: null,
				rate: null,
				id: null,
				depositRate:null,
				dialogVisible2:false,
			}
		},
		methods: {
			getRate() {
				axios.get('/api/rate/publicTimeRate', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.tableData2 = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
					
					axios.get('/api/rate/publicDepositRate', {
							params: {},
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res => {
							this.depositRate = res.data;
						})
						.catch(err => {
							this.$alert('请求失败', '提示', {
								confirmButtonText: '确定',
							});
						});
			},
			deleteRate(row) {
				this.$confirm('此操作将取消该利率, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axios.delete('/api/rate/publicTimeRate', {
							params: {
								id: row.id
							},
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res => {
							if (res.data == "SUCCESS") {
								this.$alert('删除成功', '提示', {
									confirmButtonText: '确定',
								});
							window.location.reload();
							}
						})
						.catch(err => {
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
			editRate(row) {
				this.dialogVisible2 = true;
				this.month = row.month;
				this.rate = row.rate;
				this.id = row.id
			},
			uploaRate(){
				var parmas = new URLSearchParams();
				parmas.append("id", this.id);
				parmas.append("month", this.month);
				parmas.append("rate", this.rate);
				axios.put('/api/rate/publicTimeRate', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.data == "SUCCESS") {
							this.$alert('修改成功', '提示', {
								confirmButtonText: '确定',
							});
						window.location.reload();
						} else {
							this.$alert('修改失败', '提示', {
								confirmButtonText: '确定',
							});
						}
				
					}).catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			rateUpdate() {
				var parmas = new URLSearchParams();
				parmas.append("month", this.month);
				parmas.append("rate", this.rate);
				axios.post('/api/rate/publicTimeRate', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if (res.data == "SUCCESS") {
							this.$alert('修改成功', '提示', {
								confirmButtonText: '确定',
							});
						window.location.reload();
						} else {
							this.$alert('修改失败', '提示', {
								confirmButtonText: '确定',
							});
						}

					}).catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			addRate() {
				this.dialogVisible1 = true;
				this.month = null;
				this.rate = null;
			},
		
			DepositRateUpdate(){
				var parmas = new URLSearchParams();
				parmas.append("rateValue",this.depositRate);
				axios.post('/api/rate/publicDepositRate', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == 'SUCCESS'){
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
			}
			
		},
		beforeMount: function() {
			this.getRate();
		}
	}
</script>

<style>
</style>
