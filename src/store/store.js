import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/libs/firebase";
import { collection, getDocs } from "firebase/firestore";


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    allCourse: [],
    userName:"user1"
  },
  mutations: {
    async getCourse(state) {
      const querySnapshot = await getDocs(collection(db, "course"));
      querySnapshot.forEach((doc) => {
        state.allCourse.push({courseId:doc.id,courseName:doc.data().courseName})
      });
    },
  },
});

export default store;
