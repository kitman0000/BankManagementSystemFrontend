<template>
	<div>
		<div>
		<div style="display: inline-block;line-height: 32px;">
			<span style="line-height: 32px;">123</span>
		</div>
		<ve-pie :data="chartData" :legend="legend" :title="title" :tooltip="tooltip" :theme="custheme" style="display: inline-block;width: 70%;"></ve-pie>
		</div>
		<div style="margin-top: 1px;">
			<ve-line :data="amountLine" :title="title1" :theme="custheme" :tooltip="amountLineTooltip" :legend-visible="false" style="display: inline-block;width: 50%;"></ve-line>
			<ve-line :data="amountCount" :title="title2" :theme="custheme" :tooltip="amountCountTooltip" :legend-visible="false"
			 style="display: inline-block;width: 50%;"></ve-line>
		</div>
		<ve-histogram :data="HisData" :grid="grid"  :title="HisTitle" :legend-visible="false" :extend="extend" :tooltip="HisTooltip" :theme="custheme"></ve-histogram>
	</div>
</template>

<script>
	import axios from 'axios';
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	export default {
		data() {
			return {
				title: {
					text: '资金数额',
					left: 'center'
				},
				title1: {
					text: '近20日交易流水数额',
					left: 'center'
				},
				title2: {
					text: '近20日交易流水次数',
					left: 'center'
				},
				extend: {
					 'xAxis.0.axisLabel.rotate': -20,
					  'xAxis.0.axisLabel.interval': 0,
					  'xAxis.0.axisTick.show': true,
					  'xAxis.0.type': 'category',
					  'xAxis.0.axisTick.alignWithLabel': true,
					  'xAxis.0.axisLabel.align': 'center',
					  'xAxis.0.axisLabel.margin': 35,
				},
				grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				HisTitle: {
					text: '机构现金',
					left: 'center'
				},
				custheme: require("../assets/purple-passion.json"),
				legend: {
					orient: 'vertical',
					left: 'left',
				},
				tooltip: {
					trigger: 'item',
					formatter: '{b} : {c}元 ({d}%)',
				},
				amountCountTooltip: {
					trigger: 'axis',
					formatter: function(datas) {
						var res = datas[0].name + '<br/>',
							val;
						for (var i = 0, length = datas.length; i < length; i++) {
							val = datas[i].value[1];
							res += '交易次数' + '：' + val + '次<br/>';
						}
						return res;
					}
				},
				amountLineTooltip: {
					trigger: 'axis',
					formatter: function(datas) {
						var res = datas[0].name + '<br/>',
							val;
						for (var i = 0, length = datas.length; i < length; i++) {
							val = datas[i].value[1];
							res += '交易数额' + '：' + val + '元<br/>';
						}
						return res;
					}
				},
				HisTooltip: {
					trigger: 'axis',
					formatter: function(datas) {
						var res = datas[0].name + '<br/>',
							val;
						for (var i = 0, length = datas.length; i < length; i++) {
							val = datas[i].value;
							res += '现金' + '：' + val + '元<br/>';
						}
						return res;
					}
				},
				chartData: {
					columns: ['form', 'amount'],
					rows: [{
						form: '资产端金额',
						amount: null,
					}, {
						form: '借贷端金额',
						amount: null,
					}, {
						form: '现金端金额',
						amount: null,
					}],
				},
				amountLine: {
					columns: ['billDate', 'amount'],
					rows: null,
				},
				amountCount: {
					columns: ['billDate', 'netCount'],
					rows: null,
				},
				HisData:{
					columns: ['agencyName', 'cash'],
					rows: null,
				},
			}
		},
		methods: {
			getAssetDebtCash() {
				axios.get('/api/dashboard/assetDebtCash', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						var a = eval(res.data);
						this.chartData.rows[0].amount = a.asset;
						this.chartData.rows[1].amount = a.debt;
						this.chartData.rows[2].amount = a.cash;
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getAgencyCash() {
				axios.get('/api/dashboard/agencyCash', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.HisData.rows = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getBillAmount() {
				axios.get('/api/dashboard/billAmount', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.amountLine.rows = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			getBillCount() {
				axios.get('/api/dashboard/billCount', {
						params: {},
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.amountCount.rows = eval(res.data);
					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
		},
		beforeMount: function() {
			this.getAssetDebtCash();
			this.getAgencyCash();
			this.getBillAmount();
			this.getBillCount();
		}
	}
</script>

<style>
</style>
