<template>
  <div class="add-content">
    <div class="title-name-first" v-if="isAuthenticated">hello {{nickname}}</div>
    <button
      open-type="getUserInfo"
      class="add-button"
      @getuserinfo="bindGetUserInfo"
      v-if="!isAuthenticated"
    >获取用户信息</button>
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
    <div>{{selectedName}}</div>
    <!-- <reward></reward> -->
    <div>
      <button @click="startGame" class="add-button">开始</button>
      <button @click="endGame" class="add-button">结束</button>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database(); //初始化数据库
// import reward from "../reward/index.vue";
import reward from "../../templates/reward.vue";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      teamData: [],
      selectTeam: {},
      selectedName: "", //被选中的人
      select: null //选择定时器
    };
  },
  onShow() {
    this.searchTeam();
    clearInterval(this.select);
    // this.$store.commit("setSelectedName", "");
    this.selectedName = "";
    console.log("onShow", this);
  },
  mounted() {
    //拿取团队信息 存入store
    wx.getStorage({
      key: "nickname",
      success: res => {
        this.$store.dispatch("setName", res.data);
      }
    });
  },
  watch: {
    teamData: {
      handler(val, oldVal) {
        console.log("teamData   val");
        console.log(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.nickname
      // selectedName: state => state.trialMultiplestore.selectedName
    })
  },
  methods: {
    startGame() {
      let groups = this.selectTeam.groups;
      if (groups && groups.length > 0) {
        this.select = setInterval(this.roll, 60);
      } else {
        wx.showToast({
          title: "该团队下没有成员，请先添加成员",
          icon: "none",
          duration: 2000
        });
      }
    },
    endGame() {
      clearInterval(this.select);
    },
    roll() {
      let groups = this.selectTeam.groups;
      let num = Math.floor(Math.random() * groups.length);
      // this.$store.commit("setSelectedName", groups[num]);
      this.selectedName = groups[num];
    },
    radioChange(val) {
      this.selectTeam = val;
      this.$store.dispatch("getSelect", val);
      clearInterval(this.select);
      // this.$store.commit("setSelectedName", "");
      this.selectedName = "";
    },
    searchTeam() {
      db
        .collection("team")
        .get()
        .then(res => {
          console.log("res");
          console.log(res);
          this.teamData = res.data;
          this.selectTeam = this.teamData[0];
          // this.$store.dispatch("getSelect", this.teamData[0]);
        })
        .catch(err => {
          console.log(err);
        });
    },
    bindGetUserInfo(e) {
      let nickname = JSON.parse(e.target.rawData).nickName;
      try {
        wx.setStorageSync("nickname", nickname);
      } catch (e) {
        console.log(e);
      }
      this.$store.dispatch("setName", nickname);
    }
  },
  components: { reward }
};
</script>

<style scoped>
.container {
  width: 100%;
}
.add-content {
  margin: 10rpx 30rpx;
  text-align: center;
}
.add-team {
  display: block;
  margin: 30rpx 0 30rpx;
  white-space: pre-line;
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
  display: inline-block;
  margin: 10rpx 20rpx;
}
.add-team-item-people {
  padding-left: 20rpx;
  display: inline-block;
}
</style>
