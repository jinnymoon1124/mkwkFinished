<template>
  <div style="overflow: hidden auto; width: 100%; height: 100%">
    <div
      class="fl"
      style="width: 100%; height: 40px; cursor: pointer; border: 1px solid #ccc"
    >
      <Button @click="testSaveWalk">testSaveWalk</Button>
    </div>
    <div
      class="fl"
      style="width: 100%; height: 40px; cursor: pointer; border: 1px solid #ccc"
    >
      <Button @click="testGetBadgeList">testGetBadgeList</Button>
    </div>
    <div class="fl" style="width: 100%; height: 500px">
      <div v-for="(badge, index) in mBadgeList" :key="index">
        <p class="fl">[{{ badge.badgename }}]</p>
      </div>
    </div>
    <div
      class="fl"
      style="width: 100%; height: 40px; cursor: pointer; border: 1px solid #ccc"
    >
      <Button @click="testGetMbadgeList">testGetMbadgeList</Button>
    </div>
    <div class="fl" style="width: 100%; height: 500px">
      <div v-for="(badge, index) in mMbadgeList" :key="index">
        <p class="fl">[{{ badge.badgename }}]</p>
      </div>
    </div>
    <div
      class="fl"
      style="width: 100%; height: 40px; cursor: pointer; border: 1px solid #ccc"
    >
      <Button @click="testGetWalkList">testGetWalkList</Button>
    </div>
    <div class="fl" style="width: 100%; height: 500px">
      <div v-for="(walk, index) in mwalkList" :key="index">
        <p class="fl">[{{ walk.enddate ? "산책완료" : "산책중" }}]</p>
        <p class="fl">{{ walk.walkname }}</p>

        <Button @click="testEndWalkUser(walk)">산책종료</Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      mwalkList: [],
      mMbadgeList: [],
      mBadgeList: [],
    };
  },
  methods: {
    // 산책 추가하기
    async testSaveWalk() {
      const param = {
        walkname: "산책테스트",
        startdate: new Date(),
        // enddate: new Date(),
        distance: "1234555",
        creuserkey: 11, //하드코딩
      };
      const result = await axios.post("/wk.saveWalk", { walk: param });
      console.log(result);
    },
    // 산책 리스트 가져오기
    async testGetWalkList() {
      const param = {
        userkey: 11, //하드코딩
        /* startdate: new Date(),
        enddate: '2023-10-18',
        distance: '1234555',
        creuserkey: 1 */
      };
      const result = await axios.post("/wk.getWalkList", { walk: param });
      console.log(result);
      if (result.data) {
        if (result.data.walk) {
          this.mwalkList = result.data.walk;
        }
      }
    },
    // 산책끝내기(유저가)
    async testEndWalkUser(walk) {
      const muserList = walk.muserList;
      // let muserWalkKey = null as number|null
      let muser = null;
      for (let i = 0; i < muserList.length; i++) {
        if (Number(muserList[i].userkey) === 11) {
          // 내 유저키 : 1(임시)//하드코딩
          muser = muserList[i];
        }
      }
      const param = {
        walkkey: walk.walkkey,
        userkey: muser.userkey,
        userwalkkey: muser.userwalkkey,
      };
      const result = await axios.post("/wk.endWalkUser", param);
      console.log(result);
    },
    // user의 뱃지 리스트 가져오기
    async testGetMbadgeList() {
      const param = {
        userkey: 11, //하드코딩
      };
      const result = await axios.post("/wk.getmuserBadgeList", {
        badge: param,
      });
      console.log(result);
      if (result.data) {
        if (result.data.mBadge) {
          this.mMbadgeList = result.data.mBadge;
        }
      }
    },
    // 전체 뱃지 리스트 가져오기
    async testGetBadgeList() {
      const param = {
        userkey: 11, //하드코딩
      };
      const result = await axios.post("/wk.getBadgeList", { badge: param });
      console.log(result);
      if (result.data) {
        if (result.data.badge) {
          this.mBadgeList = result.data.badge;
        }
      }
    },
  },
});
</script>


<style scoped>
</style>
