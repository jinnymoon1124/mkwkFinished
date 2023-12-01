/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
webviewBridge
  .registerCallbackFunc(webviewBridgelistener, 'jtpltMQCq8Y5lVQHepuIAQ==')
  .then((result) => {
    console.log('MKTeamplCore.ts', result);
  });
const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
async function webviewBridgelistener(data) {
  if (data && data.type != 'webpackWarnings') {
    console.log('native로부터 도착!!');
    console.log(data);
    if (data.type === 'GPSInfo') {
      let stepCounts = data.data;
      if (isJsonString(stepCounts)) {
        stepCounts = JSON.parse(stepCounts);
      }
      if (GISCallbackFunc) {
        GISCallbackFunc(stepCounts);
      }
      console.log('steps', stepCounts);
    }
  }
}

let GISCallbackFunc = null;
export function setGISCallbackFunc(func) {
  GISCallbackFunc = func;
}

export default {
  install(Vue) {
    webviewBridgelistener;
  },
};