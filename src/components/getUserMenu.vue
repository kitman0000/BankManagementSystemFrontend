<template>
	<el-table :data="tableData5" border style="width: 80%">
		<el-table-column prop="menuTitle" label="菜单标题" width="180">
		</el-table-column>
		<el-table-column prop="menuHref" label="菜单链接">
		</el-table-column>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="changeMenuTitle(scope.row)">更改菜单标题</el-button>
				<el-button type="text" size="small" @click="changeMeunHref(scope.row)">更改菜单链接</el-button>
			</template>
			</el-table-column>
	</el-table>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				tableData5: [],
			}
		},
		methods:{
			changeMenuTitle(index){
				var meuntitle;
				this.$prompt('请输入菜单标题', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					meuntitle = value;
					this.$message({
						type: 'success',
						message: '标题名: ' + value
					});
					var title = new URLSearchParams();
					title.append("permissionID", index.permissionID);
					title.append("menuHref", index.menuHref);
					title.append("menuTitle",meuntitle);
					axios.post('/api/menu/menu', title, {
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(function(response) {
							alert("成功");
						})
						.catch(function(error) {
							alert("请求失败！");
						});
				})
			},
			changeMeunHref(index){
				var menuhref;
				this.$prompt('请输入菜单链接', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					menuhref = value;
					this.$message({
						type: 'success',
						message: '链接: ' + value
					});
					var title = new URLSearchParams();
					title.append("permissionID", index.permissionID);
					title.append("menuHref", menuhref);
					title.append("menuTitle",index.menuTitle);
					axios.post('/api/menu/menu', title, {
							headers: {
								"token": localStorage.getItem("token"),
							}
						})
						.then(res=> {
							alert("成功");
						})
				});
			},
		},
		beforeMount: function() {
			axios.get('/api/menu/menu', {
					params: {},
					headers:{
						token:localStorage.getItem("token"),
					}
				})
				.then(res=>{
					var response = res.data;
					this.tableData5 = eval(response);
				})
				.catch(function(error) {
					alert("请求失败");
				});
		}
	}
</script>

<style>
</style>
