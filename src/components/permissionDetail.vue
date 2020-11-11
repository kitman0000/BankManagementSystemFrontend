<template>
	<el-table :data="tableData" border style="width: 100%">
		<el-table-column prop="permissionID" label="权限ID" width="180">
		</el-table-column>
		<el-table-column prop="permissionName" label="权限名" width="180">
		</el-table-column>
		<el-table-column prop="info" label="信息">
		</el-table-column>
	</el-table>
</template>

<script>
	import axios from 'axios';
	export default {
		methods: {

		},

		data() {
			return {
				tableData: [],
			}
		},
		beforeCreate: function() {
			axios.get('/api/role/permission', {
					params: {},
					headers: {
						token: localStorage.getItem("token"),
					}
				})
				.then(res => {
					var response = res.data;
					this.tableData = [];
					localStorage.setItem("permission", response);
					this.tableData = eval(response);
				})
		}
	}
</script>

<style>
</style>
