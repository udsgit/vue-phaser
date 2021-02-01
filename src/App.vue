<template>
  <Map
      @link="router.push($event)"/>
  <router-view/>
</template>

<script>
import Map from '@/components/Map';
import { useRouter } from 'vue-router';
export default {
  name: 'App',
  components: {
    Map
  },
  setup(){
    const router = useRouter();
    return {
      router
    }
  }
}
</script>
<style>
body{
  margin: 0px;
  background-color: #363D72;
}
</style>

