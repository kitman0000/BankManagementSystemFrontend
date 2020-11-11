<template>
	<el-table :data="tableData4" border style="width: 100%">
		<el-table-column prop="permissionID" label="权限ID" width="180">
		</el-table-column>
		<el-table-column prop="permissionName" label="权限名" width="180">
		</el-table-column>
		<el-table-column prop="permissionInfo" label="权限信息" width="250">
		</el-table-column>
		<el-table-column prop="menuHref" label="指向链接">
		</el-table-column>
	</el-table>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				tableData4: [],
			}
		},
		beforeMount: function() {
			axios.get('/api/menu/menu', {
					params: {},
					headers: {
						token: localStorage.getItem("token"),
					}
				})
				.then(res => {
					var response = res.data;
					this.tableData4 = eval(response);
				})
		}
	}
</script>

<style>
</style>
