<template>
  <div>
    <el-input disabled v-model="device" class="input-with-select">
        
      <el-button slot="append" @click="click" style="background-color: #1ab394;border-top-left-radius: 0%;border-bottom-left-radius: 0%;color: #fff;">选择设备</el-button>
    </el-input>
    <el-dialog title="选择设备" :visible.sync="open" width="width" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
      <el-checkbox v-model="expand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
      <el-checkbox v-model="nodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
      <div style="max-height:350px;overflow:auto">
        <el-tree class="tree-border" :max-height="10" :data="dataList" show-checkbox ref="treeDevice" node-key="id" empty-text="加载中，请稍后" :props="defaultProps"></el-tree>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeselectForStations } from '@/api/assets/device'
import axios from 'axios'

export default {
  name: 'deviceCheckbox',
  props: {
    devices: {
      type: Array,
    },
    stations:{
      type: Array,
    },
  },
  data() {
    return {
      open: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      dataList:[],
      expand:false,
      nodeAll:false,
      device:''

    }
  },
  created() {
    if(this.stations==null || this.stations==undefined || this.stations.length==0){
        this.stations=[this.$store.getters.currentStation];
        
      }
      this.getTreeselect()
  },
  methods: {
    click() {
      this.open = true
    },
        /** 查询设备树结构 */
    getTreeselect() {
      var queryPara={}
      if(this.stations==null || this.stations==undefined || this.stations.length==0){
        queryPara.stationIds=[this.$store.getters.currentStation];
      }else{
        queryPara.stationIds=this.stations
      }
       
      treeselectForStations(queryPara).then((response) => {
        this.dataList = response.data
      })
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
        let treeList = this.dataList
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.treeDevice.store.nodesMap[treeList[i].id].expanded = value
        }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
        this.$refs.treeDevice.setCheckedNodes(value ? this.dataList : [])
    },
    // 所有节点数据
    getAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.treeDevice.getCheckedKeys()

      var chekckNode=this.$refs.treeDevice.getCheckedNodes()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.treeDevice.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /**确认按钮 */
    confirm() {
        this.open = false;
      var chekckNode=this.$refs.treeDevice.getCheckedNodes()
      var halfCheckedNode= this.$refs.treeDevice.getHalfCheckedNodes()
      chekckNode.unshift.apply(chekckNode, halfCheckedNode)
      var labList= chekckNode.map(x=>x.label)
      if(labList){
        this.device=labList.join(",")
      }
          
        this.$emit('getDevices',this.getAllCheckedKeys())
    },
  },
}
</script>

<style scoped lang="scss">
.button {
  background-color: #1ab394;
  color: #fff;
  border-top-left-radius: 0%;
  border-bottom-left-radius: 0%;
}
::v-deep .el-dialog__body {
  padding: 10px 20px !important;
}
.checkList {
  padding: 20px 20px;
  height: 300px;
  overflow: auto;
}
.selectedList {
  span {
    color: #606266;
    font-size: 14px;
    font-weight: 700;
  }
}
.dialog-footer {
  text-align: center;
  .el-button--medium {
    padding: 10px 100px;
  }
}
</style>