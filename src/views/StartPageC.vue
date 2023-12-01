<template>
  <div class="extra-space">
    <img src="../assets/배경2.png" alt="Extra Image" style="height: 100vh; width: 100%" />
    <div class="complete-button" @click="captureAndSaveImage">완료</div>
    <div class="transparent-circle" ref="transparentCircle">
      <!-- Selected Clothes Type -->
      <img
        v-if="selectedClothesType"
        :src="require(`../assets/icon/${selectedClothesType}.png`)"
        style="
          width: 80%;
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        "
      />

      <!-- Selected Hair Type -->
      <img
        v-if="selectedHairType"
        :src="require(`../assets/icon/${selectedHairType}.png`)"
        style="
          width: 75%;
          position: absolute;
          top: 32.93%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        "
      />

      <!-- Selected Face Type -->
      <img
        v-if="selectedFaceType"
        :src="require(`../assets/icon/${selectedFaceType}.png`)"
        style="
          width: 83%;
          position: absolute;
          top: 33%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        "
      />

      <!-- Selected Style Type -->
      <img
        v-if="selectedStyleType"
        :src="require(`../assets/icon/${selectedStyleType}.png`)"
        style="
          width: 75%;
          position: absolute;
          top: 32.8%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        "
      />
    </div>
    <div class="startpage">
      <div class="bottom-box">
        <div class="border-box" :class="{ 'out-box': characterType === 'out' }">
          <!-- border box content here -->

          <div class="menu-box">
            <div class="menu-bar">
              <div class="menu" @click="selectedMenu = 'hair'">헤어</div>
              <div class="menu" @click="selectedMenu = 'face'">얼굴</div>
              <div class="menu" @click="selectedMenu = 'clothes'">옷</div>
              <div class="menu" @click="selectedMenu = 'style'">스타일</div>
            </div>

            <div
              class="sub-box hair-sub-box"
              v-if="selectedMenu === 'hair' && characterType === 'people'"
            >
              <div class="hair-images-container">
                <div class="hair-image" @click="setHairType('Hair33')">
                  <img src="@/assets/icon/Hair33.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair01')">
                  <img src="@/assets/icon/Hair01.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair02')">
                  <img src="@/assets/icon/Hair02.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair04')">
                  <img src="@/assets/icon/Hair04.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair05')">
                  <img src="@/assets/icon/Hair05.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair06')">
                  <img src="@/assets/icon/Hair06.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair07')">
                  <img src="@/assets/icon/Hair07.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair08')">
                  <img src="@/assets/icon/Hair08.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair20')">
                  <img src="@/assets/icon/Hair20.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair19')">
                  <img src="@/assets/icon/Hair19.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair17')">
                  <img src="@/assets/icon/Hair17.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair11')">
                  <img src="@/assets/icon/Hair11.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair19')">
                  <img src="@/assets/icon/Hair18.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair21')">
                  <img src="@/assets/icon/Hair21.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair22')">
                  <img src="@/assets/icon/Hair22.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair23')">
                  <img src="@/assets/icon/Hair23.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair24')">
                  <img src="@/assets/icon/Hair24.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair27')">
                  <img src="@/assets/icon/Hair27.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair28')">
                  <img src="@/assets/icon/Hair28.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair30')">
                  <img src="@/assets/icon/Hair30.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair31')">
                  <img src="@/assets/icon/Hair31.png" />
                </div>
                <div class="hair-image" @click="setHairType('Hair32')">
                  <img src="@/assets/icon/Hair32.png" />
                </div>
              </div>
            </div>

            <div class="sub-box" v-if="selectedMenu === 'face' && characterType === 'people'">
              <div class="face-images-container">
                <div class="face-image" @click="setFaceType('Face02')">
                  <img src="../assets/icon/Face02.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face03')">
                  <img src="../assets/icon/Face03.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face04')">
                  <img src="../assets/icon/Face04.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face05')">
                  <img src="../assets/icon/Face05.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face06')">
                  <img src="../assets/icon/Face06.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face07')">
                  <img src="../assets/icon/Face07.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face08')">
                  <img src="../assets/icon/Face08.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face09')">
                  <img src="../assets/icon/Face09.png" />
                </div>
                <div class="face-image" @click="setFaceType('Face10')">
                  <img src="../assets/icon/Face10.png" />
                </div>
              </div>
            </div>

            <div class="sub-box" v-if="selectedMenu === 'style' && characterType === 'people'">
              <div class="style-images-container">
                <div class="style-image" @click="setStyleType('Style01')">
                  <img src="../assets/icon/Style01.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style02')">
                  <img src="../assets/icon/Style02.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style03')">
                  <img src="../assets/icon/Style03.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style04')">
                  <img src="../assets/icon/Style04.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style05')">
                  <img src="../assets/icon/Style05.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style06')">
                  <img src="../assets/icon/Style06.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style07')">
                  <img src="../assets/icon/Style07.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style08')">
                  <img src="../assets/icon/Style08.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style09')">
                  <img src="../assets/icon/Style01.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style10')">
                  <img src="../assets/icon/Style10.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style11')">
                  <img src="../assets/icon/Style11.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style12')">
                  <img src="../assets/icon/Style12.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style13')">
                  <img src="../assets/icon/Style13.png" />
                </div>
                <div class="style-image" @click="setStyleType('Style14')">
                  <img src="../assets/icon/Style14.png" />
                </div>
              </div>
            </div>

            <div class="sub-box" v-if="selectedMenu === 'clothes' && characterType === 'people'">
              <div class="clothes-images-container">
                <div class="clothes-image" @click="setClothesType('Outfit01')">
                  <img src="../assets/icon/Outfit01.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit02')">
                  <img src="../assets/icon/Outfit02.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit04')">
                  <img src="../assets/icon/Outfit04.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit21')">
                  <img src="../assets/icon/Outfit21.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit05')">
                  <img src="../assets/icon/Outfit05.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit06')">
                  <img src="../assets/icon/Outfit06.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit07')">
                  <img src="../assets/icon/Outfit07.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit08')">
                  <img src="../assets/icon/Outfit08.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit10')">
                  <img src="../assets/icon/Outfit10.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit11')">
                  <img src="../assets/icon/Outfit11.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit12')">
                  <img src="../assets/icon/Outfit12.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit13')">
                  <img src="../assets/icon/Outfit13.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit14')">
                  <img src="../assets/icon/Outfit14.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit18')">
                  <img src="../assets/icon/Outfit18.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit19')">
                  <img src="../assets/icon/Outfit19.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit23')">
                  <img src="../assets/icon/Outfit23.png" />
                </div>
                <div class="clothes-image" @click="setClothesType('Outfit24')">
                  <img src="../assets/icon/Outfit24.png" />
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
  methods: {
    async captureAndSaveImage() {
      if (!this.selectedHairType || !this.selectedFaceType || !this.selectedClothesType) {
        Swal.fire({
          icon: 'warning',
          title: '헤어, 얼굴, 옷을 선택해주세요.',
          showConfirmButton: false,
          timer: 2000,
        });
        return;
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
      try {
        const response = await axios.post('http://localhost:8080/api/save-member-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          this.$router.push({ name: 'startpagep' });
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
                  router.push({ name: 'mainpage' });
                } else {
                  router.push({ name: 'startpagep' });
                }
              }
            }
          })
          .catch((Error) => alert(Error));
      } catch (error) {
        alert('에러');
      }
    });
    const characterType = ref('people');
    const selectedMenu = ref('');
    const selectedHairType = ref('');
    const selectedFaceType = ref('');
    const selectedClothesType = ref('');
    const selectedStyleType = ref('');

    const setFaceType = (type) => {
      if (characterType.value === 'people') {
        selectedFaceType.value = type;
      }
    };

    const setHairType = (type) => {
      if (characterType.value === 'people') {
        selectedHairType.value = type;
      }
    };

    const setClothesType = (type) => {
      if (characterType.value === 'people') {
        selectedClothesType.value = type;
      }
    };

    const setStyleType = (type) => {
      if (characterType.value === 'people') {
        selectedStyleType.value = type;
      }
    };

    return {
      characterType,
      router,
      selectedMenu,
      selectedHairType,
      selectedFaceType,
      selectedClothesType,
      selectedStyleType,
      setFaceType,
      setHairType,
      setClothesType,
      setStyleType,
    };
  },
};
</script>

<style>
.hair-images-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.hair-image {
  width: 100%;
  height: 90%;
  text-align: center;
  border-radius: 5px;
  background-color: #dfdfdf;
}

.hair-image img {
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

.face-images-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.face-image {
  width: 100%;
  height: 90%;
  text-align: center;
  border-radius: 5px;
  background-color: #dfdfdf;
}

.face-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clothes-images-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.clothes-image {
  width: 100%;
  height: 90%;
  text-align: center;
  border-radius: 5px;
  background-color: #dfdfdf;
}

.clothes-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-images-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.style-image {
  width: 100%;
  height: 90%;
  text-align: center;
  border-radius: 5px;
  background-color: #dfdfdf;
}

.style-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.complete-button:hover {
  background-color: #f1f1f1;
}
</style>