<template>
  <div id="background">
    <div id="dailyreport">
      <div class="reportbody">
        <div class="walkfriend">
          <h1>동행한 사람</h1>
          <div class="person-container">
            <img
            v-for="friend in selectedFriendsData"
            :key="friend.userKey"
            :src="require('@/assets/' + friend.memberImage)"
            alt="friend image"
          />

          </div>
        </div>
        <div class="todaypoint">
          <p>획득한<br />도토리</p>
          <div class="point-container">
            <template v-for="i in getpoint" :key="i">
              <img src="../assets/getpoint.png" class="point" />
            </template>
          </div>
        </div>

        <div class="todaydata_1">
          <div class="walk">
            <img src="../assets/walkicon.png" />
            <p>{{ steps }} 걸음</p>
          </div>
          <div class="kcal">
            <img src="../assets/kcal.png" />
            <p>{{ calculateCaloriesBurned(this.distance) }} 칼로리</p>
          </div>
        </div>

        <div class="todaydata_2">
          <div class="time">
            <img src="../assets/timericon.png" />
            <p>{{ this.timer }} sec</p>
            <KakaoMap />
          </div>

          <div class="long">
            <img src="../assets/distanceicon.png" />
            <p>{{ this.distance }} KM</p>
          </div>
        </div>
      </div>
      <button class="walkclose" @click="$router.push('/MainPage')">닫기</button>
    </div>
  </div>
</template>

<script>
// import pointImage from "@/assets/point.png";
// import getpointImage from "@/assets/getpoint.png";

export default {
  name: "WalkDayReport",

  data() {
    return {
      // images: Array(5).fill(pointImage),
      steps: 0,
      selectedFriendsData: [],
      // timer: this.time, // Initialize timer with the passed prop
      // distance: this.distance, // Initialize distance with the passed prop
    };
  },

  mounted() {
    // this.timeData = {
    //   min: parseInt(this.$route.query.min),
    //   seconds: parseInt(this.$route.query.seconds),
    // };
    // console.log("timeData:", this.timeData);

    this.getpoint = parseFloat(this.$route.query.getpoint);
    this.timer = parseInt(this.$route.query.time);
    this.distance = parseFloat(this.$route.query.distance).toFixed(2);
    this.selectedFriendsData = JSON.parse(this.$route.query.selectedFriends || '[]');

    console.log("Props received:");
    console.log("distance:", this.distance);
    console.log("timer:", this.timer);
    console.log("getpoint:", this.getpoint); // Use "this.getpoint" to access the prop

    // this.distance = parseFloat(this.$route.query.distance);
    this.steps = parseInt(this.$route.query.steps);

    // this.changeImages();
  },
  computed: {
    // totalTime() {
    //   return `${this.timeData.min
    //     .toString()
    //     .padStart(2, "0")}:${this.timeData.seconds
    //     .toString()
    //     .padStart(2, "0")}`;
    // },
    // totalTime() {
    //   const min = Math.floor(this.time / 60);
    //   const seconds = this.time % 60;
    //   return `${min.toString().padStart(2, "0")}:${seconds
    //     .toString()
    //     .padStart(2, "0")}`;
    // },

    calculateCaloriesBurned() {
      return (distance) => {
        const calories = distance * 65;
        return calories.toFixed(0);
      };
    },
  },
  // methods: {
  // changeImages() {
  //   const numImageChanges = this.getpoint; // Assuming one image per 5 units of getpoint
  //   const newImage = getpointImage;
  //   if (numImageChanges > this.images.length) {
  //     // Increase the length of the images array
  //     const additionalImages = Array(
  //       numImageChanges - this.images.length
  //     ).fill(newImage);
  //     this.images = this.images.concat(additionalImages);
  //   }
  // },
  // },
};

</script>

<style scoped>
#background {
  background-color: rgb(141, 139, 139);
  position: relative;
  width: inherit;
  padding: 40px;
  height: 100vh;
}

#dailyreport {
  background-color: rgb(255, 255, 255);
  border-radius: 50px;
  height: 73%;
  margin-top: 1vh;
  padding: 50px 0;
}
.todaypoint {
  padding: 0 70px;
  display: flex;
}

.point-container {
  display: flex;
}

.walkfriend {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 7px solid rgb(179, 179, 179);
  background-color: rgb(255, 255, 255);
  height: 8vh;
  border-radius: 30px;
  margin: 19px 0;
  padding: 0 20px;
}

.walkfriend h1 {
  font-size: 1.4vh;
}

.person-container {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.person-container img {
  margin: 0 5px;
}

.todaypoint {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 7px solid rgb(179, 179, 179);
  background-color: rgb(255, 255, 255);
  height: 8vh;
  border-radius: 30px;
  margin: 19px 0;
  padding: 0 20px;
}

.todaypoint p {
  font-weight: bold;
  text-align: center;
  font-size: 1.5vh;
}

.point-container {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.point {
  width: 3vh;
  height: 3vh;
  margin-right: 5px;
}

.reportbody {
  background-color: rgba(218, 213, 213, 0.893);
  display: block;
  height: 90%;
  padding: 23px;
}

.walkfriend img {
  text-align: right;
  margin: 5px;
  width: 4vh;
  border-radius: 100%;
  border: 0.5px solid #333;
}

.walkfriend,
.todaypoint {
  border: 7px solid rgb(179, 179, 179);
  background-color: rgb(255, 255, 255);
  height: 9vh;
  border-radius: 30px;
  text-align: left;
  margin: 1vh 0;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
}

.todaydata_1,
.todaydata_2 {
  height: 20vh;
  width: 100%;
  display: flex;
  margin: auto;
  margin-left: 0%;
}

.todaydata_1 img,
.todaydata_2 img {
  width: 8vh;
  margin: 2vh;
}

.todaydata_1 p,
.todaydata_2 p {
  font-size: 2vh;
}

.walk,
.kcal,
.time,
.long {
  flex: 1;
  background-color: rgb(228, 228, 228);
  border: 5px solid rgb(142, 141, 141);
}

.walk {
  border-radius: 30px 0 0 0;
}
.kcal {
  border-radius: 0 30px 0 0;
}
.time {
  border-radius: 0 0 0 30px;
}
.long {
  border-radius: 0 0 30px 0;
}

.walkclose {
  cursor: pointer;
  border: none;
  background: #02311e;
  color: white;
  font-size: 30px;
  border-radius: 20px;
  padding: 0.8vh 4vh;
  margin: 0.8vh;
}
.walkclose:hover {
  background-color: rgba(182, 10, 10, 0.63);
  font-weight: bold;
  transform: scale(1, 1);
  transition: all 0.3s;
}
</style>