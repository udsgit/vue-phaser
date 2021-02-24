<template>
    <div id="phaser-example"></div>
</template>
<script>
import createMap from '@/phaser/index';
export default {
  name: 'Map',
  emits: ["link"],
  setup(props, { emit }){
    createMap(emit);
  }
}
</script>
