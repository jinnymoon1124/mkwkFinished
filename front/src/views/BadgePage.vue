<template>
  <div class="badgepage">
    <!-- top -->
    <Header :title="pageTitle" />

    <!-- middle -->
    <div class="middle scroller">
      <transition name="fade">
        <div v-if="showMessage" class="badge-message">
          배지 획득
        </div>
      </transition>

     <!-- 대표 배지 박스 -->
     <div class="mainbadge">
        <div class="MB_main">
          <div class="MB_top">
            <p>대표 배지</p>
          </div>
          <div class="MB_wrap">
            <div class="MB_left">
              <img class="mainbadge_img" :src="mainBadge.img || require('@/assets/BadgePage/lock.png')" alt="대표 배지" />
            </div>
            <div class="MB_right">
              <p v-if="!mainBadge.img">대표 배지를<br />설정해 보세요!</p>
              <p v-else>{{ mainBadge.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 중간 줄 -->
      <div class="line"></div>

      <!-- 배지 리스트 -->
      <div class="badgelist">
      <div class="badge" v-for="(badge, index) in badges" :key="index">
        <div class="badge_img" @click="handleBadgeClick(badge)">
          <img :src="getBadgeImage(badge)" />
        </div>
        <div class="badge_name">{{ badge.badgename }}</div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: "MyPage",
  components: {
    Header,
  },
  props: {
    walkCount: {
      type: Number,
      default: 2,
    }
  }, // walkCount prop 선언
  data() {
    return {
      openModal: false,
      selectedBadge: null,
      mainBadge: {
        img: "" // 대표 배지 이미지 URL
      },
      hasShownMessage: false,
      pageTitle: "배지",
      badges: [],
    };
  },
  mounted() {
  const storedBadgeImage = localStorage.getItem('mainBadgeImg');
  const storedBadgeName = localStorage.getItem('mainBadgeName');
  
  if (storedBadgeImage && storedBadgeName) {
    this.mainBadge.img = require(`@/assets/BadgePage/${storedBadgeImage}`);
    this.mainBadge.name = storedBadgeName;
  } else {
    // 데이터가 없을 때의 기본 설정
    this.mainBadge.img = require(`@/assets/BadgePage/lock.png`);
    this.mainBadge.name = "대표 배지를\n설정해 보세요!";
  }

  this.fetchBadges();
},
  methods: {
    // API에서 배지 데이터 가져오는 메서드
    fetchBadges() {
      axios
        .post('http://localhost:8080/wk.getBadgeList', {
          badge: {
            userkey: 1
          }
        })
        .then(response => {
          this.badges = response.data.badge.map(badge => {
            // credate가 null이면 아직 획득하지 않은 데이터로 표시
            badge.isEarned = badge.credate !== null;
            return badge;
          });
        })
        .catch(error => {
          console.error('Error fetching badges:', error);
        });
      },
    // 배지 이미지를 가져오는 메서드
    getBadgeImage(badge) {
      if (badge.isEarned) {
        // 이미 획득한 배지의 경우 배지 이미지를 표시
        return require(`@/assets/BadgePage/${badge.badgeImage}`);
      } else {
        // 아직 획득하지 않은 배지의 경우 "lock.png"를 표시
        return require(`@/assets/BadgePage/lock.png`);
      }
    },
    async handleBadgeClick(badge) {
      if (this.getBadgeImage(badge) === require('@/assets/BadgePage/lock.png')) {
      Swal.fire({
        icon: 'error',
        title: '해당 배지는\n선택할 수 없습니다.',
        text: "미션을 완료하세요!",
      });
    } else {
      const result = await Swal.fire({
        icon: 'warning',
        title: '선택한 배지를\n대표 배지로\n설정하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '네',
        cancelButtonText: '아니오',
      });

      if (result.isConfirmed) {
    this.selectedBadge = badge; // 선택한 배지 설정

    const data = new FormData(); // 새로운 FormData 객체 생성

    data.append("userKey", 1); // 사용자 키 설정, 필요에 따라 실제 사용자 키로 교체
    data.append("mainBadgeName", badge.badgename); // 메인 배지 이름 설정
    data.append("mainBadgeImage", badge.badgeImage); // 메인 배지 이미지 설정

    axios
      .post("http://localhost:8080/api/setMainBadge", data, {
        // FormData를 전송하기 위해 설정 추가
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.mainBadge.img = require(`@/assets/BadgePage/${badge.badgeImage}`);
          this.mainBadge.name = badge.badgename;
          localStorage.setItem('mainBadgeImg', badge.badgeImage);
          localStorage.setItem('mainBadgeName', badge.badgename);
          Swal.fire({
            icon: "success",
            title: "대표 배지가 설정되었습니다!",
          });
      }
    })
    }
    }
    }
  }
};
</script>


<style>
/* 9.26 눈누 폰트 배지 전체 페이지에 적용 */
body {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 800;
    font-style: normal;
}
/* 9.26 page title style */
.page_title{
  color: #747474;
  font-size: 1.5em;
  width: 80%;
  text-align: left;
  /* padding-top: %; */
}

.MBcheck p {
  margin: 3% 0;
}

.MBcheck button {
  width: 70%;
  padding: 2%;
  border-radius: 5px;
}

.badgepage {
  width: 100%;
  height: 90vh;
}
/* .badgepage .top {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center; 
  align-items: flex-end;
  background: none;
} */
/* .badgepage .top_wrap {
  width: 100%;
  height: auto;
  display: flex;
} */
/* .badgepage .top_center {
  color: #747474;
  font-size: 3vh;
  flex-grow: 1; 
  align-items: center;
  justify-content: left;
  text-align: left;
} */
/* .badgepage .top_left,
.badgepage .top_right {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
} */
.badgepage .top_name {
  text-align: center;
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 21px;

  text-align: center;
  letter-spacing: -0.32px;

  color: #ffffff;
}
.badgepage .middle {
  position: relative;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.badgepage .scroller {
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  /* IE and Edge */
}
.badgepage .scroller::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera*/
}
.badgepage .mainbadge {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.badgepage .MB_main {
  width: 89%;
  height: 85%;

  position: relative;
  box-sizing: border-box;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;

  padding: 1em;

  background: #e2e2e2;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.badgepage .MB_top {
  width: 100%;
  height: 6vh;
  display: flex;
  align-items: center;

  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 1.3rem;

  text-align: center;
  letter-spacing: -0.32px;

  color: #747474;
}
.badgepage .MB_wrap {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
}
.badgepage .MB_left {
  width: 50%;
  height: fit-content;
  display: flex;
  flex-direction: row-reverse;
}
.mainbadge_img {
  width: 80px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 100%;
  margin-right: 15px;
}
.badgepage .MB_right {
  width: 50%;
  height: fit-content;
  display: flex;
  flex-direction: row;
}
.badgepage .MB_right p {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 21px;
  /* or 105% */

  text-align: center;
  letter-spacing: -0.32px;

  color: #747474;
}
.badgepage .line {
  width: 90%;
  height: 1px;
  background: #bcbcbc;
}
.badgepage .badgelist {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}
.badgepage .badge {
  width: 30%;
  height: 29%;
  margin: 1%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.badgepage .badge_img {
  width: 5rem;
  height: 5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f4f2ee;
  border-radius: 100%;
}
.badgepage .badge_img img {
  width: 45%;
  height: auto;
}
.badgepage .badge_name {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 1em;
  text-align: center;
  letter-spacing: -0.32px;
  color: #747474;

  padding: 5% 0;
}
</style>
