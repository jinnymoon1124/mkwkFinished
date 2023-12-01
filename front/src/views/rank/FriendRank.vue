<template>
  <div id="Friendrankpg">
    <!-- top -->
    <Header :title="pageTitle" />
    <div class="Rank_middle">
      <!-- <div class="myRank_wrap">
        <h3 id="myRank">친구 랭킹</h3>
      </div> -->
      <div class="buttons_container">
        <button @click="MyRankPage" class="rank_button">나의 랭킹</button>
        <button @click="FriendRankPage" class="click_rank_button">친구 랭킹</button>
      </div>
      <div class="month_change">
        <div class="prevMonth" @click="prevMonth">&#60;</div>
        <p class="month">{{ currentYear + "-" + currentMonth }}</p>
        <div class="nextMonth" v-if="isNextMonthVisible" @click="nextMonth">&#62;</div>
      </div>
      <div class="rank_margin">
        <!-- <div class="rank"> -->
        <div class="rank">
          <h3 class="top_10">TOP 10</h3>
          <div class="green-rank" v-for="(friend, index) in sortedFriends.slice(0, 10)" :key="index">
            <p v-if="index === 0" class="rank-icon">&#x1F947;</p>
            <p v-else-if="index === 1" class="rank-icon">&#x1F948;</p>
            <p v-else-if="index === 2" class="rank-icon">&#x1F949;</p>
            <div class="friend-container">
              <div class="profile">
                <img
                  v-if="friend[0].creuserkey"
                  :src="getMemberImg(friend[0].creuserkey)"
                />
              </div>
              <div class="friend-info">
                <h3>{{ getMemberName(friend[0].creuserkey) }}</h3>
                <p>총 {{ friend.totalDistance }}KM 산책</p>
                <p>총 {{ friend.totalWalkDuration?.hours || 0 }}시간 {{ friend.totalWalkDuration?.minutes || 0 }}분 산책</p>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable no-undef */
import data from "../../assets/rankData.js";
import Header from '@/components/Header.vue';
import axios from "axios";

export default {
  name: "friendrankComponent",
  components: {
    Header,
  },
  data() {
    return {
      data: data,
      pageTitle: "랭킹",
      dataFromBackend: null,
      groupedData: {},
      monthGroup: {},

      currentDate: null,
      currentMonth: null,
      currentYear: null,

      memberData: [],
    };
  },
  created() {
    this.fetchDataFromBackend();
    this.fetchMemberData();
    this.currentDate = new Date(); // currentDate 초기화
    this.currentMonth = this.currentDate.getMonth() + 1; // currentMonth 초기화
    // this.lastMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
    this.currentYear = this.currentDate.getFullYear();


  },
  methods: {
    MyRankPage() {
      this.$router.push("/ranking");
    },
    FriendRankPage() {
      this.$router.push("/friendRank");
    },

    async fetchDataFromBackend() {
      try {
        const response = await axios.get("http://localhost:8080/api/fwrank-info");
        this.dataFromBackend = response.data;
        console.log("API 응답 데이터:", this.dataFromBackend);

        // 데이터를 가져온 후에 이번 달과 저번 달 데이터 초기화
        this.groupData(this.dataFromBackend);
        console.log(this.groupedData);
        // this.getCount();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchMemberData() {
      try {
        const response = await axios.get("http://localhost:8080/api/member-info");
        this.memberData = response.data;
        console.log("멤버 데이터:", this.memberData);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    },
    getMemberName(creuserkey) {
      // creuserkey와 일치하는 memberName을 찾아 반환
      const member = this.memberData.find((item) => item.userkey === creuserkey);
      console.log(creuserkey)
      return member ? member.memberName : creuserkey;
      
    },
    getMemberImg(creuserkey) {
      // creuserkey와 일치하는 memberName을 찾아 반환
      const member = this.memberData.find((item) => item.userkey === creuserkey);
      // member가 존재하고 member.memberImage가 존재하는 경우 이미지 경로를 반환
      if (member && member.memberImage) {
        return require(`@/assets/${member.memberImage}`);
      } else {
        return "";  // 기본값으로 빈 문자열 반환
      }
    },
    groupData(data) {
      this.groupedData = {};
      this.monthGroup = {}; // 월별 그룹화된 데이터를 저장할 객체 추가

      data.forEach(item => {
        item.walkdate = this.calculateWalkDate(item);
        const year = item.startdate[0];
        const month = item.startdate[1];
        const key = `${year}-${month}`;

        if (!this.groupedData[key]) {
          this.groupedData[key] = {};
        }

        // 그룹화된 데이터에서 동일한 달 내에서 creuserkey가 같은 것을 더 그룹화
        const monthGroup = this.groupedData[key];

        if (!monthGroup[item.creuserkey]) {
          monthGroup[item.creuserkey] = [];
        }

        monthGroup[item.creuserkey].push(item);
      });

      // 월별 그룹화된 데이터를 가지고 산책 시간을 계산하여 추가
      for (const key in this.groupedData) {
        this.groupedData[key] = this.calculateDistanceForMonthGroup(this.groupedData[key]);
      }

      return this.groupedData;
    },

    calculateDistanceForMonthGroup(monthGroup) {
      for (const creuserkey in monthGroup) {
        const userItems = monthGroup[creuserkey];
        let totalDistance = 0;
        let totalWalkDuration = { hours: 0, minutes: 0, seconds: 0 };

        userItems.forEach(item => {
          totalDistance += parseInt(item.distance, 10) || 0;

          // Calculate total walk duration for the user
          totalWalkDuration.seconds += item.walkdate.seconds;
          totalWalkDuration.minutes += item.walkdate.minutes;
          totalWalkDuration.hours += item.walkdate.hours;

          // Adjust for overflow
          if (totalWalkDuration.seconds >= 60) {
            totalWalkDuration.minutes += Math.floor(totalWalkDuration.seconds / 60);
            totalWalkDuration.seconds %= 60;
          }
          if (totalWalkDuration.minutes >= 60) {
            totalWalkDuration.hours += Math.floor(totalWalkDuration.minutes / 60);
            totalWalkDuration.minutes %= 60;
          }
        });

        // Store the calculated values in the user's data
        monthGroup[creuserkey].totalDistance = totalDistance;
        monthGroup[creuserkey].totalWalkDuration = totalWalkDuration;
      }

      console.log(monthGroup);
      return monthGroup;
    },




    calculateWalkDate(item) {
      const startDate = new Date(
        item.startdate[0],
        item.startdate[1],
        item.startdate[2],
        item.startdate[3] || 0, // 부정확한 시간은 0으로 처리
        item.startdate[4] || 0, // 부정확한 분은 0으로 처리
        item.startdate[5] || 0  // 부정확한 초는 0으로 처리
      );
      const endDate = new Date(
        item.enddate[0],
        item.enddate[1],
        item.enddate[2],
        item.enddate[3] || 0,
        item.enddate[4] || 0,
        item.enddate[5] || 0
      );

      if (isNaN(startDate) || isNaN(endDate)) {
        // 유효하지 않은 날짜 처리
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const durationInMilliseconds = endDate - startDate;
      // Convert the duration to hours, minutes, and seconds
      const durationInSeconds = durationInMilliseconds / 1000;
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = durationInSeconds % 60;

      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    },



    prevMonth() {
      if (this.currentMonth > 1) {
        this.currentMonth--;
      } else {
        this.currentYear--;
        this.currentMonth = 12;
      }
      this.checkNextMonthVisibility();
    },
    nextMonth() {
      if (this.currentMonth < 12) {
        this.currentMonth++;
      } else {
        this.currentYear++;
        this.currentMonth = 1;
      }
      this.checkNextMonthVisibility();
    },
    checkNextMonthVisibility() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      this.isNextMonthVisible = !(this.currentYear === currentYear && this.currentMonth === currentMonth);
    },


  },
  computed: {
    sortedFriends() {
      const currentYear = this.currentYear;
      const currentMonth = this.currentMonth;

      if (!this.groupedData[`${currentYear}-${currentMonth}`]) {
        // 해당 년도 및 월에 데이터가 없을 때 빈 배열 반환
        return [];
      }

      const filteredData = Object.values(this.groupedData[`${currentYear}-${currentMonth}`]);

      // 배열을 totalDistance를 기준으로 내림차순 정렬
      filteredData.sort((a, b) => {
        return b.totalDistance - a.totalDistance;
      });
      
      return filteredData;
    },
  },

};
</script>

<style scoped>
#Friendrankpg {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.green-rank {
  position: relative;
  /* 부모 요소에 대해 상대적인 위치 설정 */
  margin: 5%;
  margin-bottom: 7%;
}

.profile {
  width: 33%;
  height: 33%;
  border-radius: 50%;
  overflow: hidden;
  margin: 2%;
  padding-right: 4%;
}

.rank-icon {
  position: absolute;
  /* 이미지에 대해 절대적인 위치 설정 */
  left: -25px;
  top: -70px;
  font-size: 50px;
  height: 100px;
  /* 이미지 크기 설정 */
  z-index: 1;
  /* 이미지를 다른 요소들 위로 렌더링하기 위한 z-index 설정 */
}

.title-name {
  padding-bottom: 3%;
}
</style>