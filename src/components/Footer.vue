<template>
  <div class="footer">
    <div class="left">小宝</div>
    <div class="right">
      <a target="_blank" href="https://github.com/">小宝 git hub</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  width: calc(100% - 200px);
  position: fixed;
  bottom: 0;
  right: 0;
  height: 50px;
  border-top: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  background: #fff;
  z-index: 9999;
}
</style>
