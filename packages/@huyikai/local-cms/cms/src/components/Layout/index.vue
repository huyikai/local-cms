<template>
  <a-layout style="height: 100vh">
    <SideBar></SideBar>
    <a-layout>
      <a-layout-content
        class="content"
        :style="{
          background: '#fff',
          padding: '10px 30px 30px 30px',
          margin: 0,
          height: '100vh',
          overflowY: 'auto'
        }"
      >
        <RouterView></RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
