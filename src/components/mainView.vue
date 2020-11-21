<template>
	<div>
		<el-container>
			<el-aside width="200px" >
				
				<!-- 头像区 -->
				<div align="center" style="height: 150px;padding-top: 10px;background: rgb(124, 134, 172);">
					<img :src="picUrl" style="height: 80px;width: 80px;border-radius: 50px; padding: 10px;background: rgb(230, 242, 255) ;"/>
					<br />
					欢迎您:
					<strong>{{localUsername}}</strong>
				</div>
				<!-- 头像区结束 -->
				
				<el-menu style='background-color: rgb(91, 98, 125); ' >
					<li v-for="menu in menus" >
						<el-submenu class="pTitleBG"  :index="menu.parentMenuID.toString()">
							<template slot="title" >
								<span class="pTitle" style="line-height: 0px">
									{{menu.title}}
								</span>
							</template>
							<div class="cTitleBG" v-for="subMenu in menu.menuBoList" style="background: rgb(188, 195, 219); border-bottom: 1px solid #666;">
								<el-row>
									<el-menu-item class="cTitle" :index="subMenu.menuID.toString()" @click="test(subMenu)">
										{{subMenu.menuTitle}}
									</el-menu-item>
									</el-col>
								</el-row>
							</div>
						</el-submenu>
					</li>
				</el-menu>
			</el-aside>
			 <el-container>
				<el-main style="padding: 0px 0px 0px 0px;">
					<router-view >
					</router-view>
				</el-main>
			  </el-container>
		</el-container>
	</div>
</template>
<script>
	import axios from 'axios';
	export default {
		data() {
			const item = {};
			return {
				menus:[],
				userName: '',
				userPwd: '',
				logInStatus: 0,
				picUrl:null,
				localUsername:null,
				title:'',
			}
		},
		methods: {
			getMenu(){
				axios.get('/api/menu/userMenu', {
					params: {
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.menus = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			getPic(){
				axios.get('/api/user/userPicture', {
					params: {},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.picUrl = '/upload'+res.data;
					this.localUsername = localStorage.getItem('username');
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			test(a){
				this.title = a.menuTitle;
				this.$router.push({path:a.menuHref});
			}
		},
		beforeMount:function(){
			this.getMenu();
			this.getPic();
		}
	}
</script>
<style lang="less">
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}
	
	.pTitle :hover{
		color: #000
	}
	
	.pTitle{
		color: #fff;
	}
	
	.pTitleBG :hover{
		background: #343846 !important;
		color: #fff;
	}
	
	.cTitleBG :hover{
		background: #dadff0  !important;
		color: #000;
	}
	
	.cTitleBG .is-active{
		background: #a4aaca   !important;
		color: #fff !important;
	}
	
	.is-active{
		color: #fff !important;
	}

</style>
