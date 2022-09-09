<template>
	<div class="modal-backdrop" v-if="show">
	  <div class="modal" >
		<Loading style="width: 40px; height: 40px;" />
	  </div>
	</div>
</template>

<script>
import { reactive, toRefs, defineComponent } from "vue";
import Loading from '@/components/Loading.vue';

export default {
  components: { Loading },
  props: {
	show: {
		type: Boolean,
		default: false,
	},
  },
  setup(props, ctx) {
	const data = reactive({
		show: props.show
	});

	const dataRef = toRefs(data);
	return {
	  ...dataRef
	}
  }
}
</script>

<style scoped>
	.modal {
	    background-color: #ecdca9;
	    box-shadow: 2px 2px 20px 1px;
	    overflow-x:auto;
	    display: flex;
	    flex-direction: column;
		align-items: center;
		justify-content: center;
	    border-radius: 16px;
	    width: 100px;
		height: 100px;
	}
</style>
