<template>
    <div id="mappage" class="scrollable-content">
  
      <div id="map">
        <div class="uptab">
        <img src="@/assets/backbutton.png" class="goBack" @click="openWalkCancelModal" />
          <img
            v-for="friend in selectedFriendsData"
            :key="friend.userKey"
            class="imwith"
            :src="require('@/assets/' + friend.memberImage)"
            alt="friend image"
          />
        </div>
      </div>
      <div id="walkcontainer">
        <div id="pointcontainer">
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            class="point"
          />
        </div>
        <div id="datacontainer">
          <div class="walkdata">
            <img src="../assets/walkicon.png" />
            <p>{{ averageNumberOfSteps }} 걸음</p>
          </div>
          <div class="timerdata">
            <img src="../assets/timericon.png" />
            <p>{{ formatTime(timer) }}</p>
          </div>
          <div class="distancedata">
            <img src="../assets/distanceicon.png" />
            <p>{{ distance.toFixed(2) }}</p>
          </div>
        </div>
  
        <button
          type="button"
          :class="{ walkstart: !isWalking, walkend: isWalking }"
          @click="showMyRoute"
        >
          {{ isWalking ? "Stop" : "Start" }}
        </button>
      </div>
    </div>
  </template>
      
  <script>
  /* eslint-disable no-undef */
  import pointImage from "@/assets/point.png";
  import getpointImage from "@/assets/getpoint.png";
  import axios from "axios";
  import { setGISCallbackFunc } from "@/assets/js/teamplCore";
  import Swal from 'sweetalert2';
  
  function calculateCaloriesBurned(distance) {
    const conversionFactor = 65;
    const caloriesBurned = distance * conversionFactor;
    return caloriesBurned;
  }
  export default {
    name: "KakaoMap",
    data() {
      return {
        map: null,
        openModal1: false,
        openModal2: false,
        timer: 0,
        isWalking: false,
        distance: 0.0,
        watchId: null,
        position: null,
        marker: null,
        previousPosition: null,
        timeoutId: null,
        timerId: null,
        polyline: null,
        images: Array(5).fill(pointImage),
        averageNumberOfSteps: 0,
        getpoint: 0,
        sampleList: [],
        selectedFriendsData: [],
  
        walkDataSent: false,
        walkkey: this.walkkey,
        currentWalk: null,
      };
    },
    mounted() {
      this.selectedFriendsData = JSON.parse(
        this.$route.query.selectedFriends || "[]"
      );
      this.walkKey = JSON.parse(this.$route.query.walkkey || null);
  
      // 지도관련 callback함수 등록(native로부터 위치값 수신시 GPSRecvMsg함수 실행)
      setGISCallbackFunc(this.GPSRecvMsg);
      // id = map인 div 내부에 팀플코어측 맵 추가하는 함수
      this.addMapFrame();
    },
  
    methods: {
      async openEndWalkModal() {
    const result = await Swal.fire({
      icon: 'warning',
      title: '산책을 마칠까요?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      this.testEndWalkUser(); // 기존의 testEndWalkUser 함수를 실행합니다.
      return;
    }
  },

      async openWalkCancelModal() {
    const result = await Swal.fire({
      icon: 'warning',
      title: '산책을 취소할까요?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      this.deleteWalk();
      this.$router.push('/');
      return;
    }
  },
  
      // 산책 리스트 가져오기
      async testGetWalkList() {
      const param = {
        userkey: 1,
        walkkey: this.walkkey,
      };
      const result = await axios.post("/wk.getWalkList", { walk: param });
      console.log(result.data.walk[0].walkkey);
      console.log(result.data.walk[0].creuserkey);
      console.log(result.data.walk[0].muserList[0].userwalkkey);
      console.log(result.data.walk[0]);

      this.currentWalk = result.data.walk[0].walkkey;
      this.creuserkey = result.data.walk[0].creuserkey;
      this.userwalkkey = result.data.walk[0].muserList[0].userwalkkey;
      if (result.data) {
        if (result.data.walk) {
          this.mwalkList = result.data.walk;
        }
      }
    },
    // 산책끝내기(유저가)
    async testEndWalkUser() {
      // 파라미터 없음(글로벌 변수에 해당산책 상세값을 저장해두었으니까)
      // const muserList = this.walkDetail.muserList;
      // let muserWalkKey = null as number|null
      // let muser = null;
      // for (let i = 0; i < muserList.length; i++) {
      //   if (Number(muserList[i].userkey) === 1) {
      //     // 내 유저키 : 1(임시)//하드코딩
      //     muser = muserList[i];
      //   }
      // }

      const param = {
        walkkey: this.currentWalk,
        userkey: this.creuserkey,
        userwalkkey: this.userwalkkey,
        getpoint: this.getpoint,
      };
      const result = await axios.post("/wk.endWalkUser", param);
      console.log("=====================", result);

      // 선택한 모든 친구 이미지 파일 이름을 DB에 저장
      this.selectedFriendsData.forEach((friend) => {
        const friendImage = friend.memberImage;
        if (friendImage) {
          // 간단한 JSON 형식으로 파일 이름만 전송
          axios
            .post("/api/save-friend-image", {
              walkkey: 333, // walkkey를 요청에 추가
              userkey: 1,
              friendImage: friendImage,
            })
            .then((response) => {
              if (response.data.status === "success") {
                console.log("서버 응답:", response.data);
                console.log(response.data.message);
              } else {
                console.error("서버 응답:", response.data);
                console.error(response.data.message);
              }
            })
            .catch((error) => {
              console.error(
                "친구 이미지 파일 이름을 저장하는 중 오류 발생:",
                error.message
              );
              if (error.response && error.response.data) {
                console.error("Server response:", error.response.data);
              }
            });
        }
      });

      this.stopTimer();
      const caloriesBurned = calculateCaloriesBurned(this.totalDistance); // Calculate calories bWalkDayReporturned
      console.log(`소모칼로리: ${caloriesBurned.toFixed(2)} `);

      console.log(
        "========================",
        this.timer,
        this.distance,
        this.getpoint
      );

      this.$router.push({
        path: "./walkdayreport",
        query: {
          // walkkey: result.data.walkkey,
          selectedFriends: JSON.stringify(this.selectedFriendsData),
          getpoint: this.getpoint,
          time: this.timer,
          distance: this.distance,
        },
      });
    },
    async deleteWalk() {
      const param = {
        walkkey: this.walkKey,
      };
      // walkkey: this.walkKey,
      console.log("ddddddddddddddddd", this.walkKey);

      const result = await axios.post("/wk.deleteWalk", { walkkey: param.walkkey });
      console.log("ddddddddddddddddd", result);
      this.walkKey = null;

      this.$router.push({
        path: "./mainpage",
      });
    },

    // native에서 걸음수카운트, 위치정보를 보내주면 맵에 그림그리도록 설정해둔 함수(콜백)
    GPSRecvMsg(data) {
      console.log(data);
      if (!data || !data.location || !data.location.lat || !data.location.lng)
        return;
      // sampleList가 사용자 위치를 담고있는 리스트임
      if (
        (this.sampleList && this.sampleList.length === 0) ||
        (this.sampleList.length > 0 &&
          (data.location?.lat !==
            this.sampleList[this.sampleList.length - 1]?.lat ||
            data.location.lng !==
              this.sampleList[this.sampleList.length - 1]?.lng))
      ) {
        this.sampleList.push(data.location);
        // eslint-disable-next-line no-undef
        tcSso.updateMap({
          jogRoute: this.sampleList,
          isJogging: true,
          zoom: 14,
        });
      }
      console.log(this.sampleList);
    },
    addMapFrame() {
      const data = {
        size: {
          w: "100%",
          h: "100%",
        },
      };
      // eslint-disable-next-line no-undef
      iframeService.drawingMap(data, this.GPSRecvMsg);
    },
    // 위도*경도 리스트 추가시 맵위에 폴리곤 그리는 함수
    showMyRoute() {
      this.testGetWalkList();
      const routeList = [
        { lat: 37.5665779, lng: 126.9784224 },
        { lat: 37.5665781, lng: 126.9784244 },
        { lat: 37.5665879, lng: 126.9784424 },
        { lat: 37.5666773, lng: 126.9784724 },
        { lat: 37.5667479, lng: 126.9784824 },
        { lat: 37.5668779, lng: 126.9785224 },
        { lat: 37.5665739, lng: 126.9785214 },
        { lat: 37.5675773, lng: 126.9785284 },
        { lat: 37.5685579, lng: 126.9794524 },
        { lat: 37.5695773, lng: 126.9795224 },
        { lat: 37.5765779, lng: 126.9799224 },
        { lat: 37.5865779, lng: 126.9811224 },
        { lat: 37.5965775, lng: 126.9817224 },
        { lat: 37.5995779, lng: 126.9894224 },
      ];
      // eslint-disable-next-line no-undef
      tcSso.showMap({ coords: routeList, zoom: 14 });

      let totalDistance = 0;

      if (!this.isWalking) {
        // Start the timer and random movement
        this.isWalking = true;
        this.timer = 0;
        this.intervalId = setInterval(() => {
          this.timer++;

          if (this.timer % 5 === 0) {
            this.changeImage();
          }
        }, 1000);
        // Calculate distance
        for (let i = 1; i < routeList.length; i++) {
          const lat1 = routeList[i - 1].lat;
          const lng1 = routeList[i - 1].lng;
          const lat2 = routeList[i].lat;
          const lng2 = routeList[i].lng;
          // Using Haversine formula to calculate distance
          const radlat1 = (Math.PI * lat1) / 180;
          const radlat2 = (Math.PI * lat2) / 180;
          const theta = lng1 - lng2;
          const radtheta = (Math.PI * theta) / 180;
          let distance =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          distance = Math.acos(distance);
          distance = (distance * 180) / Math.PI;
          distance = distance * 60 * 1.1515;
          distance = distance * 1.609344; // Convert to kilometers
          totalDistance += distance;
        }

        this.distance = totalDistance;
        // Call the startRandomMovement method
      } else {
        // Stop the timer
        this.isWalking = false;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);

        this.stopTimer();
        this.openEndWalkModal();
      }
    },
    // endCount시 걸음수 카운트가 시작됨
    end() {
      // eslint-disable-next-line no-undef
      iframeService.endCount();

      // 걸음수 카운트가 종료되면, 종료결과 폴리곤을 맵에 그려주는 함수
      if (this.sampleList.length === 0) return;
      // eslint-disable-next-line no-undef
      tcSso.updateMap({ jogRoute: this.sampleList, isJogging: false });

      this.sampleList = [];
    },
    // startCount시 걸음수 카운트가 시작됨
    test() {
      // eslint-disable-next-line no-undef
      iframeService.startCount();
    },
    // calculateAverageSteps(distance) {
    //   const averageWalk = 0.762; // 평균적으로 성인 걸음 당 미터
    //   const distanceInMeters = distance * 1000;
    //   const averageNumberOfSteps = Math.round(distanceInMeters / averageWalk);
    //   return averageNumberOfSteps;
    // },
    // startRandomMovement() {
    //   if (this.position) {
    //     const { latitude, longitude } = this.position;
    //     const randomLat = latitude + Math.random() * 0.001;
    //     const randomLng = longitude + Math.random() * 0.001;
    //     const newPosition = new kakao.maps.LatLng(randomLat, randomLng);

    //     const path = this.polyline.getPath();
    //     path.push(newPosition);
    //     this.polyline.setPath(path);

    //     this.marker.setPosition(newPosition);
    //     this.map.panTo(newPosition);

    //     if (this.previousPosition) {
    //       const newDistance = calculateDistance(
    //         this.previousPosition,
    //         newPosition
    //       );
    //       this.distance += newDistance;

    //       const averageSteps = this.calculateAverageSteps(this.distance); // 걸음수 계산
    //       this.averageNumberOfSteps = averageSteps;
    //     }
    //     this.previousPosition = newPosition;

    //     this.timeoutId = setTimeout(() => {
    //       this.startRandomMovement();
    //     }, 2000);
    //   } else {
    //     console.error("Position is not available.");
    //   }
    // },

    // stopTracking() {
    //   navigator.geolocation.clearWatch(this.watchId);
    //   this.distance = 0;
    //   this.totalDistance = 0;
    //   console.log("Tracking stopped.");
    // },
    startTimer() {
      this.timerId = setInterval(() => {
        this.timer += 1;
      }, 1000);
      this.isWalking = true;
    },
    stopTimer() {
      clearInterval(this.timerId);
      clearTimeout(this.timeoutId); // Add this line
      this.timerId = null;
      this.isWalking = false;
    },
    changeImage() {
      const newImage = getpointImage;
      const currentIndex = Math.floor(this.timer / 5) - 1;

      if (currentIndex < this.images.length) {
        // Replace the image at the current index with the new image
        this.images.splice(currentIndex, 1, newImage);

        this.getpoint++;
      }
    },
    updateChangedImageCount(count) {
      this.getpoint = count;
    },
    closeModal() {
      this.openModal2 = false;
      this.startTimer();
      // this.startRandomMovement(); // Call the startRandomMovement method
    },
    formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${min.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    },
    destroyed() {
      this.stopTimer();
    },
  },
};
</script>
  
  
  <style scoped>
  .scrollable-content {
  overflow: hidden; /* 혹은 필요한 높이 값으로 설정 */
}

  #mappage{ 
      background-color: #EBEFFF;
      width:inherit;  
      position:relative; 
      height: 100%;
      width: 100%;
  }
  p {
      font-weight: bolder;
      letter-spacing: 3px;
  }
  
  .goBack {
      float: left;
      width:4vh;
      background-color:rgb(255, 255, 255);
      margin-top: 20px;
      margin-left: 8vh;
      border-radius: 20px;
  }
  
  #map {
      width: 100%;
      margin:auto;
      height: 60vh;
      z-index: 1;
  }
  .uptab {
      z-index: 2;
      height: 50px;
      position: absolute;
  }
  .imwith {
      width: 9vh;
      margin: 5px;
      border-radius: 100%;
      border: 1px solid #333;
  }
  
  #walkcontainer {
      width:100%;
      height: 44vh;
      background-color: rgb(244, 244, 244);
  }
  #pointcontainer {
      height: 8vh;
  }
  #datacontainer {
      height: 17vh;
      display: flex;
  }
  
  #datacontainer p {
      font-size: 20px;
  }
  
  .timerdata img, .walkdata img, .distancedata img {
      width: 34%;
      padding: 2vh 1vh;
  }
  
  .point {
      width: 5vh;
      padding: 20px 10px;
  }
  
  .walkdata {
      flex : 1;
  }
  
  .timerdata {
      flex : 1;
      
  }
  
  .distancedata {
      flex : 1;
  }

  .walkstart{
    background-color: #77af9c;
    color: #ffffff;
    border: none;
    display: inline-block;
    margin: 1vh;
    padding: 3vh 5vh;
    border-radius: 15px;
    font-size: 30px;
    letter-spacing: 5px;
}

  .walkstart:hover {
      background-color: #036439;
      color: white;
      font-weight: bold;
      transform: scale(1, 1);
      transition: all 0.5s
  }
  
  .walkend {
      background-color: #b40617;
      color: #ffffff;
      border: none;
      display: inline-block;
      margin: 1vh;
    padding: 3vh 5vh;
    border-radius: 15px;
    font-size: 30px;
    letter-spacing: 5px; 
  }
  .walkend:hover {
      background-color: #790511;
      color: white;
      font-weight: bold;
      transform: scale(1, 1);
      transition: all 0.5s
  }
  
  </style>