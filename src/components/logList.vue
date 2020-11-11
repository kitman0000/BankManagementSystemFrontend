<template>
	<div>
		<el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
		</el-date-picker>
		<el-button type="primary" @click="searchLog_searchButton()" icon="el-icon-search" style="margin-left: 10px;">搜索</el-button>
		<el-table style="width: 100%;" :data="logList">
			<el-table-column label="用户名" prop="username" width="150">
			</el-table-column>
			<el-table-column label="变量名" prop="methodName" width="250">
			</el-table-column>
			<el-table-column label="参数" prop="args" width="500">
			</el-table-column>
			<el-table-column label="记录时间" prop="logTime" width="300">
			</el-table-column>
		</el-table>
		<div style="text-align: center;">
			<el-pagination background layout="prev, pager, next" :total="pageNumber" :current-page.sync="currentpage" ref="currentPage" @current-change="search_button" >
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				value1:[],
				pageNumber:null,
				currentpage:1,
				logList:[],
			}
		},
		methods: {
			getDefaultLog(){
				var myDate = new Date();
				var a = myDate.getMonth()+1;
				var b = myDate.getDate()+1;
				var startTime = myDate.getFullYear()+'/'+a+'/'+myDate.getDate();
				var endTIme = myDate.getFullYear()+'/'+a+'/'+b;
				axios.get('/api/log/page', {
					params: {
						startTime:startTime,
						endTIme:endTIme,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.pageNumber = res.data * 10;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
				axios.get('/api/log/list', {
					params: {
						startTime:startTime,
						endTIme:endTIme,
						page:1
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.logList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			
			search_button(currentpage){
				var myDate = new Date();
				var a = myDate.getMonth()+1;
				var b = myDate.getDate()+1;
				var startTime = myDate.getFullYear()+'/'+a+'/'+myDate.getDate();
				var endTIme = myDate.getFullYear()+'/'+a+'/'+b;
				this.currentpage = currentpage;
				if(this.value1){
					startTime = startTime;
					endTIme = endTIme;
				}
				else{
					startTime = this.value1[0];
					endTIme = this.value1[1];
				}
				axios.get('/api/log/list', {
					params: {
						startTime:startTime,
						endTIme:endTIme,
						page:this.currentpage
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.logList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			searchLog_searchButton(){
				var myDate = new Date();
				var a = myDate.getMonth()+1;
				var b = myDate.getDate()+1;
				var startTime = myDate.getFullYear()+'/'+a+'/'+myDate.getDate();
				var endTIme = myDate.getFullYear()+'/'+a+'/'+b;
				
				if(this.value1){
					startTime = startTime;
					endTIme = endTIme;
				}
				else{
					startTime = this.value1[0];
					endTIme = this.value1[1];
				}
				axios.get('/api/log/page', {
					params: {
						startTime:startTime,
						endTIme:startTime,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.pageNumber = res.data * 10;
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
				axios.get('/api/log/list', {
					params: {
						startTime:startTime,
						endTIme:endTIme,
						page:1
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.logList = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			}
		},
		beforeMount: function() {
			this.getDefaultLog();
		}
	}
</script>

<style>
</style>
