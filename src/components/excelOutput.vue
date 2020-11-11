<template>
	<div>
		<span class="demonstration">SQL语句：</span>
		<el-input placeholder="请输入查询的SQL语句" v-model="sql" style="width: 15%; margin: 20px;"></el-input>
		<el-button type="primary" @click='search_button()' icon="el-icon-search">查询</el-button>
		</br>
		<a :href="url" v-if="url">已搜索完成，点击此处下载</a>
	</div>
</template>

<script>
	import axios from 'axios';
		export default {
			data() {
				return {
					sql:null,
					url:null
				}
			},
			methods: {
				search_button(){
					axios.get('/api/excel/excel', {
						params: {
							sql:this.sql,
						},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.url = '/upload'+ res.data;
					})
					.catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
				}
			},
			
		}
</script>

<style>
</style>
