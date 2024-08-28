<template>
	<div class="shineContainer buttonShine">
		<div class="shine" style="flex: 1 1 auto;">
			<div class="shineInner"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Shine'
};
</script>

<style lang="scss" scoped>
.shineContainer {
	position: absolute;
	top: -50%;
	left: -50%;
	bottom: 0;
	right: 0;
}

.buttonShine {
	-webkit-animation-delay: 0.75s;
	animation-delay: 0.75s;
	-webkit-animation-duration: 2s;
	animation-duration: 2s;
	-webkit-animation-name: Shine-animation;
	animation-name: Shine-animation;
	-webkit-animation-iteration-count: infinite;
	animation-iteration-count: infinite;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	color: hsla(0, 0%, 100%, 0.1);
}

.shine {
	background-color: currentColor;
	height: 300%;
	position: relative;
	top: -100%;
	-webkit-transform: rotate(30deg);
	transform: rotate(30deg);
	width: 56px;

	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-webkit-box-align: center;
	justify-content: center;
	-ms-flex-align: center;
	align-items: center;
	-ms-flex-direction: row;
	flex-direction: row;
	-ms-flex-wrap: nowrap;
	flex-wrap: nowrap;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
}

.shineInner {
	background-color: currentColor;
	height: 100%;
	width: 16px;
}

@-webkit-keyframes Shine-animation {
	0% {
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}

	to {
		-webkit-transform: translate3d(200%, 0, 0);
		transform: translate3d(200%, 0, 0);
	}
}

@keyframes Shine-animation {
	0% {
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}

	to {
		-webkit-transform: translate3d(200%, 0, 0);
		transform: translate3d(200%, 0, 0);
	}
}
</style>
