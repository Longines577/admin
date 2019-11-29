<!--组织架构树形图 -->
<template>
	<section class="layout-o">
		<div class="org-struct-chart">
			<div class="heade">
				<span class="middle text">组织架构</span>
			</div>
			<div id="orgStructChart"></div>
		</div>
	</section>
</template>

<script>
	import Resize from '@/utils/resize.js'
	let echartsPromise = (() => import('echarts'))()
	let echarts = null
	
	export default {
		name: 'OrgStructChart',
		props: {},
		data() {
			return {
				orgStructChart: null,
				orgStructChartData: [],
				orgStructQueryData: [],
				resizeFlag: false,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				orgStructChartInterval: null
			}
		},
		watch: {},
		mounted: function() {
			this.$nextTick(() => {
				const el = document.getElementById('orgStructChart')
				const orgStructChartInterval = setInterval(() => {
					if(el.offsetWidth > 0) {
						echartsPromise.then((ec)=>{
							echarts = ec
							this.queryOrgStructChart()
						})
						clearInterval(orgStructChartInterval)
					}
				}, 0)
			})
		},
		methods: {
			switchBtnClick(index) {
				this.displayIndex = index
			},
			bindOrgStructChartClick() {
				
				let that = this
				// let store = this.$store
				this.orgStructChart.on('click', function(params) {
					var id = that.orgStructQueryData[params.dataIndex - 1].id
					that.$fetch({
						url: 'system/api/queryTwoDepartNum',
						method: "post",
						data: {
							parentId: id, 
							busId: that.busId
						},
						}).catch(error => {
							that.$message.error(that.apiName + "接口出错！");
						}).then((data) => {
							
						if (data.data.code == 30000) {
							
							if(data.data.result.length>0){
								that.orgStructQueryData  = data.data.result
							}else{
								that.$emit('get-data',id)
							}
							that.sortQueryData()
							that.convert2ChartData()
							that.loadOrgStructChart()
						}
					})
				});
			},
			queryOrgStructChart() {
				this.$fetch({
					url: 'system/api/queryTopDepartNum',
					method: "post",
					data: {
						subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
						busId: this.busId
					},
				}).catch(error => {
					this.$message.error(this.apiName + "接口出错！");
				}).then((data) => {
					
				if (data.data.code == 30000) {
					
					this.orgStructQueryData  = data.data.result
					this.sortQueryData()
					this.convert2ChartData()
					this.loadOrgStructChart()
				}
				})
				
			},
			sortQueryData() {
				this.orgStructQueryData.sort(function(a, b) {
					return b.num - a.num
				})
			},
			convert2ColorByArr(i) {
				let index = i % 10
				let opacity = 1 - index * 0.1
				return `rgba(41, 93, 207, ${opacity})`
			},
			convert2ChartData() {
				this.orgStructChartData = []
				for (let i in this.orgStructQueryData) {
					let item = this.orgStructQueryData[i]
					this.orgStructChartData.push({
						name: `${item.label}\n总人数(人)`,
						value: item.num,
						itemStyle: {
							normal: {
								label: {
									show: true,
									textStyle: {
										color: '#fff',
										fontSize: 40
									}
								},
								color: this.convert2ColorByArr(i),
								borderWidth: 0
							}
						}
					})
				}
			},
			chartsResize() {
				const _self = this
				const el = document.getElementById('orgStructChart')
				this.orgStructChartInterval = requestAnimationFrame(function req(){
					if (el.offsetWidth > 0) {
						cancelAnimationFrame(_self.orgStructChartInterval)
						_self.orgStructChart && _self.orgStructChart.resize()
					} else {
						_self.orgStructChartInterval = requestAnimationFrame(req)
					}
				})
			},
			loadOrgStructChart() {
				if(!this.orgStructChart) {
					this.orgStructChart = echarts.init(document.getElementById('orgStructChart'))
					Resize.on(document.getElementById('orgStructChart'), ()=>{
						this.chartsResize()
					})
					this.bindOrgStructChartClick()
				}
				this.orgStructChart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c}"
					},
					calculable: false,
					series: [{
						name: '矩形图',
						width: '100%',
						height: '100%',
						nodeClick: false,
						type: 'treemap',
						breadcrumb: {
							show: false
						},
						roam: false,
						itemStyle: {
							normal: {
								borderWidth: 1
							}
						},
						label: {
							normal: {
								show: true,
								formatter: [
									'{val|{c}}',
									'{tip|{b}}'
								].join('\n'),
								rich: {
									val: {
										width: 10,
										fontSize: 48,
										fontFamily: "PingFangSC-Semibold",
										color: '#fff',
										align: 'center',
										height: 60
									},
									tip: {
										fontSize: 18,
										color: '#fff',
										align: 'center'
									}
								}
							}
						},
						data: this.orgStructChartData
					}]
				})
			},
			dateHandler(val) {
				
			},
		}
	}
</script>

<style scoped>
	#orgStructChart {
		width: 100%;
		height: 800px;
	}
	
	.org-struct-chart {
		background: #fff;
		padding: 0 20px 20px 20px;
	}
	
	.heade {
		height: 68px;
		line-height: 68px;
	}
	
	.heade .text {
		font-size: 14px;
		color: #000000;
		font-family: "PingFangSC-Semibold","Microsoft YaHei", Arial, Helvetica, sans-serif, "SimSun";
	}
	
	.heade .el-date-editor {
		float: right;
	}
</style>