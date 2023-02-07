<template>
	<div class="S-Table" ref="stable" style="width:100%;height:100%;position: relative;margin-bottom:15px;border-top:2px solid #064B7D;">
		<el-scrollbar style="width:100%;color:#efefef;position: absolute;height:100%;">
			<!--  :style="{height:stableHeight}" -->
			<table cellspacing="0" ref='S_My_Table' class="S-My-Table" style="text-align: center;width:100%;">
				<thead>
					<tr>
						<th v-for="(hdItem,hdIndex) in headerdata" :key="hdIndex" @click="sortTable(hdItem.type,hdIndex,!(hdItem.sort&&hdItem.sort==false)&&!(hdItem.children&&hdItem.children.length>0),hdItem.sortType?hdItem.sortType:'number')" style="cursor: pointer;" :colspan="(hdItem.children&&hdItem.children.length>0)?hdItem.children.length:1" :rowspan="(hdItem.children&&hdItem.children.length>0)?1:2" :style="{cursor:(hdItem.children&&hdItem.children.length>0)?'default':'pointer',minWidth:(!(hdItem.children&&hdItem.children.length>0)&&hdItem.width)?hdItem.width+'px':'auto',backgroundColor:fixedRowColumnBgc}" :class="hdItem.fixed=='right'?'right0':''">
							<span class="flex flex-pack-center flex-align-center" :style="{color:hdItem.title=='逆变器状态'||hdItem.title=='告警'?'#666666':'#efefef'}">
								<div style="padding-right:4px;">{{hdItem.title}}</div>
								<div class="sort flex flex-v flex-pack-center flex-align-center" v-if="!(hdItem.children&&hdItem.children.length>0)">
									<div class="up-arrow" :class="{ action: nowSortKey == hdItem.type && hdItem.order == 'asc' }"></div>
									<div class="down-arrow" :class="{ action: nowSortKey == hdItem.type && hdItem.order == 'desc' }"></div>
								</div>
							</span>
						</th>
					</tr>
					<tr>
						<th v-for="(hdItem,hdIndex) in secondRowData" :key="hdIndex" @click="sortTable(hdItem.type,hdIndex,!(hdItem.sort&&hdItem.sort==false)&&!(hdItem.children&&hdItem.children.length>0),hdItem.sortType?hdItem.sortType:'number')" style="cursor: pointer;"
						 :style="{minWidth:hdItem.width?hdItem.width+'px':'auto',backgroundColor:fixedRowColumnBgc}">
							<span class="flex flex-pack-center flex-align-center">
								<div style="padding-right:4px;">{{hdItem.title}}</div>
								<div class="sort flex flex-v flex-pack-center flex-align-center">
									<div class="up-arrow" :class="{ action: nowSortKey == hdItem.type && hdItem.order == 'asc' }"></div>
									<div class="down-arrow" :class="{ action: nowSortKey == hdItem.type && hdItem.order == 'desc' }"></div>
								</div>
							</span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(mdItem,mdIndex) in maindata" :key="mdIndex">
						<td v-for="(hdItem,hdIndex) in columnData" :key="hdIndex" :class="['s-table-'+hdItem.type,hdItem.fixed=='right'?'right0':'']" :style="{backgroundColor:fixedLeftColumn?fixedRowColumnBgc:'transparent'}">
							<slot :name="hdItem.type" :item="mdItem[hdItem.type]" :id="mdItem.id">
								{{mdItem[hdItem.type]}}
							</slot>
						</td>
					</tr>
					<tr>
						<td v-for="i in columnData.length" :key='i' style="height:2px;background-color: #064B7D;;position: sticky;bottom:0px;padding:0;"></td>
					</tr>
				</tbody>
			</table>
		</el-scrollbar>
	</div>
</template>

<script>
	//应用scss变量
	import variables from '@/assets/styles/variables.scss';
	export default {
		components: {},
		props: {
			backEndSort:{
				type:Boolean,
				default:false
			},
			pslist: {
				type: Array,
				default: ()=>{}
			},
			psListHeaderData: {
				type: Array,
				default: ()=>{}
			},
			sortFieldTypes:{
				type: Array,
				default:()=>{}
			},
			fixedRowColumnBgc: {
				type: String,
				default: variables.fixedTdBgc
			},
			fixedLeftColumn:{
				type:Boolean,
				default:false
			},
			fixedRightColumn:{
				type:Boolean,
				default:false
			},
			initSortKey: {
				type: String,
				default:''
			},
		},
		computed: {
			maindata() {
				let pslist = this.pslist;
				return pslist;
			},
			headerdata() {
				let headerdata = this.psListHeaderData;
				return headerdata;
			},
			columnData() {
				let headerdata = this.psListHeaderData;
				let columnData = [];
				headerdata.forEach((v, i) => {
					if (v.children && v.children.length > 0) {
						columnData.push(...v.children)
					} else {
						columnData.push(v)
					}
				})
				return columnData;
			},
			secondRowData() {
				let secondRowData = [];
				let headerdata = this.psListHeaderData;

				headerdata.forEach((v, i) => {
					if (v.children && v.children.length > 0) {
						secondRowData.push(...v.children)
					}
				})
				return secondRowData;
			},
			tableWidth() {
				let tableWidthNum = 0;
				let headerdata = this.psListHeaderData;
				headerdata.forEach((v, i) => {
					if (v.children && v.children.length > 0) {
						//console.log(v.children)
						secondRowData.push(...v.children)
					}
				})
				return "100%";
			}
		},
		watch:{
			maindata:function(val,oldVal){
				this.$nextTick(function(){
					// console.log(this.$refs.S_My_Table.offsetHeight)
				})
			}
		},
		data() {
			return {
				nowSortKey:'',
				myTableHeight: '100%',
				stableHeight: '100%'
			}
		},
		created() {
			this.nowSortKey=this.initSortKey;
		},
		mounted() {
			// this.$nextTick(function(){
			// 	// console.log(document.getElementsByClassName("S-My-Table")[0].style.width)
			// })
		},
		methods: {
			//表格排序功能
			//tog 为 false时，不执行排序
			sortTable(sortType, hdIndex, tog,sortFieldType) {
				// console.log(sortType, hdIndex, tog,sortFieldType,this.backEndSort);
				if (!tog) {
					return false
				}
				
				this.nowSortKey = sortType;
				let order = this.headerdata[hdIndex].order == '' ? 'desc' : this.headerdata[hdIndex].order;
				//调整header上的点击位置的箭头颜色状态
				this.headerdata.forEach((v, i) => {
					v.order = '';
				})
				if (order == 'desc') {
					this.headerdata[hdIndex].order = 'asc';
				} else if (order == 'asc') {
					this.headerdata[hdIndex].order = 'desc';
				}
				
				//如果后端排序的话，执行父组件中的自定义方法
				if(this.backEndSort){
					this.$parent.backEndSortFunc(sortType, order);
					return false
				}
				
				this.maindata.sort((a, b) => {
					if (sortFieldType.toLocaleLowerCase() == 'string') {
						//电站名称 排序
						if (order == 'desc') {
							return a[sortType].localeCompare(b[sortType])
						} else if (order == 'asc') {
							return b[sortType].localeCompare(a[sortType])
						}
					} else if(sortFieldType.toLocaleLowerCase() == 'number') {
						if(this.sortFieldTypes&&this.sortFieldTypes.includes(sortType)){
							return this.$parent.specialSortFunc(a,b,sortType,order);
						}else{
							if (order == 'desc') {
								return a[sortType] - b[sortType]
							} else if (order == 'asc') {
								return b[sortType] - a[sortType]
							}
						}
						
					}
				})
				
				
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/assets/styles/mixin.scss";
	@import "~@/assets/styles/variables.scss";

	$tableBorderColor:rgba(0, 225, 228, 0.2);
	
	.S-Table {
		.left0{
			position: sticky;;left:0;
		}
		.right0{
			border-left: 2px solid $tableBorderColor !important;
			position: sticky;right:0;
			background-color: $fixedTdBgc !important;
		}
		.el-scrollbar .el-scrollbar__wrap {
			overflow-x: hidden;
			margin-right: -17px !important;
			margin-bottom: -17px !important;
		}

		.el-scrollbar .el-scrollbar__bar {
			z-index: 15;
		}

		.el-progress__text {
			color: inherit;
			font-size: 12px !important;
		}
	}
	.S-Table .S-My-Table{
		background-color: rgba(0,0,0,0.1);
	}
	.S-Table table thead tr:first-child th {
		position: sticky;
		top: 0px;
		// background-color: $fadianBgc2;
		z-index: 11;
		// border-bottom: 2px solid $tableBorderColor;
	}

	.S-Table table thead tr:nth-child(2) th {
		position: sticky;
		top: 30px;
		// background-color: $fadianBgc2;
		z-index: 11;
		// border-bottom: 2px solid $tableBorderColor;
	}
	
	.S-Table table thead tr:nth-child(2) th{
		border-bottom: 2px solid $tableBorderColor !important;
	}
	.S-Table table thead tr:nth-child(1) th[rowspan="2"]{
		border-bottom: 2px solid $tableBorderColor !important;
	}


	.S-Table .el-table tr {
		background-color: transparent;
	}

	.S-Table thead {
		background-color: $fixedTdBgc !important;
		padding: 0;
		margin: 0;
		border: none !important;
	}

	.S-Table.fixedLeftColumn table thead tr:first-child th:first-child {
		position: sticky;
		z-index: 12;
		left: 0px;
		background-color: $fixedTdBgc;
		border-right: 2px solid $tableBorderColor;
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table.fixedRightColumn table thead tr:first-child th:last-child {
		position: sticky;
		z-index: 12;
		right: 0px;
		background-color: $fixedTdBgc;
		border-right: 2px solid $tableBorderColor;
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table table thead tr:first-child th:first-child {
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table table tr:nth-last-child(2) td{
		border-bottom:none !important;
	}

	.S-Table.fixedLeftColumn table tbody tr td:first-child {
		z-index: 10;
		position: sticky;
		left: 0px;
		background-color: $fixedTdBgc;
		border-right: 2px solid $tableBorderColor;
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table.fixedRightColumn table tbody tr td:last-child {
		z-index: 10;
		position: sticky;
		right: 0px;
		background-color: $fixedTdBgc;
		border-right: 2px solid $tableBorderColor;
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table table tbody tr td:first-child {
		background-color: transparent;
		border-left: 1px solid $tableBorderColor !important;
	}
	.S-Table table tbody tr:hover{
		background-color: rgba(0,0,0,0.15);
	}

	.S-Table th,
	.S-Table td {
		border-right: 1px solid $tableBorderColor;
		border-left: none !important;
		border-top: none !important;
		border-bottom: 1px solid $tableBorderColor;
		padding: 8px 5px;
	}

	.S-Table {
		// border: 2px solid $tableBorderColor;
		background-color: transparent;
		font-size:12px;
	}

	.S-Table .inv-num {
		margin: 0 1px;
		padding: 0 5px;
		border-radius: 5px;
	}

	.S-Table .error {
		background-color: rgba(204, 0, 0, 0.5);
	}

	.sort {
		padding: 5upx;
		vertical-align: text-bottom;
		background: rgba(255, 0, 0, 0);
		width: 6px;
		height: 14px;
	}

	.up-arrow {
		border-bottom: 4px solid #fff;
		border-left: 4px dashed transparent;
		border-right: 4px dashed transparent;
		border-top: 0;
		margin-bottom: 4px;
	}

	.up-arrow.action {
		border-bottom: 4px solid #4298f7;
		border-left: 4px dashed transparent;
		border-right: 4px dashed transparent;
		border-top: 0;
	}

	.down-arrow {
		border-top: 4px solid #ccc;
		border-left: 4px dashed transparent;
		border-right: 4px dashed transparent;
		border-bottom: 0;

	}

	.down-arrow.action {
		border-top: 4px solid #4298f7;
		border-left: 4px dashed transparent;
		border-right: 4px dashed transparent;
		border-bottom: 0;
	}
</style>
