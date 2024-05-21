<template>
  <div id="app">
    <!--<LoadingPage v-if="showSplashScreen && !hideSplashScreen" />-->
    <router-view></router-view>
  </div>
</template>

<script>

//import LoadingPage from './components/LoadingPage.vue';
export default {
  components: {
   // LoadingPage,
  },
  data() {
    return {
      showSplashScreen: true,
      hideSplashScreen: false,
    };
  },
  mounted() {
    // Simulez une attente de quelques secondes avant de masquer le splash screen
    setTimeout(() => {
      this.hideSplashScreen  = true;
    }, 3000);
  },
};
</script>
<style>
body{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.fa-chevron-left{
  color: #06283D;
  font-size: 20px;
}
</style>