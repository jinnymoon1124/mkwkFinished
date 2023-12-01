import { createWebHistory, createRouter } from 'vue-router';
import MainPage from './views/MainPage.vue';
import StartPageC from './views/StartPageC.vue';
import StartPageP from './views/StartPageP.vue';
// 9.26 마이 페이지 삭제
import BadgePage from './views/BadgePage.vue';
import NewWalkRecord from './views/NewWalkRecord.vue';
import Alarm from './views/Alarm.vue';
import KakaoMap from './views/KakaoMap.vue';
import WalkDayReport from './views/WalkDayReport.vue';
import FriendAdd from './views/FriendAdd.vue';
// 9.26 friendlist 삭제
// 9.26 가족 리스트 주석 처리
// import familylist from "./components/familylist.vue"

import Ranking from './views/rank/Ranking.vue';
// 9.26 가족 랭킹 주석 처리
// import FamilyRank from './components/rank/FamilyRank.vue'
import FriendRank from './views/rank/FriendRank.vue';
// 9.26 펫 랭킹 주석 처리
// import PetRank from './components/rank/PetRank.vue'
import MkWalkTest from '../MkWalkTest.vue';

const routes = [
  {
    path: '/test',
    name: 'test',
    component: MkWalkTest,
    meta: { showMenu: true },
  },
  {
    path: '/mainpage',
    name: 'mainpage',
    component: MainPage,
  },
  {
    path: '/',
    name: 'startpagec',
    component: StartPageC,
  },
  {
    path: '/startpage',
    name: 'startpagep',
    component: StartPageP,
  },
  // 9.26 마이 페이지 삭제
  {
    path: '/badgepage',
    name: 'badgepage',
    component: BadgePage,
  },
  {
    path: '/newwalkrecord',
    name: 'newwalkrecord',
    component: NewWalkRecord,
  },
  {
    path: '/alarm',
    name: 'alarm',
    component: Alarm,
  },
  {
    path: '/kakaomap',
    component: KakaoMap,
  },
  {
    path: '/walkdayreport',
    name: 'WalkDayReport',
    component: WalkDayReport,
    props: (route) => ({ timeData: route.params.timeData }),
  },
  // 9.26 friendlist 삭제
  {
    path: '/friendadd',
    name: 'friendadd',
    component: FriendAdd,
  },
  // 9.26 가족 랭킹 주석 처리
  // {
  //     path: '/rank/family',
  //     name: 'familyrankpage',
  //     component: FamilyRank,
  // },
  {
    path: '/friendRank',
    name: 'frinedrankpage',
    component: FriendRank,
  },
  // 9.26 펫 랭킹 주석 처리
  // {
  //     path: '/rank/pet',
  //     name: 'petrankpage',
  //     component: PetRank,
  // },
  {
    path: '/ranking',
    name: 'ranking',
    component: Ranking,
  },
  // 9.26 가족 리스트 주석 처리
  // {
  //     path: "/family",
  //     name: "familylist",
  //     component: familylist,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
