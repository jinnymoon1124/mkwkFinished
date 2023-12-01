<template>
  <div class="alarmpage">
    <!-- top -->
    <Header :title="pageTitle" />
    <div class="alarmlist">

      <div class="alarmbox" v-for="(notification, index) in notifications" :key="notification.id">
        <img
          :src="require(`@/assets/${notification.noMemberImage}`)" 
          :alt="notification.noMemberName"
          class="alarmpng"
        />
        <div class="friend-request">
          <div class="asktitle">친구 신청이 왔어요!</div>
          <br />'{{ notification.noMemberName }}' 님에게 <br />
          친구 신청이 왔습니다 <br />
          수락하시겠습니까? <br /><br />

          <div class="alarm_yn">
            <button class="friendreject" @click="rejectRequest(index, notification.id, notification.userEmail, notification.userkey)">
              거절
            </button>
            <button class="friendaccept" @click="acceptRequest(notification.userEmail, notification.userkey)">
            수락
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent} from "vue";
import Header from '@/components/Header.vue';
import axios from "axios";

export default defineComponent({
  name: "alarmComponent",
  components: {
    Header,
  },
  data() {
    return {
      notifications: [], // 알림 데이터를 저장할 배열 추가
      pageTitle: "📬 알림이 왔어요!"
    };
  },
  methods: {
  rejectRequest(index, notificationId, userEmail, userkey) {
    if (notificationId !== undefined) {
      // API를 호출하여 알림 삭제
      axios
          .delete(`/api/notifications/${notificationId}`, {
              data: {
                  userEmail: userEmail,
                  userkey: userkey
              }
          })
          .then(() => {
              // 성공적으로 삭제된 경우, 프론트엔드에서도 해당 알림을 제거
              this.notifications.splice(index, 1);
          })
          .catch((error) => {
              console.error("알림 삭제 중 오류 발생: ", error);
          });
    } else {
      console.error("notificationId is not defined or is 'undefined'");
    }
  },

    acceptRequest(userEmail, userkey) {
      // Send an API request to accept the friend request
      fetch("/api/accept-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `userEmail=${userEmail}&userkey=${userkey}`,
      })
        .then((response) => {
          if (response.ok) {
            // Update the UI
            this.notifications = this.notifications.filter((n) => n.userEmail !== userEmail && n.userkey !== userkey);
          } else {
            console.error("Failed to accept the friend request.");
          }
        })
        .catch((error) => {
          console.error("An error occurred while accepting the friend request:", error);
        });
    },
    async fetchNotifications() {
      try {
        const response = await fetch("/api/notifications"); // API 엔드포인트에 맞게 수정
        if (response.ok) {
          this.notifications = await response.json();
        } else {
          console.error("Failed to fetch notifications.");
        }
      } catch (error) {
        console.error("An error occurred while fetching notifications:", error);
      }
    },
  },
  created() {
    this.fetchNotifications(); // 컴포넌트가 생성될 때 알림 데이터 가져오기
  },
});
</script>

<style scoped>
.alarmpage {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
}
.pg_alarm {
  text-align: left;
  font-weight: bold;
  font-size: 3vh;
  color: #4a4a4a;
}

.banner {
  background-color: rgb(92, 86, 86);
  padding: 3%;
  display: flex;
  align-items: center;
  height: 130px;
  box-sizing: border-box;
  justify-content: space-around;
}
.bannerimage {
  width: 80px;
  height: 80px;
}
.bannertext {
  color: #f1f1f1;
  font-size: large;
  margin-left: 2%;
  font-family: 'IBM Plex Sans KR', sans-serif;
}

.alarmlist {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
}
.alarmbox {
  width: 100%;
  display: flex;
  align-items: center;
  /* justify-content: flex-start; */
  padding: 2%;
  box-sizing: border-box;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 2%;
}
.alarmpng {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 2%;
}

.friend-request {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.asktitle {
  font-weight: bold;
  font-size: larger;
}

.alarm_yn {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.friendreject {
  width: 40%;
  background-color: #7a7878;
  border: none;
  border-radius: 25px;
  color: #ffffff;
  font-size: 2vh;
}
.friendaccept {
  width: 40%;
  background-color: #585757;
  border: none;
  border-radius: 25px;
  color: #ffffff;
  font-size: 2vh;
}
</style>