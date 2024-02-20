<template>
  <div>
    <div class="no">404 页面未找到！</div>
    <div style="text-align: center">
      <router-link to="/" style="font-size: 30px; color: #4cbcf4;">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notfound',
}
</script>

<style lang="less" scoped>
.no {
  font-size: 40px;
  text-align: center;
  margin-top: 10%;
  white-space: nowrap;
}

/* 添加移动端样式适配 */
@media screen and (max-width: 768px) {
  .no {
    font-size: 20px;
    margin-top: 5%;
  }

  /* 如果需要调整返回首页链接的样式，也可以在这里添加 */
}
</style>
