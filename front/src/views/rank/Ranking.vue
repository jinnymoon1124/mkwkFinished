<template>
  <div id="Myrankingpg">
    <!-- top -->
    <Header :title="pageTitle" />
    <div class="Rank_middle">
      <!-- <div class="myRank_wrap">
        <h3 id="myRank">나의 랭킹</h3>
      </div> -->
      <div class="buttons_container">
        <button @click="MyRankPage" class="click_rank_button">나의 랭킹</button>
        <button @click="FriendRankPage" class="rank_button">친구 랭킹</button>
      </div>
      <div class="month_change">
        <div class="prevMonth" @click="prevMonth">&#60;</div>
        <p class="month">{{ currentYear + "-" + currentMonth }}</p>
        <div class="nextMonth" v-if="isNextMonthVisible" @click="nextMonth">&#62;</div>
      </div>

      <!-- 랭킹 데이터 -->
      <div class="rank_margin">
        <!-- <div class="rank"> -->
        <div class="rank-container">
          <h2 class="text_style_title">&#x1F333; 산책 횟수</h2>
          <p class="text_style_subtitle">{{ compareCount() }}</p>
          <div class="green-rank">
            <p class="text_style_content"> {{ lastMonth }}월</p>
            <div class="graph">
              <div class="text">{{ lastMonthCount }}회</div>
              <div ref="greenLastMonth" :style="{ width: getGreenWidth(lastMonthCount) }"></div>
            </div>
            <p class="text_style_content"> {{ currentMonth }}월</p>
            <div class="graph">
              <div class="text">{{ currentMonthCount }}회</div>
              <div ref="greenCurrentMonth" :style="{ width: getGreenWidth(currentMonth) }"></div>
            </div>
          </div>
        </div>

        <!-- <div class="rank-container">
          <h2 class="text_style_title">&#x1F46B; 산책 동반자</h2>
          <div class="pink-rank">
            <div v-for="(friend, index) in sortedFriends" :key="friend.id">
              <div class="friend-container" v-show="friend.count !== 0">
                <div class="profile">
                  <img :src="friend.img" />
                </div>
                <div class="friend-info">
                  <p class="text_style_content">{{ friend.name }}</p>
                  <div class="graph">
                    <div class="text">{{ friend.count }}회</div>
                    <div ref="pink" :style="{ width: getPinkWidth(friend.count) }"></div>
                  </div>
                </div>
              </div>
              <hr class="friend-separator" v-if="index < sortedFriends.length - 1 &&
                friend.count !== 0 &&
                sortedFriends[index + 1].count !== 0
                " />
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import data from "../../assets/rankData.js";
import Header from '@/components/Header.vue';
import axios from "axios";



export default defineComponent({
  name: "rankingComponent",
  components: {
    Header,
  },
  data() {
    return {
      pageName: "ranking",
      data: data,
      pageTitle: "랭킹",
      dataFromBackend: null,
      userData: null,
      currentDate: null,
      currentMonth: null,
      lastMonth: null,
      currentYear: null,
      currentMonthCount: 0,
      lastMonthCount: 0,
      monthlyData: [],
      groupedData: {},
      isNextMonthVisible: true,
    };
  },
  created() {
    this.fetchDataFromBackend();

    this.currentDate = new Date(); // currentDate 초기화
    this.currentMonth = this.currentDate.getMonth() + 1; // currentMonth 초기화
    this.lastMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
    this.currentYear = this.currentDate.getFullYear();


  },
  methods: {




    // 나머지 코드
    async fetchDataFromBackend() {
      try {
        const response = await axios.get("http://localhost:8080/api/fwrank-info");
        this.dataFromBackend = response.data;
        console.log("API 응답 데이터:", this.dataFromBackend);
        this.filterUserData();

        // 데이터를 가져온 후에 이번 달과 저번 달 데이터 초기화
        this.groupDataByYearAndMonth(this.dataFromBackend);
        console.log(this.groupedData);
        this.getCount();


        // 이제 데이터를 가져왔으므로 그래프 애니메이션을 시작합니다.
        this.startGraphAnimations();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    startGraphAnimations() {
      this.$nextTick(() => {
        // greenLastMonthElements, greenCurrentMonthElements, pinkElements를 배열로 초기화
        const greenLastMonthElements = Array.from(this.$refs.greenLastMonth);
        const greenCurrentMonthElements = Array.from(this.$refs.greenCurrentMonth);
        // const pinkElements = Array.from(this.$refs.pink);

        // 배열을 순회하며 애니메이션을 시작
        greenLastMonthElements.forEach((element) => {
          element.classList.add("greenanimate");
        });

        greenCurrentMonthElements.forEach((element) => {
          element.classList.add("greenanimate");
        });

        // pinkElements.forEach((element) => {
        //   element.classList.add("pinkanimate");
        // });

        
      });
      
    },

    filterUserData() {
      if (this.dataFromBackend) {
        // userkey가 1인 데이터만 필터링하여 userData에 저장
        this.userData = this.dataFromBackend.filter((item) => item.creuserkey === 1);
        console.log("creuserkey가 1인 데이터:", this.userData);
      }
    },
    groupDataByYearAndMonth(data) {
      this.groupedData = {};
      data.forEach(item => {
        const year = item.startdate[0];
        const month = item.startdate[1];
        const key = `${year}-${month}`;

        if (!this.groupedData[key]) {
          this.groupedData[key] = [];
        }

        this.groupedData[key].push(item);
      });
      return this.groupedData;
    },
    getCount() {
      //저번달 횟수
      const lastKey = `${this.currentYear}-${this.lastMonth}`;
      this.lastMonthCount = this.groupedData[lastKey] ? this.groupedData[lastKey].length : 0;
      console.log(this.lastMonthCount);
      //이번달 횟수
      const currentkey = `${this.currentYear}-${this.currentMonth}`;
      this.currentMonthCount = this.groupedData[currentkey] ? this.groupedData[currentkey].length : 0;
      console.log(this.currentMonthCount);
    },



    prevMonth() {
      if (this.currentMonth > 1) {
        this.currentMonth--;
      } else {
        this.currentYear--;
        this.currentMonth = 12;
      }
      this.updateLastMonth();
      this.getCount();
      this.checkNextMonthVisibility();
    },
    nextMonth() {
      if (this.currentMonth < 12) {
        this.currentMonth++;
      } else {
        this.currentYear++;
        this.currentMonth = 1;
      }
      this.updateLastMonth();
      this.getCount();
      this.checkNextMonthVisibility();
    },
    updateLastMonth() {
      this.lastMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
    },
    checkNextMonthVisibility() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      this.isNextMonthVisible = !(this.currentYear === currentYear && this.currentMonth === currentMonth);
    },



    MyRankPage() {
      this.$router.push("/ranking");
    },
    FriendRankPage() {
      this.$router.push("/friendRank");
    },

    //그래프 width 값 조절: 최대 50으로 함
    getGreenWidth(count) {
      console.log("count",count);
      // month.count의 값에 따라 .greenanimate의 width 값 계산
      if (count < 51) {
        return `${count * 2}%`;
      } else {
        return `100%`;
      }
    },
    // getPinkWidth(count) {
    //   // month.count의 값에 따라 .pinkanimate의 width 값 계산
    //   if (count < 51) {
    //     return `${count * 2}%`;
    //   } else {
    //     return `100%`;
    //   }
    // },

    // month.count 비교
    compareCount() {
      if (this.currentMonthCount > this.lastMonthCount) {
        return "이번 달 산책 횟수가 저번 달보다 늘었어요!";
      } else if (this.currentMonthCount < this.lastMonthCount) {
        return "이번 달 산책 횟수가 저번 달보다 줄었어요!";
      } else {
        return "이번 달 산책 횟수와 저번 달 산책 횟수가 같아요!";
      }
    },
  },
  computed: {
    sortedFriends() {
      // friends 배열을 count 값에 따라 내림차순으로 정렬하여 반환하는 새로운 배열을 생성
      const sortedArr = [...this.data[1].friends].sort(
        (a, b) => b.count - a.count
      );
      return sortedArr;
    },
  },
  mounted() {
    this.checkNextMonthVisibility(); // Check visibility when the component is mounted
  },
});
</script>

<style>
.month_change {
  position: relative;
  display: flex;
  align-items: center;
  padding: 2vh;
  width: 100%;
  height: 7%;
  box-sizing: border-box;
}
.prevMonth{
  width: 10%;

}
.month{
  width: 80%;
  align-items: center;
  display: flex; /* Flex container 설정 */
  justify-content: center; /* 가로 왼쪽 정렬 설정 */
}
.nextMonth{
  width: 10%;
}

.text_style_title {
  text-align: left;
}

.text_style_subtitle {
  text-align: left;
  padding-left: 2%;
  font-size: 2.1vh;
  color: #353535;
}

.text_style_content {
  text-align: left;
}

#Myrankingpg {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
}

.Rank_middle {
  width: 100%;
  height: 90%;
}


/* 페이지 정보 바 */
.myRank_wrap {
  width: 100%;
  height: 9%;
  padding: 2%;
  box-sizing: border-box;
}

#myRank {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dfefff;
  border-radius: 10px;
  color: #ffffff;
}

/* 페이지 이동 버튼 */
.buttons_container {
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5%;
  margin-bottom: 3%;
}

.rank_button {
  width: 50%;
  height: 100%;
  margin: 3.5%;
  font-size: 15px;
  border: none;
  color: #00c0ff;
  padding: 2%;
  cursor: pointer;
  border-radius: 3vh;
  background-color: #dfefff;
}

.click_rank_button {
  width: 50%;
  height: 100%;
  margin: 3.5%;
  font-size: 15px;
  border: none;
  color: #dfefff;
  padding: 2%;
  cursor: pointer;
  border-radius: 3vh;
  background-color: #00c0ff;
}

/* 페이지 전체 테두리 */
.rank_margin {
  width: 100%;
  height: 80%;
  padding: 3%;
  box-sizing: border-box;
}

.rank {
  width: 100%;
  height: 74vh;
  box-sizing: border-box;
  border: 5px solid #e7e4e4;
  border-radius: 20px;
  padding: 3%;
  overflow-y: scroll;
}

.rank-container {
  padding-top: 1%;
  padding-bottom: 0.1%;
}

/* 초록 테두리와 핑크 테두리 */
.green-rank {
  background-color: #ffffff;
  border: 2px solid #00c0ff;
  border-radius: 10px;
  margin: 2%;
  padding: 7%;
  margin-bottom: 7%;
}

.pink-rank {
  border: 2px solid #00c0ff;
  border-radius: 10px;
  padding: 7%;
  margin: 2%;
}

/*그래프 */
.graph {
  position: relative;
  width: 100%;
  height: 30px;
  background-color: #dedede;
  margin-top: 1.5%;
  margin-bottom: 3%;
}

.graph .text {
  position: absolute;
  left: 10px;
  top: 4px;
  z-index: 1;
  color: #353535;
  font-size: 2.1vh;
}

.greenanimate {
  height: 30px;
  text-align: center;
  background-color: #dfefff;
  color: #111;
  animation-name: fadegreen;
  animation-duration: 3s;
}

.pinkanimate {
  height: 30px;
  text-align: center;
  background-color: #dfefff;
  color: #111;
  animation-name: fadepink;
  animation-duration: 3s;
}

@keyframes fadegreen {
  0% {
    width: 0%;
  }

  100% {}
}

@keyframes fadepink {
  0% {
    width: 0%;
  }

  100% {}
}

/* 프로필 사진 */
.friend-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.friend-info {
  flex: 1;
  text-align: left;
}

/* 구분선 */
.friend-separator {
  border: 1.5px solid #dddddd;
}

/* top 가운데 정렬 */
.top_10 {
  text-align: center;
}
</style>