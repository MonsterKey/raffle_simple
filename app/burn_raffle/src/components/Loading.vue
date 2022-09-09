<template>
	   <div class="loading"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.loading {
    border: 4px solid rgba(1,1,1,0.1);
    border-radius: 50%;
    border-left-color: #406184;
    animation: loading 1s infinite linear;
}

@keyframes loading {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
}
</style>
