<template>
  <div class="add-content">
    <div class="title-name-first">新建团队</div>
    <view>
      <input placeholder="输入团队名称" v-model="teamName">
    </view>
    <button @click="addTeam" class="add-button">确认添加团队</button>
    <div class="add-team">
      <span class="title-name-second">团队：</span>
      <span
        class="add-team-item"
        v-for="(item,index) in teamData"
        :key="index"
        @click="radioChange(item)"
      >{{item.teamName}}</span>
    </div>
    <div v-if="selectTeam.teamName">
      <span class="title-name-second">选择的团队：</span>
      {{selectTeam.teamName}}
    </div>
    <div class="add-team">
      <span class="title-name-second">团队成员：</span>
      <span
        class="add-team-item-people"
        v-for="(item,index) in selectTeam.groups"
        :key="index"
      >{{item}}</span>
    </div>
    <view>
      <input placeholder="输入成员姓名" v-model="peopleName">
    </view>
    <button @click="addPeople" class="add-button">确认添加成员</button>
  </div>
</template>

<script>
const db = wx.cloud.database(); //初始化数据库
export default {
  data() {
    return {
      teamName: "",
      teamData: [],
      peopleName: "",
      selectTeam: {}
    };
  },
  created() {
    let app = getApp();
  },
  mounted() {
    this.searchTeam();
  },
  computed: {},
  watch: {
    selectTeam: {
      handler(val, oldVal) {
        if (!val) {
          this.selectTeam = {};
        }
        console.log("selectTeam   val");
        console.log(val);
      },
      deep: true
    }
  },
  components: {},
  methods: {
    addPeople() {
      let peopleName = this.peopleName;
      let groups = this.selectTeam.groups;
      if (!this.selectTeam.teamName) {
        wx.showToast({
          title: "请选择该成员对应的团队",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!peopleName) {
        wx.showToast({
          title: "请输入要添加的成员名称",
          icon: "none",
          duration: 2000
        });
        return;
      }
      //判断该成员在该团队中是否存在
      let peopleItem = groups.find(item => {
        return item == peopleName;
      });
      if (peopleItem) {
        wx.showToast({
          title: "该成员已存在",
          icon: "none",
          duration: 2000
        });
        return;
      } else {
        let newGroups = groups;
        newGroups = newGroups.concat([peopleName]);
        let _id = this.selectTeam._id;

        db
          .collection("team")
          .doc(_id)
          .update({
            data: {
              groups: newGroups
            }
          })
          .then(res => {
            wx.showToast({
              title: "添加成员成功",
              icon: "none",
              duration: 2000
            });
            // 添加完成后把成员名称置为空，展示新的团队下的成员
            this.peopleName = "";
            this.searchOneTeam(_id);

            // this.searchTeam()
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    radioChange(val) {
      this.selectTeam = val;
    },
    searchTeam() {
      console.log(2222);
      db
        .collection("team")
        .get()
        .then(res => {
          this.teamData = res.data;
          let selectItem = null;
          if (this.selectTeam && this.selectTeam.teamName) {
            selectItem = this.teamData.find(item => {
              return item.teamName == this.selectTeam.teamName;
            });
          }
          if (selectItem) {
            this.selectTeam = this.selectTeam;
          } else {
            this.selectTeam = this.teamData[0];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchOneTeam(_id) {
      db
        .collection("team")
        .where({
          _id: _id // 填入当前用户 openid
        })
        .get({
          success: res => {
            this.selectTeam = res.data[0];
          }
        });
    },
    addTeam() {
      if (!this.teamName) {
        wx.showToast({
          title: "请输入团队名称",
          icon: "none",
          duration: 2000
        });
        return;
      }
      let itemObj = this.teamData.find(item => {
        return item.teamName == this.teamName;
      });
      if (itemObj) {
        wx.showToast({
          title: "该团队名称已存在",
          icon: "none",
          duration: 2000
        });
        return;
      } else {
        // 判断团队名称是否存在，如果不存在则添加
        db
          .collection("team")
          .add({
            data: {
              teamName: this.teamName,
              groups: []
            }
          })
          .then(res => {
            this.teamName = "";
            wx.showToast({
              title: "添加团队成功",
              icon: "none",
              duration: 2000
            });
            this.searchTeam();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
    // searchTeam(name){

    // }
  }
};
</script>

<style scoped>
.add-content {
  margin: 10rpx 30rpx;
}
.add-team {
  margin: 30rpx 0 30rpx;
}
.add-team-item {
  display: inline-block;
  border: 1px solid;
  padding: 5rpx;
  margin-left: 10rpx;
}
.title-name-first {
  font-size: 38rpx;
  font-weight: 700;
  margin-bottom: 30rpx;
}
.title-name-second {
  font-size: 32rpx;
  font-weight: 600;
}
.add-button {
  width: 40%;
}
.add-team-item-people {
  display: inline-block;
  padding-left: 20rpx;
}
</style>
