<script setup>

defineProps({
  id: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div>
    Home {{ id }}
  </div>
</template>

<style scoped lang="scss">

</style>