<template>
	<div>
		<h3>发件详情</h3>
		<p>标题: {{title}}</p>
		<p>内容: </br>{{content}}</p>
		<p>发件时间: {{sendTime}}</p>
		<p>是否紧急: {{isImportant}}</p>
		<div v-if='attachment.length !=0'>
		<label>附件：</label>
		<p  v-for="item1 in attachment"><a :href="'/upload'+item1" download="">{{item1}}</a></p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				title:'',
				content:'',
				sendTime:'',
				isImportant:'',
				attachment:[],
				receiver:'',
			}
		},
		methods:{
			getMailDetail(){
				axios.get('/api/mail/mailSentDetail', {
				    params: {
				      mailID:localStorage.getItem("chosenSendedMail")
				    },headers:{
					"token":localStorage.getItem("token"),
				}
				  })
				  .then(res=>{
					  						
						var response=res.data;
						this.sender = response.sender;
						this.receiver = response.receiver;
						this.title = response.title;
						this.content = response.content;
						this.sendTime = new Date(response.sendTime).toLocaleDateString().replace(/\//g, '-');
						this.receiver = localStorage.getItem("receiver");
						if(response.important == true){
							this.isImportant = "是";
						}
						else
						{
							this.isImportant = "否";
						}
						console.log(response.attachment.length);
						if(response.attachment.length != 0){
							var a = response.attachment.split(',');
							for(var i =0 ;i<a.length;i++){
								this.attachment[i]= a[i];
							}
						}
						
					})
				  .catch(err=> {
					  
				  });
			}
		},
		beforeMount:function(){
			this.getMailDetail();
		},
		}
</script>

<style>
	
</style>
