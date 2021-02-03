<template>
    <div id="phaser-example"></div>
    <img :src="background"/>
</template>
<script>
import background from "@/assets/images/background.png"
import createMap from '@/phaser/index';
export default {
  name: 'Map',
  emits: ["link"],
  setup(props, { emit }){
    createMap(emit);
    return {
      background
    }
  }
}
</script>
