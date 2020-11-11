<template>
	<div>
		<label>状态：</label>
		<el-select v-model="value8" filterable placeholder="请选择状态" ref="statusSelector">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" >
			</el-option>
		</el-select>
		<label style="margin-left: 10px;">用户名：</label>
		<el-input placeholder="所要查询的用户名" v-model="searchUserName" style="width: 300px;"></el-input>
		<el-button type="primary" @click="searchUser_searchButton()" icon="el-icon-search" style="margin-left: 10px;">搜索</el-button>
		<el-table :data="tableData2" style="width: 100%" :row-class-name="tableRowClassName" @row-dblclick="userDetail">
			<el-table-column prop="userID" label="用户ID" width="200">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="220">
			</el-table-column>
			<el-table-column prop="nickName" label="昵称" width="220">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150">
			</el-table-column>
			<el-table-column prop="role" label="角色">
			</el-table-column>
		</el-table>
		<div style="text-align: center;">
			<el-pagination background layout="prev, pager, next" :total="pageNumber" :current-page.sync="currentpage" ref="currentPage" @current-change=	"searchUser" >
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		methods: {
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (rowIndex === 1) {
					return 'warning-row';
				} else if (rowIndex === 3) {
					return 'success-row';
				}
				return '';
			},
			searchUser(currentpage) {
				this.currentpage = currentpage;
				if(!this.value8){
					this.value8 = -1;
				}
				axios.get('/api/user/user', {
				    params: {
				      username: this.searchUserName,
					  status:this.value8,
					  page:currentpage,
				    },headers:{
					"token":localStorage.getItem("token"),
				}
				  })
				  .then(res=>{
						var response=res.data;
						this.tableData2=[];
						this.tableData2=eval(response);
						this.currentpage= currentpage;
					})
				  .catch(function (error) {
				    alert("请求失败！");
				  });
			},
			searchUser_searchButton() {
				if(!this.value8){
					this.value8 = -1;
				}
				axios.get('/api/user/user', {
				    params: {
				      username: this.searchUserName,
					  status:this.value8,
					  page:this.currentpage,
				    },headers:{
					"token":localStorage.getItem("token"),
				}
				  })
				  .then(res=>{
						var response=res.data;
						this.tableData2=[];
						this.tableData2=eval(response);
					})
				  .catch(function (error) {
				    alert("请求失败！");
				  });
			},
			userDetail(row,event){
				localStorage.setItem("chosenUser",row.userID);
				this.$router.push({path:'/UserDetail'});
			},
		},
		created:function(){
			axios.get('/api/user/userPageNumber', {
			    params: {
			      username:'',
				  status:-1,
			    },headers:{
					"token":localStorage.getItem("token"),
				}
			  })
			  .then(res=>{
						var response=res.data;
						this.pageNumber=response*10;
					})
			  .catch(function (error) {
			    alert("请求失败！");
			  });
			  axios.get('/api/user/user', {
			      params: {
			      username: '',
			  	  status:-1,
				  page:1,
			      },
				  headers:{
				  	"token":localStorage.getItem("token"),
				  }
			    })
			    .then(res=>{
						var response=res.data;
						this.tableData2=eval(response);
					})
		},
		data() {
			return {
				tableData2: [
					{userID:'',}
				],
				options: [{
					value: '-1',
					label: '所有'
				}, {
					value: '0',
					label: '禁用'
				}, {
					value: '1',
					label: '允许'
				}, {
					value: '2',
					label: '注销'
				}],
				value8: null,
				pageNumber: 100,
				searchUserName:'',
				currentpage:1,
			}
		},
	}
</script>

<style>
	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
</style>
