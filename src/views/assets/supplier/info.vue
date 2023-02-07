<template>
  <div class="app-container">
    <div class="info">
      <div class="title">
        <span>基础信息</span>
      </div>
      <div class="table">
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">供应商编号</div></div>
              <div class="labelStyle"> {{supplierInfo.supCode}}</div>
          </div>
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">供应商名称</div></div>
              <div class="labelStyle"> {{supplierInfo.supName}}</div>
          </div>
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">供应商类型</div></div>
              <div class="labelStyle"> {{supTypeList[supplierInfo.supType]}}</div>
          </div>
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">所在城市</div></div>
              <div class="labelStyle"> {{supplierInfo.supCity}}</div>
          </div>
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">联系人</div></div>
              <div class="labelStyle"> {{supplierInfo.supPerson}}</div>
          </div>
          <div class="tableFlex">
              <div class="titleStyle"><div class="in">联系方式</div></div>
              <div class="labelStyle"> {{supplierInfo.supPhone}}</div>
          </div>
          <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
              <div class="titleStyle"><div class="in">供应商简介</div></div>
              <div class="labelStyle"> {{supplierInfo.supDesc}}</div>
          </div>
      </div>
    </div>
    <div class="info">
      <div class="title">
        <span>修改记录</span>
      </div>
      <div class="table">
        <el-table :data="supplierUpdateLog" style="width: 100%">
          <el-table-column prop="number" label="序号" width="290">
            <template slot-scope="scope">
              <span>{{scope.row.number}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="类型" width="290">
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="290">
            <template slot-scope="scope">
            <span>{{
              moment(scope.row.updateTime).format("YYYY-MM-DD hh:mm:ss")
            }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateUser" label="修改人" width="290">
            <template slot-scope="scope">
              <span>{{ scope.row.updateUser }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateContext" label="修改内容">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import {getSupplierById} from "@/api/assets/supplier"

export default {
  name: "SupplierInfo",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        supId: undefined,
      },
      supplierInfo: {},
      supplierUpdateLog: [],
      supTypeList: {},

    }
  },
  created() {
    const supId = this.$route.query && this.$route.query.supId;
    const supTypeTmp = JSON.parse(this.$route.query.supTypeList);
    for (let item of supTypeTmp) {
      this.supTypeList[item.dictValue] = item.dictLabel;
    }
    if (supId) {
      this.queryParams.id = supId;
      this.getSupplierInfo();
    }

  },
  methods: {
    getSupplierInfo() {
      getSupplierById(this.queryParams.id).then(response => {
        this.supplierInfo = response.SupplierInfo;
        this.supplierUpdateLog = response.UpdateLog;
      });

    }

  }
}
</script>

<style lang="scss" scoped>
  .info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    margin-bottom: 10px;
    .el-col {
      font-weight: 400;
    }

    .title {
      height: 30px;
      background-color: #d7dde4;

      span {
        line-height: 30px;
      }
    }

    //**表格样式设计 */
    .table {
      padding-top: 10px;
      padding-bottom: 10px;
        .tableFlex{
            display: flex;
            align-items: stretch;
            border-left: 1px solid #dfe6ec;
            .titleStyle{
                width: 25%;
                background-color: #f9f9f9;
                border-right: 1px solid #dfe6ec;
                border-top: 1px solid #dfe6ec;
                text-align: center;
                padding: 5px;
                .in{
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .labelStyle{
                width:75%;
                word-wrap: break-word;
                word-break: break-all;
                border-right: 1px solid #dfe6ec;
                border-top: 1px solid #dfe6ec;
                padding: 5px;
                color: #909399;
            }
        }
    }
  }

</style>
