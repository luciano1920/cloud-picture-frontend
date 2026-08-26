<template>
  <div id="home-page">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search placeholder="从海量图库中搜索" enter-button="搜索" size="large" />
    </div>

    <!-- 轮播图 -->
    <a-carousel :autoplay="{ dotDuration: true }" :autoplay-speed="5000" class="home-carousel">
      <div>
        <img src="../../assets/images/1.jpg" alt="1" class="bg-img" />
      </div>
      <div>
        <img src="../../assets/images/2.jpg" alt="1" class="bg-img" />
      </div>
      <div>
        <img src="../../assets/images/3.jpg" alt="1" class="bg-img" />
      </div>
      <div>
        <img src="../../assets/images/4.jpg" alt="1" class="bg-img" />
      </div>
    </a-carousel>

    <div class="panel-container">dahsjdkhajskdha</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
:deep(.home-carousel) {
  --ant-carousel-dot-offset: 144px;
  --ant-carousel-dot-height: 5px;
  --ant-carousel-dot-width: 28px;
  --ant-carousel-dot-active-width: 44px;
  --ant-carousel-dot-gap: 8px;
}
.bg-img {
  width: 100%;
  height: 620px;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: 680px;
}

.panel-container {
  height: 1000px;
  background-color: #fff;
  z-index: 999;
  position: absolute;
  top: 500px;
  border-radius: 64px;
  width: 100%;
}
</style>
