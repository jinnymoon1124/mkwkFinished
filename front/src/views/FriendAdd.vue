<template>
  <div id="friendaddpg">
    <!-- 아이디를 입력하라는 모달창 -->
    <div class="black-bg2" v-if="openModal == true">
    <div class="white-bg2">
      <!-- ID 입력창 및 메시지 -->
      <h2 v-if="!friend">ID를 입력하세요!</h2>
      <input v-if="!friend" type="text" class="textfield" v-model="input" placeholder="입력해주세요!" />
      
      <!-- 확인 버튼 -->
      <button v-if="!friend" class="ok" @click="findFriend">확인</button>

      <div v-if="friend">
        <!-- Friend 이미지 및 이름 -->
        <img
          :src="getDynamicImageUrl(friend.noMemberImage)"
          alt="friendimage"
          class="friend-image2"
        />
        <p class="found">
          {{ friend.noMemberName }}님이 발견되었습니다! <br />
          추가하시겠습니까?
        </p>
        <div class="YorN">
          <button class="accept" @click="acceptFriend">수락</button>
          <button class="reject" @click="closeModal">거절</button>
        </div>
      </div>

        <img v-if="!friend" src="@/assets/x.png" alt="나가기" class="exit-button" @click="openModal = false">
      </div>
    </div>
    <Header :title="pageTitle">
      <!-- "right" 슬롯에 버튼을 전달 -->
      <template v-slot:right>
        <div class="top_right">
          <button class="friendadd-button2" @click="openModal = true">
            아이디로 친구추가
          </button>
        </div>
      </template>
    </Header>

    <div class="friend-list-box1">
      <div class="friend-list-box2">
        <div class="friend-list2">
          <div v-for="friend in friends" :key="friend.id" class="friend2">
            <img
              :src="require('@/assets/' + friend.memberImage)"
              alt="friendimage"
              class="friend-image2"
            />
            <span class="friend-name2">{{ friend.memberName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { useRouter } from "vue-router";
import Header from '@/components/Header.vue';
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "pg_friendadd",
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    function goBack() {
      router.go(-1);
    }
    return {
      goBack,

    };
  },
  methods: {
    async acceptFriend() {
    try {
        if (this.friend && this.friend.userEmail) {
            // 여기에서 이미 존재하는 알림 데이터를 검색
            const response = await axios.get(`http://localhost:8080/api/notification-by-email`, {
                params: {
                    userEmail: this.friend.userEmail,
                }
            });

            if (response.status === 200 && response.data.length > 0) {
                // 이미 알림 데이터가 존재하면 수락 버튼을 비활성화
                this.showAlertModal("이미 친구 신청을 보냈습니다.");
            } else {
                // 알림 데이터가 없으면 새로운 알림 데이터 생성 및 전송
                const response = await axios.post(`http://localhost:8080/api/send-friend-request-notification`, null, {
                    params: {
                        targetUserEmail: this.friend.userEmail,
                        noMemberName: this.friend.noMemberName,
                        userkey: this.friend.userkey,
                        noMemberImage: this.friend.noMemberImage,
                    }
                });

                if (response.status === 200) {
                    this.showAlertModal("친구 신청이 전송되었습니다!");
                } else {
                    this.showAlertModal("친구 신청을 보내는 데 실패했습니다. 다시 시도하십시오.");
                }
            }
        } else {
            this.showAlertModal("유효한 친구 정보가 없습니다.");
        }
    } catch (error) {
        console.error("Error sending friend request notification", error);
    }

    this.closeModal();
},

async findFriend() {
  if (this.input === "1@naver.com") {
    this.showAlertModal("본인의 이메일 주소입니다.");
  } else {
    try {
      const response = await axios.get(`http://localhost:8080/api/memberno-info?userEmail=${this.input}`);
      if (response.status === 200 && response.data) {
        this.friend = response.data;
        console.log("Friend Data:", this.friend); // Add this line
      } else {
        this.showAlertModal("사용자를 찾을 수 없습니다!");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.showAlertModal("사용자를 찾을 수 없습니다!");
      } else {
        console.error("Error fetching member information", error);
      }
    }
  }
},
  
      closeModal() {
    this.openModal = false;
    this.input = "";
    this.friend = null;
    },

    showAlertModal(message) {
      Swal.fire({
        icon: "warning",
        title: "경고",
        text: message,
        showConfirmButton: false,
        timer: 2000,
      });
    },
    getDynamicImageUrl(noMemberName) {
  if (noMemberName) {
    // Construct the image path dynamically
    return require(`@/assets/${noMemberName}`);
  }
},
    async fetchMemberInfo() {
    try {
      const response = await axios.get("http://localhost:8080/api/member-info");
      // Filter out the user with userkey=1 from the response data
      this.friends = response.data.filter((user) => user.userkey !== 1);
    } catch (error) {
      console.error("Error fetching member information", error);
    }
  },
    goToFriendList() {
      this.$router.push("/friendlist");
    },
  },
  mounted() {
    this.fetchMemberInfo(); // Fetch member information when the component is mounted
    },
  data() {
    return {
      pageTitle: "친구 추가",
      openModal: false,
      inputValue: "",
      friend: null,
      friends: [],
      isCurrentUser: false,
    };
  },
};
</script>
  
<style>
.friendadd.top_center {
  width: 40%;
}

.friendadd .top_left {
  width: 10%;
}

.friendadd .top_right {
  width: 50%;
  height: 100%;
}

.friendadd .top_wrap {
  width: 100%;
}

#friendaddpg {
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.upperbar {
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;
}

.upperbar>h1 {
  font-size: 20px;
  padding-left: 20px;
}

/* 
.friendadd-button2_btn_wrap {
  display: flex;
  height: 100%;
  padding: 2%;
  flex-grow: 1;
  box-sizing: border-box;
  justify-content: space-between;
} */



.top_right>.friendadd-button2 {
  padding: 4%;
  border-radius: 30vh;
  border: none;
  display: flex;
  width: 17vh;
  height: 4.5vh;
  justify-content: center; 
  align-items: center;
}

/* .top_right>.friendadd-button2:hover {
  border: 0.4vh solid grey;
  font-weight: bold;
  transform: scale(1, 1);
  transition: all 0.3s;
} */

.friend-list-box1 {
  width: 100%;
  height: 90%;
  padding: 2%;
  padding-bottom: 2%;
  box-sizing: border-box;
  padding-top: 3%;
}

.friend-list-box2 {
  width: 100%;
  height: auto;
  display: flex;
  /* flex-direction: column; */
  /* justify-content: flex-start; */
  /* align-items: flex-start; */
  padding: 3%;
  box-sizing: border-box;
  background-color: #F1F7FD;
  border: 0.3vh solid #ccc;
  border-radius: 10px;
}

.friend-list2 {
  width: 100%;
  
  /* margin: 0; */
  /* padding: 0; */
  /* white-space: nowrap; */
  /* overflow-y: scroll; */
}

.friend2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ccc;
  box-sizing: border-box;
  padding: 10px 0;
}

.friend-image2 {
  width: 100px;
  border-radius: 50%;
  border: 1px solid rgb(43, 43, 43);
  margin: 2vh
}

.friend-name2 {
  font-size: 30px;
  font-weight: bold;
  /* 부모 요소의 80퍼로 가로 사이즈, 가로 중앙 정렬 */
  width: 80%;
  justify-content: center;
}

.addfriend-button2 {
  padding: 10px 15px 10px 20px;
  background-color: #dcdada;
  cursor: pointer;
  border-radius: 60px;
}

.black-bg2 {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  padding: 20px;
  box-sizing: border-box;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.white-bg2 {
  width: 100%;
  background: rgb(235, 233, 232);
  border-radius: 30px;
  padding: 5%;
  padding-top: 7%;
  box-sizing: border-box;
  font-size: 15px;
}

.white-bg2 h2 {
  padding-bottom: 5%;

}

.textfield {
  border-radius: 8px;
  width: 90%;
  height: 8vh;
  padding-left: 10px;
  border: 4px solid gray;
}

.ok {
  border-radius: 8px;
  margin-top: 5%;
  width: 25%;
  height: 5vh;
  border: 4px solid lightgray;
  font-weight: bold;
}

.ok:hover {
  border: 5px solid grey;
  background-color: grey;
  color: white;
  transform: scale(1, 1);
  transition: all 0.2s;
}

.image2 {
  padding-top: 6%;
  padding-bottom: 4%;
  width: 50%;
  border-radius: 50%;
  margin: 1%;
}

.found {
  font-size: 3vh;
  margin-bottom: 5%;
}

.YorN {
  padding-bottom: 5%;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.reject {
  width: 40%;
  padding: 0 10%;
  background-color: #dcdada;
  border: none;
  border-radius: 25px;
  color: #4a4a4a;
  font-size: 1.7rem;
  font-weight: bold;
}

.reject:hover {
  border: 5px solid rgb(99, 4, 4);
  background-color: rgb(99, 4, 4);
  color: white;
  transform: scale(1, 1);
  transition: all 0.2s;
}

.accept {
  width: 40%;
  padding: 0 10%;
  background-color: #dcdada;
  border: none;
  border-radius: 25px;
  color: #4a4a4a;
  font-size: 1.7rem;
  font-weight: bolder;
}

.accept:hover {
  border: 5px solid rgb(3, 87, 44);
  background-color: rgb(3, 87, 44);
  color: white;
  transform: scale(1, 1);
  transition: all 0.2s;
}

.exit-button {
  position: absolute;
  top: 38%;
  left: 8%;
  width: 38px;
  height: 38px;
}
</style>
  