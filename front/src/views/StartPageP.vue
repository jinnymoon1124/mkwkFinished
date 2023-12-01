<template>
  <div class="extra-space">
    <img src="../assets/배경2.png" alt="Extra Image" style="height: 100vh; width: 100%" />
    <div class="complete-button" @click="captureAndSaveImage">완료</div>
    <div class="transparent-circle" ref="transparentCircle">
      <img
        v-if="selectedpetType"
        :src="require(`../assets/icon/${selectedpetType}.png`)"
        style="
          width: 75%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      />
    </div>
    <div class="startpage">
      <div class="bottom-box">
        <div class="border-box" :class="{ 'out-box': petType === 'out' }">
          <div class="pet-name-input">
            <input
              v-model="petName"
              placeholder="Name"
              style="
                width: 90%;
                padding: 10px;
                border: 2px solid #ccc;
                border-radius: 5px;
                margin-bottom: 1vh;
              "
            />
          </div>

          <div class="menu-box">
            <div class="menu-bar">
              <div class="menu" @click="selectedMenu = 'pet'"></div>
            </div>
            <div class="sub-box pet-sub-box" v-if="selectedMenu === 'pet' && petType === 'pet'">
              <div class="pet-images-container">
                <div class="pet-image" @click="setpetType('dog1')">
                  <img src="@/assets/icon/dog1.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog2')">
                  <img src="@/assets/icon/dog2.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog3')">
                  <img src="@/assets/icon/dog3.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog4')">
                  <img src="@/assets/icon/dog4.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog5')">
                  <img src="@/assets/icon/dog5.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog6')">
                  <img src="@/assets/icon/dog6.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog7')">
                  <img src="@/assets/icon/dog7.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog8')">
                  <img src="@/assets/icon/dog8.png" />
                </div>
                <div class="pet-image" @click="setpetType('dog9')">
                  <img src="@/assets/icon/dog9.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import axios from 'axios';

export default {
  name: 'startpageComponent',
  data() {
    return {
      petName: '',
    };
  },
  methods: {
    async captureAndSaveImage() {
      if (!this.selectedpetType || !this.petName) {
        const result = await Swal.fire({
          icon: 'warning',
          title: '펫 설정을 안하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니요',
        });

        if (result.isConfirmed) {
          this.router.push('/');
          return;
        } else {
          return;
        }
      }

      const elementToCapture = this.$refs.transparentCircle;
      const canvas = await html2canvas(elementToCapture);
      const imageDataURL = canvas.toDataURL('image/png');

      // Base64 -> File 변환
      const byteString = atob(imageDataURL.split(',')[1]);
      const mimeString = imageDataURL.split(',')[0].split(':')[1].split(';')[0];

      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
      const file = new File([uintArray], 'image.png', { type: mimeString });

      // 서버로 전송
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userKey', 1);
      formData.append('petName', this.petName);
      try {
        const response = await axios.post('http://localhost:8080/api/save-pet-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          this.$router.push({ name: 'mainpage' });
        } else {
          alert('저장에 실패하였습니다.');
        }
      } catch (error) {
        alert('저장에 실패하였습니다.');
      }

      // const downloadLink = document.createElement('a');
      // downloadLink.href = imageDataURL;
      // downloadLink.download = 'captured_image.png';
      // downloadLink.click();
      // this.$router.push({ name: 'mainpage' });
    },
  },
  setup() {
    const router = useRouter();

    // 페이지 진입 시 이미 이미지가 등록된 사용자는 다른 페이지로 이동
    onMounted(() => {
      try {
        axios
          .get('http://localhost:8080/api/member-info', { params: { userKey: 1 } })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              if (res.data.memberImage) {
                if (res.data.petImage) {
                  // 펫 정보가 저장되어 있으면 메인 페이지로 이동
                  router.push({ name: 'mainpage' });
                }
              } else {
                // 사용자 정보가 저장되어 있지 않으면 시작 페이지로 이동
                router.push({ name: 'startpagep' });
              }
            } else {
              alert('에러');
            }
          })
          .catch((Error) => alert(Error));
      } catch (error) {
        alert('에러');
      }
    });

    const petType = ref('pet');
    const selectedMenu = ref('pet');
    const selectedpetType = ref('');

    const setpetType = (type) => {
      if (petType.value === 'pet') {
        selectedpetType.value = type;
      }
    };

    return {
      petType,
      router,
      selectedMenu,
      selectedpetType,
      setpetType,
    };
  },
};
</script>

<style>
.pet-images-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.pet-image {
  width: 100%;
  height: 90%;
  text-align: center;
  border-radius: 5px;
  background-color: #dfdfdf;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50vh;
  background-color: #ffffff;
  position: relative;
  font-family: 'IBM Plex Sans KR', sans-serif;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}

.menu-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 9vh;
  background-color: #ffffff;
  /* Add Rounded Effect at the Top */
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  /* Add Border Only at the Top */
  border-top: 7px solid #cbcbcb;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 2px solid #cbcbcb;
}

.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21%;
  height: 90%;
  margin: 0 10px;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #ffffff;
  border-radius: 25px;
}

.menu:hover {
  background-color: #ffffff;
}

.sub-box {
  width: 100%;
  height: 100%;
  padding: 29px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-sizing: border-box;
  overflow-y: auto;
  margin-top: 10vh;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96vh;
  height: 5vh;
  overflow: hidden;
  margin: 0 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #dfdfdf;
  border-radius: 100px;
}

.button:hover {
  transform: scale(1.1);
}

.button img {
  width: 3vh;
  height: 50%;
}

.bottom-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
}

.border-box {
  width: 100%;
}

.button-container button {
  margin-top: -1vh;
  width: 13vh;
  height: 3vh;
  background-color: #f5f5f5;
  border-radius: 13px;
  margin-right: 10px;
  cursor: pointer;
}

.transparent-circle {
  width: 60%;
  padding-top: 60%;
  border-radius: 50%;
  background-color: transparent;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.complete-button {
  position: absolute;
  width: 12vh;
  height: 7vh;
  right: 3vh;
  top: 5%;
  border-radius: 12%;
  background-color: #ffffff;
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>