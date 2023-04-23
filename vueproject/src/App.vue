
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data() {
    return {

    }
  },
  // 页面中调用的方法，或者程序实现逻辑中调用的方法
  methods: {

  },
  // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
  mounted() {

  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  color: #333;
}
</style>
