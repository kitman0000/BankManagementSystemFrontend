<template>
	<div>
		<el-container>
			<el-header style="background-color: rgb(91, 98, 125);padding: 0px 0px;border-bottom: 1px solid #000000;">
				<img src='./assets/BOS.png' height="100%" width="200px" border="0" style="margin-left: 0px;">
			</el-header>
			<el-main style="padding: 0px 0px;">
				<router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				username:'',
				visible:false,
			}
		},
		methods: {
				getUsername(){
					this.username = localStorage.getItem('username');
					this.visible = true;
				}
		},
		watch:{
		  '$route':'getUsername'
		},
		beforeMount: function() {

		}
	}
</script>
<style>
</style>
