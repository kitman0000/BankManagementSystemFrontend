<template>
	<div class="home">
		<div :class="{ 'page': shoot,'page-error':shake}"  style="left: 35%;position: absolute;width: 550px;margin-top: 100px;padding-bottom: 50px;">
			<div style="padding-left: 50px;padding-right: 50px;" align="center">
				<img src="../assets/bank_sq.png" width="350px" style="margin-top: 15px;">
				
				<el-form label-width="80px" style="margin-top: 5px;">
					<div style="float: left;">
						<el-form-item label="用户名:">
							<el-input v-model="userName" style="width: 100%;"></el-input>
						</el-form-item>
						<el-form-item label="密码:">
							<el-input v-model="pwd" style="width: 100%;" type="password"></el-input>
						</el-form-item>
					</div>
					
					<div style="float: left;" >
						<i class="el-icon-right loginBtn" @click="login()"></i>
					</div>
					
				</el-form>
			</div>
		</div>
	</div>
	
	
</template>

<script>
	// @ is an alias to /src
	import axios from 'axios';
	export default {
		data() {
			return {
				labelPosition: 'right',
				userName: '',
				pwd: '',
				isNormalUser: true,
				isPrimelUser: false,
				options:[],
				value:'',
				shoot: false,
				shake:false,
			};
		},
		methods: {
			login() {
				var userLogin = new URLSearchParams();
				userLogin.append("username", this.userName);
				userLogin.append("pwd", this.$md5(this.pwd));
				if(this.isNormalUser){
					this.shoot = true;

					axios.post('/api/account/login', userLogin)
						.then(res => {
							if(res.data == 'USER_LOGIN_FAILED'){
								this.shoot = false;
								//this.shake = true;
								
								this.$notify.error({
								  title: '抱歉',
								  message: '账户名和密码错误，请重新输入'
								});
								
								//setTimeout(() => location.reload(), 1000);
							}
							else{
								localStorage.setItem('token',res.data);
								localStorage.setItem('username',this.userName);
								
								var username = this.userName;
								
								this.$notify({
								  title: '欢迎',
								  message: '欢迎登录,' + username,
								  type: 'success'
								});
																
								setTimeout(() => this.$router.push({path:"/MainView"}), 1500);
								
							}
						}).catch(err => {
							this.$alert('服务器请求异常', '提示', {
							         confirmButtonText: '确定',
							       });
						});
				
				}
				
			},

		},
		beforeMount:function(){
			
		}
	}
</script>
<style>
	.loginBtn{
		margin-left: 30px;
		margin-top: 30px;
		background-color:  rgb(91, 98, 125);
		color: white;
		font-size: 35px;
		padding-top: 2px;
		padding-bottom: 2px;
		padding-left: 13px;
		padding-right: 13px;
		border-radius: 5px;
	}
	
	.page{
			animation:success 2s;
			-webkit-animation:success 2s; /* Safari and Chrome */
	}
	
	.page-error{
			animation:failed 0.5s;
			-webkit-animation:failed 0.5s; /* Safari and Chrome */
	}
	
	@keyframes failed
	{
		25% {left:660px;}
		50% {left:610px;}
		75% {left:660px;}
		100% {left:610px;}
	}




	@keyframes success
	{
		100% {left:150%; transform: scale(0.7)}
	}

</style>
