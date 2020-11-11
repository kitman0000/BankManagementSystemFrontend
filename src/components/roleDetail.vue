<template>
	<div>
		<el-table :data="tableData3" border style="width: 100%">
			<el-table-column prop="roleID" label="角色ID" width="180">
			</el-table-column>
			<el-table-column prop="roleName" label="角色名" width="250">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="deleteRole(scope.row)">删除角色</el-button>
					<el-button type="text" size="small" @click="addPermission_rea(scope.row)">添加权限</el-button>
					<el-button type="text" size="small" @click="PermissionDetail(scope.row)">查看权限</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-button icon="el-icon-plus" style="float: right;margin-top: 20px;" @click="addRole()">添加角色</el-button>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
			<el-table :data="notOwnedPermissions" border style="width: 100%">

				<el-table-column prop="permissionName" label="权限名" width="250">
				</el-table-column>
				<el-table-column prop="info" label="权限信息" width="180">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="addPermission(scope.row)">添加权限</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		
		
		<el-dialog title="提示" :visible.sync="dialogVisible1" width="70%">
			<el-table :data="ownedPermission" border style="width: 100%">
		
				<el-table-column prop="permissionName" label="权限名" width="250">
				</el-table-column>
				<el-table-column prop="info" label="权限信息" width="180">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="deletePermission(scope.row)">删除权限</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible1 = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		methods: {
			addRole() {
				var addroleName;
				this.$prompt('请输入角色名', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					addroleName = value;
					this.$message({
						type: 'success',
						message: '角色名: ' + value
					});
					var rolename = new URLSearchParams();
					rolename.append("roleName", addroleName);
					axios.post('/api/role/role', rolename, {
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '失败'
					});
				});
			},

			deleteRole(index) {
				axios.delete('/api/role/role', {
						params: {
							roleID: index.roleID,
						},

						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {

						if (res.data == "ROLE_DELETE_SUCCESS") {
							alert("删除成功");
						}
					})
					.catch(err => {
						console.log(error);
					});
			},

			addPermission(index) {
				var parmas = new URLSearchParams();
				parmas.append("roleID",this.roleID);
				parmas.append("permissionID",index.permissionID);
				axios.post('/api/role/rolePermission', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == 'PERMISSION_ADD_SUCCESS'){
							this.$alert('添加成功', '提示', {
							         confirmButtonText: '确定',
							       });
								   
						window.location.reload();
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
			},

			deletePermission(index) {
				this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          axios.delete('/api/role/rolePermission', {
				          	params: {
				          		permissionID: index.permissionID,
								roleID:this.roleID,
				          	},
				          	headers: {
				          		"token": localStorage.getItem("token"),
				          	}
				          })
				          .then(res=> {
				          	if(res.data == 'PERMISSION_DELETE_SUCCESS'){
								this.$alert('删除成功', '提示', {
								         confirmButtonText: '确定',
								       });
								window.location.reload();
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
				        });
			},
			addPermission_rea(data) {
				this.notOwnedPermissions =[];
				var i=0,j=0,k=0;
				if(data.permissionBoList.length == 0){
					this.notOwnedPermissions = this.permission;
				}
				else{
				for(i=0;i<this.permission.length;i++){
					if(this.permission[i].permissionID == data.permissionBoList[j].permissionID){
							if(j<data.permissionBoList.length-1)
								j++;
					}
					else{
						this.notOwnedPermissions[k]=this.permission[i];
						k++;
					}
				}
				}
				
				this.roleID = data.roleID;
				this.dialogVisible = true;
			},
			PermissionDetail(data){
				this.ownedPermission = data.permissionBoList;
				this.roleID = data.roleID;
				this.dialogVisible1 = true;
			}

		},
		data() {
			return {
				tableData3: [],
				roleID: null,
				dialogVisible:false,
				dialogVisible1:false,
				permission:[],
				ownedPermission:[],
				notOwnedPermissions:[],
			}
		},
		created: function() {
			axios.get('/api/role/role', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					var response = res.data;
					this.tableData3 = eval(response);
				})
				.catch(function(error) {
					console.log(error);
				});
				
				
				axios.get('/api/role/permission', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						var response = res.data;
						this.permission = eval(response);
					})
					.catch(function(error) {
						console.log(error);
					});
		}
	}
</script>

<style>
</style>
