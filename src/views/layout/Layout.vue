<template>
  <div>
    <div>
      <hearder></hearder>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Hearder from '../../components/layout/Hearder.vue'
import Footer from '../../components/layout/Footer.vue'
export default {
  components:{
    Hearder,
    Footer
  }
}
</script>

<style lang="scss">
  
</style>