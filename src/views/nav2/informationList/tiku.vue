<template>
	<div class="cont">
		<el-card class="box-card">
			<el-timeline class="cont" >
				<el-timeline-item 
				v-for="(item, index) in dataDetails" :key="index" 
				type='success'
				:timestamp="item.goodsName" 
				placement="top">
					<div class="box-card">
						<div class="box" v-for="(row, index) in item.studentKnowledgeTrees" :key="index">
							<div class="text">{{row.subjectName}}</div>
							<!-- <div class="tkBox">
								<div class="text" v-for="(e, index) in row.paperList" :key="index" @click="seeEdit(e.id)">{{e.name}}</div>
							</div> -->
						</div>
					</div>
				</el-timeline-item>
			</el-timeline>
		</el-card>
		<el-dialog :close-on-click-modal='false' title="预览试卷" :visible.sync="isShowEdit" center width="1200px">
		<div class="testContent">
			<div class="title">{{paper.name}}</div>
			<div class="rootlist" v-for="(item, index) in rootList" :key="index">
			<div class="title" v-if="item.totalScore>0">{{item.name}}（总分{{item.totalScore}}分）</div>
			<div class="question" v-for="(row, i) in item.questionList" :key="i">
				<div v-if="row.type!=10">
					<div class="introduce">
						<span>试题编号:{{row.questionNo}}</span>
						<span>考期：{{row.examTime}}</span>
						<span>省份：{{row.label}}</span>
						<span>题型：{{row.typeName}}</span>
						<span>组卷次数：{{row.combineTime}}</span>
						<span>正确率：{{row.rightRate}}</span>
						<span>试卷状态：{{row.status==0?'禁用':'启用'}}</span>
						<span>难度：{{row.difficultName}}</span>
					</div>
					<div class="stem" v-html="row.title"></div>
					<div class="option" v-if="row.optionsJson">
						<div v-for="(item, index) in JSON.parse(row.optionsJson)" :key="index" v-show="item.title" class="sel">
						{{item.option}}.<span v-html="item.title"></span>
						</div>
					</div>
					<div class="analysis">
						<div><b>知识点</b>：{{row.nodeNo}}. {{row.nodeName}}</div>
						<div v-if="row.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(row.rightOption)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}. <span v-html="item.option"></span></span></div>
						<div v-if="row.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(row.analysisJson)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}. <span v-html="item.content"></span></span></div>
					</div>
					</div>
					<div v-if="row.type ==10">
					<div class="introduce">
						<span>试题编号:{{row.questionNo}}</span>
						<span>考期：{{row.examTime}}</span>
						<span>省份：{{row.label}}</span>
						<span>题型：{{row.typeName}}</span>
						<span>组卷次数：{{row.combineTime}}</span>
						<span>正确率：{{row.rightRate}}</span>
						<span>试卷状态：{{row.status==0?'禁用':'启用'}}</span>
						<span>难度：{{row.difficultName}}</span>
					</div>
					<div class="stem" v-html="row.title"></div>
					<div v-for="(child, index) in row.children" :key="index" style="margin-left:20px">
						<div class="flex" style=" display: flex; flex-wrap: wrap;"><span>{{index+1}}、</span> <span  v-html="child.subheading"></span></div>
						<div class="option" v-if="child.optionsJson">
						<div v-for="(item, index) in JSON.parse(child.optionsJson)" :key="index" v-show="item.title" class="sel">
							{{item.option}}.<span v-html="item.title"></span>
						</div>
						</div>
						<div class="analysis" >
						<!-- <div><b>知识点</b>：{{child.nodeNo}}. {{child.nodeName}}</div> -->
						<div v-if="child.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(child.rightOption)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}. <span v-html="item.option"></span></span></div>
						<div v-if="child.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(child.analysisJson)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}. <span v-html="item.content"></span></span></div>
						</div>
					</div>
					</div>
			</div>
			</div>
		</div>
		</el-dialog>
    </div>
</template>
<script>
export default {
	data() {
		return {
			list:[],
			dataDetails:[],
			isShowEdit: false,
			rootList:[],
			paper:'',
		}
	},
	methods: {
		seeEdit(id){
			this.$fetch({
            url: 'system/api/paper/queryQuestionByPaperId',
            method: "post",
            data: {
              paperId: id
            },
			}).catch(error => {
				this.$message.error(this.apiName + "接口出错！");
			}).then(({ data })=>{
				if (data.code == 30000) {
				console.log(data.result)
				this.paper = data.result.paper
				this.rootList = data.result.rootList
				this.isShowEdit = true
			}else {
				this.$message.warning(data.message)
			}
			})
		},
		async getData() { 
            let { data } = await this.$fetch({
                url: 'system/api/student/getTrueQuestionPaperByStudentId',
                method: "post",
                data: {
                    studentId: this.$route.query.id
                },
            }).catch(error => {
                this.$message.error('student/detailStudent' + "接口出错！");
            });
            if (data.code == 30000) {
				this.dataDetails = data.result
            }else {
				this.$message.warning(data.message)
			}
        },
	},
	mounted() {
		this.getData()
	}
};

</script>

<style scoped>

.text{
	width: 21%;
	border:1px #ccc solid;
	padding: 10px 20px;
	margin: 10px 0;
	text-align: center;
	cursor: pointer;
}
.text:hover{
	background: #eee;
	color: #409EFF;
}
</style>
<style lang="scss" scoped>
.box{
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	
}
.testContent{
  .title{
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  .rootlist{
    margin: 10px 0;
    .title{
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }
    .question{
      margin: 20px 0;
      .introduce{
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }
      .stem{
        width: 80%;
        margin: 15px 0;
      }
      .option{
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
        .sel{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-right: 40px;
        }
      }
      .analysis{
        width: 90%;
        box-sizing: border-box;
        padding: 10px 20px;
        background: #edf0f4;
      }
    }
  }
}
</style>