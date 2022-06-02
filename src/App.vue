<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from "./store/store";
export default {
  data: () => ({}),
  created() {
    store.commit("getCourse");
  },
};
</script>