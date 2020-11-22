<template>
	<div>
		<span class="demonstration">起止时间：</span>
		<el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
		</el-date-picker>
		<span class="demonstration" style="margin-left: 10px;">资产端：</span>
		<el-select v-model="showAssets" placeholder="请选择">
			<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<span class="demonstration" style="margin-left: 10px;">现金端：</span>
		<el-select v-model="showCash" placeholder="请选择">
			<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>

		<span class="demonstration" style="margin-left: 10px;">借贷端：</span>
		<el-select v-model="showDebt" placeholder="请选择">
			<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		
		<span class="demonstration" style="margin-left: 10px;">账号：</span>
		<el-input v-model="accountID" style="width: 200px;"></el-input>
		
		<el-button type="primary" @click="searchTransaction()" icon="el-icon-search" style="margin-left: 10px;margin-top: 10px;">搜索</el-button>
		
		<div style="margin-top: 20px;margin-bottom: 20px;">
		<span>*搜索某一账号时，只显示借贷端账单</span>
		</div>
		
		<el-table style="width: 100%;" :data="Transaction">
			<el-table-column prop="id" label="ID" width="150">
			</el-table-column>
			<el-table-column label="机构名" prop="agencyName" width="150">
			</el-table-column>
			<el-table-column label="目标" prop="target" width="250">
			</el-table-column>
			<el-table-column label="柜台人员名" prop="tellerName" width="300">
			</el-table-column>
			<el-table-column label="金额" prop="amount" width="300">
			</el-table-column>
			<el-table-column label="交易时间" prop="transactDatetime" width="300">
			</el-table-column>
			<el-table-column label="备注" prop="remark" width="300">
			</el-table-column>
			<el-table-column label="所属账单" prop="account" width="100">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				value1: [],
				showAssets: true,
				showCash: true,
				showDebt: true,
				accountID:"",
				options1: [{
						value: true,
						label: '显示'
					}, {
						value: false,
						label: '不显示'
					}
				],
				options2: [{
						value: true,
						label: '显示'
					}, {
						value: false,
						label: '不显示'
					}
				],
				options3: [{
						value: true,
						label: '显示'
					}, {
						value: false,
						label: '不显示'
					}
				],
				Transaction:[],
			}
		},
		methods: {
			
			getDefaultTransaction(){
				axios.get('/api/transaction/search', {
					params: {
						startTime:'',
						endTIme:'',
						showAssets:true,
						showCash:true,
						showDebt:true,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.Transaction = eval(res.data);
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			searchTransaction(){
				var myDate = new Date();
				var startTime,endTIme;
				if(!this.value1[0] || !this.value1[1]){
					this.$alert('请输入起止时间', '提示', {
					         confirmButtonText: '确定',
					       });
					return;
				}
				else{
					startTime = this.value1[0];
					endTIme = this.value1[1];
				}
				
				if(this.accountID != ""){
					// 如果查询某账户，只查询贷款端
					this.showAssets = false;
					this.showCash = false;
					this.showDebt = true;
				}
				
				axios.get('/api/transaction/search', {
					params: {
						startTime:startTime,
						endTime:endTIme,
						showAssets:this.showAssets,
						showCash:this.showCash,
						showDebt:this.showDebt,
						accountID:this.accountID
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.Transaction = eval(res.data);
					for (var i = 0; i < this.Transaction.length; i++) {
						var tag = this.Transaction[i].tag;
						switch(tag){
							case 1:
								this.Transaction[i].account = "资产端";
								break;
							case 2:
								this.Transaction[i].account = "借贷端";
								break;
							case 3:
								this.Transaction[i].account = "现金端";
								break;
						}
					}
				})
				.catch(err=> {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
			},
			getAccountID(){
				this.accountID = this.$route.query.accountID;
			}
		},
		beforeMount: function() {
			this.getDefaultTransaction();
			this.getAccountID();
		}
	}
</script>

<style>
</style>
