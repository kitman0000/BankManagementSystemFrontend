<template>
	<div>
		<el-form label-width="80px" v-model="announcement">
			<el-form-item label="标题">
				<el-input v-model="announcement.title" style="width: 500px;"></el-input>
			</el-form-item>
			<el-form-item label="内容">
				<el-input type="textarea" v-model="announcement.content" rows="15" style="width: 800px;height: 500px;"></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" icon="el-icon-check" @click='addAnnouncement()' style="border: 0px ;margin-right: 25px;float: right;">确认发布</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				announcement:[],
			}
		},
		methods: {
			addAnnouncement(){
				var parmas = new URLSearchParams();
				
				parmas.append("title",this.announcement.title);
				parmas.append("content",this.announcement.content);
				axios.post('/api/announcement/announcement', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "HANDLE_ANNOUNCEMENT_SUCCESS"){
							this.$alert('发布成功', '提示', {
							         confirmButtonText: '确定',
							       });
						}
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
						         confirmButtonText: '确定',
						       });
					});
			}
		},
		beforeMount: function() {

		}
	}
</script>

<style>
</style>
