<template>
    <img class="garde-spin" :src="gard" />
</template>

<script setup>
import gard from '@/assets/gardeHappy.png';
</script>

<style lang="scss" scoped>
.garde-spin {
	height: 60px;
	width: 60px;
	border-radius: 50%;
	animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
