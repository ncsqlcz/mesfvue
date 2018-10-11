<!--刘川中 2018.4.1-->
<template>
  <el-dialog :visible.sync="visibleTree" :title="title" width="35%">
    <div class="" style="max-height: 600px; overflow-y: auto">
      <el-tree
        :data="tree"
        ref="tree"
        show-checkbox
        node-key="role_function_id"
        :default-expanded-keys="[]"
        :default-checked-keys="[]"
        :props="defaultProps"
        v-loading="listLoading">
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="visibleTree = false">取消</el-button>
      <el-button type="primary" size="medium" @click.native="submit" :loading="visible.addLoading">确认提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import utils from '@/common/js/utils'
  import { queryFunction, addFunctions, removeFunction } from '@/api/api'
  export default {
    name: 'permission-tree',
    props: {
      postId: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '职位权限详情'
      },
      random: [Number]
    },
    data () {
      return {
        filters: {
          type: 'postFunction',
          postId: this.postId
        },
        list: [],
        postList: [],
        listLoading: false,
        visibleTree: this.visible,
        tree: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    mounted () {
    },
    methods: {
      // 所有权限
      getAll () {
        this.listLoading = true
        if (this.list.length === 0) {
          queryFunction({type: 'function'}).then(res => {
            if (res.status === 0) {
              this.list = res.map.functions
              this.tree = utils.getTree('0', this.list)
              return new Promise(resolve => {
                resolve()
              })
            } else {
              this.list = []
              return new Promise((resolve, reject) => {
                reject(new Error('获取数据失败'))
              })
            }
          }).then(() => {
            this.getList()
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.getList()
        }
      },
      // 获取所拥有的权限
      getList () {
        this.listLoading = true
        queryFunction(this.filters).then(res => {
          if (res.status === 0) {
            this.postList = res.map.functions
          } else {
            this.postList = []
          }
          this.setCheckedKeys()
          this.listLoading = false
        })
      },
      // 选中所拥有的权限
      setCheckedKeys () {
        this.checkedKeys = []
        for (let i = 0, len1 = this.list.length; i < len1; i++) {
          for (let j = 0, len2 = this.postList.length; j < len2; j++) {
            if (this.list[i].id === this.postList[j].id) {
              this.checkedKeys.push(this.postList[j].role_function_id)
            }
          }
        }
        this.$refs.tree.setCheckedKeys(this.checkedKeys)
        // console.log(this.checkedKeys);
      },
      // 修改了哪些权限
      getListDiff () {
        // console.log(this.$refs.tree.getCheckedKeys(true), this.postList);
        let addArr = []
        let removeArr = []
        let checkedList = this.$refs.tree.getCheckedKeys()
        // 新增的权限
        for (let i = 0, len1 = checkedList.length; i < len1; i++) {
          let has = false
          for (let j = 0, len2 = this.postList.length; j < len2; j++) {
            if (checkedList[i] === this.postList[j].role_function_id) {
              has = true
            }
          }
          if (!has) {
            addArr.push(checkedList[i])
          }
        }
        // 修改的权限
        for (let i = 0, len1 = this.postList.length; i < len1; i++) {
          let has = false
          for (let j = 0, len2 = checkedList.length; j < len2; j++) {
            if (checkedList[j] === this.postList[i].role_function_id) {
              has = true
            }
          }
          if (!has) {
            removeArr.push(this.postList[i].role_post_function_id)
          }
        }
        addArr = [...new Set([...addArr])]
        removeArr = [...new Set([...removeArr])]
        return {
          count: addArr.length + removeArr.length,
          addIds: addArr.join(','),
          removeIds: removeArr.join(',')
        }
      },
      // 提交
      submit () {
        let diff = this.getListDiff()
        if (diff.count === 0) {
          this.$message({ message: '没有修改的权限', type: 'info' })
        } else {
          this.$confirm('确认修改权限吗？').then(action => {
            if (action === 'confirm') {
              if (diff.addIds === '') {
                if (diff.removeIds !== '') {
                  this.handleRemove(diff).then(() => {
                    this.$message({ message: '移除权限成功', type: 'success' })
                    this.visibleTree = false
                  }).catch(() => {
                    this.$message({ message: '移除权限失败', type: 'success' })
                  })
                }
              } else {
                if (diff.removeIds === '') {
                  this.handleAdd(diff).then(() => {
                    this.$message({ message: '新增权限成功', type: 'success' })
                    this.visibleTree = false
                  }).catch(() => {
                    this.$message({ message: '新增权限失败', type: 'success' })
                  })
                } else {
                  this.handleRemove(diff).then(() => {
                    this.handleAdd(diff).then(() => {
                      this.$message({ message: '修改权限成功', type: 'success' })
                      this.visibleTree = false
                    })
                  }).catch(() => {
                    this.$message({ message: '修改权限失败', type: 'success' })
                  })
                }
              }
            }
          }).catch(action => {})
        }
      },
      handleAdd (diff) {
        return new Promise((resolve, reject) => {
          addFunctions({postId: this.postId, functionIds: diff.addIds}).then(res => {
            if (res.status === 0) {
              resolve()
            } else {
              reject(new Error('修改权限失败'))
            }
          })
        })
      },
      handleRemove (diff) {
        return new Promise((resolve, reject) => {
          removeFunction({type: 'post', postId: this.postId, postFunctionIds: diff.removeIds}).then(res => {
            if (res.status === 0) {
              resolve()
            } else {
              reject(new Error('修改权限失败'))
            }
          })
        })
      }
    },
    watch: {
      postId (val) {
        this.filters.postId = val
        // this.getAll()
      },
      visibleTree (val) {
        this.$emit('update:visible', val)
      },
      visible (val) {
        this.visibleTree = val
      },
      random () {
        if (this.filters.postId !== '' && this.visibleTree) {
          this.getAll()
        }
      }
    }
  }
</script>

<style scoped>

</style>
