<template>
	<div class="Echarts">
		<div>
			<div id="main" style="width: 50%;display: inline-block;min-height: 350px;"></div>
			<div id="pie" style="width: 49%;display: inline-block;min-height: 350px;"></div>
		</div>
	</div>
</template>

<script>
	//import theme from '../assets/theme'
	import axios from 'axios';
	export default {
		data() {
			return {
				pieData: null
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
						this.pieData = a;
						var pie = this.$echarts.init(document.getElementById('pie'), 'theme');
						var pieOption = {
							aria: {
								show: true
							},
							title: {
								text: '资金数额',
								left: 'center'
							},
							tooltip: {
								trigger: 'item',
								formatter: '{a} <br/>{b} : {c} ({d}%)',
							},
							legend: {
								orient: 'vertical',
								left: 'left',
								data: ['资产端数额', '借贷端数额', '现金端数额']
							},
							series: [{
								name: '资金数额',
								type: 'pie',
								radius: '55%',
								center: ['50%', '50%'],
								data: [{
										name: '资产端数额',
										value: this.pieData.asset
									},
									{
										name: '借贷端数额',
										value: this.pieData.debt
									},
									{
										name: '现金端数额',
										value: this.pieData.cash
									},
								],
								emphasis: {
									itemStyle: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}]
						};
						pie.setOption(pieOption);
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

					})
					.catch(err => {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			myEcharts() {
				// 基于准备好的dom，初始化echarts实例
				var myChart = this.$echarts.init(document.getElementById('main'), 'theme');
				// 指定图表的配置项和数据
				var option = {
					title: {
						text: 'ECharts 入门示例'
					},
					tooltip: {},
					legend: {
						data: ['销量']
					},
					xAxis: {
						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				

			}
		},
		beforeMount: function() {
			

		},
		mounted: function() {
			this.$echarts.registerTheme('theme', theme);
			this.getAssetDebtCash();
			this.getAgencyCash();
			this.getBillAmount();
			this.getBillCount();
			this.myEcharts();
		}
	}
</script>
