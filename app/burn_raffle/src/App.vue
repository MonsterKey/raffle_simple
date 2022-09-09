<template>
  <div id="app">
    <router-view v-slot="{ Component }">
        <component :is="Component"/>
    </router-view>
  </div>
</template>

<script>
import {toRefs} from 'vue'
import {useRouter} from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    return {
      ...toRefs()
    }
  }
}
</script>

<style>
html,body{
  margin:0;
  background:#ffffff;
  /*font-family:grizzly;*/
  /*overflow:auto;*/
}
</style>
