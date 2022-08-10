<template>
 	<RouterView />
</template>

<script>
export default {
	name: 'App'
}
</script>

<style>
body {
	margin: 0%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: scroll;
	cursor: url(@/assets/cursor.png), auto;
}

.sheesh {
	transform-origin: 0 0;
}
</style>
