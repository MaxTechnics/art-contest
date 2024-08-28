<template>
	<button class="funkyButton" :class="{ 'right-margin' : rightMargin }" :disabled="isDisabled">
		<slot></slot>
		<Shine v-if="hasShine && !isDisabled" />
	</button>
</template>

<script>
import Shine from './Shine.vue';

export default {
	name: 'Button',
	props: {
		hasShine: Boolean,
		isDisabled: Boolean,
		rightMargin: Boolean
	},
	components: {
		Shine
	}
};
</script>

<style lang="scss" scoped>
$grey: #747f8d;
$green: #43b581;

.funkyButton {
	display: inline-block;
	position: relative;
	/* vertical-align: top; */
	margin: 0;
	border: 0;
	outline: 0;
	padding: 0px 15px;
	font-size: 16px;
	font-weight: 400;
	line-height: 40px;
	height: 40px;
	text-align: center;
	white-space: nowrap;
	background-color: $green;
	color: #fff;
	-ms-touch-action: manipulation;
	touch-action: manipulation;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	border-radius: 3px;
	/* width: 100%; */
	width: auto;

	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;

	overflow: hidden;
}

.funkyButton:focus,
.funkyButton:hover,
.funkyButton:active {
	outline: 0;
}

.funkyButton:hover {
	background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.funkyButton:active {
	background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
}

/* Material icons */
.material-icons {
	display: inline-block;
	vertical-align: top;
	line-height: inherit;
	font-size: inherit;
}

button {
	-webkit-appearance: button;
	text-transform: none;
	font-family: inherit;
	line-height: inherit;
}

button:not(:disabled) {
	cursor: pointer;
}

button:disabled {
	background-color: $grey !important;
	cursor: not-allowed;
}

.right-margin {
	margin-right: 0.625em;
}
</style>
