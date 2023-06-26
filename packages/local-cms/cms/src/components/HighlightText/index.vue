<script setup lang="ts">
const props = defineProps<{
  text: string;
  highlight: string;
}>();
const parts = computed(() => {
  const index = props.text.toLowerCase().indexOf(props.highlight.toLowerCase());
  if (index === -1) {
    return [{ text: props.text, highlight: false, key: v4() }];
  }
  return [
    { text: props.text.substring(0, index), highlight: false, key: v4() },
    {
      text: props.text.substring(index, index + props.highlight.length),
      highlight: true,
      key: v4()
    },
    {
      text: props.text.substring(index + props.highlight.length),
      highlight: false,
      key: v4()
    }
  ];
});
</script>
<template>
  <span>
    <template
      v-for="part in parts"
      :key="part.key"
    >
      <span
        v-if="part.highlight"
        style="color: #f50; font-weight: bold; font-size: 24px"
        >{{ part.text }}</span
      >
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>
