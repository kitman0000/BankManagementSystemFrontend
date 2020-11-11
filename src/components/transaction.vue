<template>
	<div>
		<span class="demonstration">起止时间：</span>
		<el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
		</el-date-picker>
		<span class="demonstration" style="margin-left: 10px;">显示资产端：</span>
		<el-select v-model="showAssets" placeholder="请选择">
			<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<span class="demonstration" style="margin-left: 10px;">显示现金端：</span>
		<el-select v-model="showCash" placeholder="请选择">
			<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		</br>
		<span class="demonstration" style="margin-top: 10px;">显示借贷端：</span>
		<el-select v-model="showDebt" placeholder="请选择">
			<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<el-button type="primary" @click="searchTransaction()" icon="el-icon-search" style="margin-left: 10px;margin-top: 10px;">搜索</el-button>
		
		<el-table style="width: 100%;" :data="Transaction">
			<el-table-column prop="id" label="ID" width="150">
			</el-table-column>
			<el-table-column label="机构名" prop="agencyName" width="150">
			</el-table-column>
			<el-table-column label="来源" prop="target" width="250">
			</el-table-column>
			<el-table-column label="柜台人员名" prop="tellerName" width="500">
			</el-table-column>
			<el-table-column label="金额" prop="amount" width="500">
			</el-table-column>
			<el-table-column label="交易时间" prop="transactDatetime" width="300">
			</el-table-column>
			<el-table-column label="备注" prop="remark" width="300">
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
				showAssets: null,
				showCash: null,
				showDebt: null,
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
				if(!this.value1){
					startTime = '';
					endTIme = '';
				}
				else{
					startTime = this.value1[0];
					endTIme = this.value1[1];
				}
				axios.get('/api/transaction/search', {
					params: {
						startTime:startTime,
						endTIme:endTIme,
						showAssets:this.showAssets,
						showCash:this.showCash,
						showDebt:this.showDebt,
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
				
			}
		},
		beforeMount: function() {
			this.getDefaultTransaction();
		}
	}
</script>

<style>
</style>
