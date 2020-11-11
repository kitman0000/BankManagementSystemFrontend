<template>
	<div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
			<el-table style="width: 100%;" :data="warningList">
				<el-table-column prop="id" label="ID" width="50">
				</el-table-column>
				<el-table-column label="来源" prop="target" width="150">
				</el-table-column>
				<el-table-column label="理论金额" prop="theoryAmount" width="100">
				</el-table-column>
				<el-table-column label="实际金额" prop="actualAmount" width="100">
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">关闭</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		<el-table style="width: 100%;" :data="nettingList" @row-click="getNettingWarning">
			<el-table-column prop="id" label="ID" width="80">
			</el-table-column>
			<el-table-column label="账目数" prop="netCount" width="80">
			</el-table-column>
			<el-table-column label="轧账金额" prop="amount" width="100">
			</el-table-column>
			<el-table-column label="起始时间" prop="startTime" width="200">
			</el-table-column>
			<el-table-column label="结束时间" prop="endTime" width="200">
			</el-table-column>
			<el-table-column label="轧账时间" prop="netDate" width="200">
			</el-table-column>
			<el-table-column label="结果" prop="result" width="100">
				<template slot-scope="scope">
					<p v-if="scope.row.result == true">结果正常</p>
					<p v-if="scope.row.result == false">结果异常</p>
				</template>
			</el-table-column>
		</el-table>
		<div style="text-align: center;">
			<el-pagination background layout="prev, pager, next" :total="pageNumber" :current-page.sync="currentpage" ref="currentPage"
			 @current-change="search_button">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				nettingList: [],
				pageNumber: null,
				currentpage: 1,
				dialogVisible:false,
				warningList:[],
			}
		},
		methods: {
			getDefaultNettingList() {
				axios.get('/api/netting/page', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.pageNumber = res.data * 10;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});

				axios.get('/api/netting/netting', {
						params: {
							page: 1
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						var a = eval(res.data);
						
						for(var i=0;i<a.length;i++){
							a[i].startTime = new Date(a[i].startTime).toLocaleDateString().replace(/\//g, '-');
							a[i].endTime = new Date(a[i].endTime).toLocaleDateString().replace(/\//g, '-');
							a[i].netDate = new Date(a[i].netDate).toLocaleDateString().replace(/\//g, '-');
						}
						
						this.nettingList = a;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			search_button(currentpage) {
				this.currentpage = currentpage;
				axios.get('/api/netting/netting', {
						params: {
							page: this.currentpage
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						var a = eval(res.data);
						
						for(var i=0;i<a.length;i++){
							a[i].startTime = new Date(a[i].startTime).toLocaleDateString().replace(/\//g, '-');
							a[i].endTime = new Date(a[i].endTime).toLocaleDateString().replace(/\//g, '-');
							a[i].netDate = new Date(a[i].netDate).toLocaleDateString().replace(/\//g, '-');
						}
						
						this.nettingList = a;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getNettingWarning(row, col, e) {
				axios.get('/api/netting/warning', {
					params: {
						nettingSign:row.sign,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.warningList = eval(res.data);
					
					this.dialogVisible = true;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			}
		},
		beforeMount: function() {
			this.getDefaultNettingList();
		}
	}
</script>

<style>
</style>
