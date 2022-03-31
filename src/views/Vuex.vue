<template>
  <div>
    {{ $store.state.count }}
    {{ userInto }}
    <button @click="num">点我+1</button>
    <button @click="name">name</button>
  </div>
</template>

<script>
import { toRefs } from "vue";
import { useStore } from "vuex"
export default {
  name: 'Vuex',
  setup() {
    //** 在store中，只有state是响应式的
    const store = useStore()
    console.log(store);

    const num = () => {
      store.commit('JIA')
    }

    const name = () => {
      store.commit('NAME','古')
    }

    return {
      ...toRefs(store.state),
      num,
      name
    }
  }
}
</script>

<style>
</style>