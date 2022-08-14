<template>
    <div class="spinnerContainer">
        <span class="spinner">
            <span class="inner pulsingEllipsis">
                <span class="pulsingEllipsisItem spinnerItem"></span>
                <span class="pulsingEllipsisItem spinnerItem"></span>
                <span class="pulsingEllipsisItem spinnerItem"></span>
            </span>
        </span>
    </div>
</template>

<script>
export default {
	name: 'Spinner'
};
</script>

<style lang="scss" scoped>
// .spinnerContainer {
// position: relative;
// }

.spinner {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin: 0;
}

.inner {
	position: relative;
	display: inline-block;
	width: 32px;
	height: 32px;
	contain: paint;
}

.pulsingEllipsis {
	height: auto;
	width: 28px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	position: relative;
}

.pulsingEllipsisItem {
	-webkit-animation: spinner-pulsing-ellipsis 1.4s ease-in-out infinite;
	animation: spinner-pulsing-ellipsis 1.4s ease-in-out infinite;
	width: 6px;
	height: 6px;
	margin-right: 2px;
	background-color: #f8f9f9;
	border-radius: 3px;
	display: inline-block;
	opacity: 0.3;
}

.pulsingEllipsisItem:nth-of-type(2) {
	-webkit-animation-delay: 0.2s;
	animation-delay: 0.2s;
}

.pulsingEllipsisItem:nth-of-type(3) {
	-webkit-animation-delay: 0.4s;
	animation-delay: 0.4s;
}

.spinnerItem {
	background-color: #fff;
}

@-webkit-keyframes spinner-pulsing-ellipsis {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1);
		opacity: 1;
	}
	50% {
		-webkit-transform: scale(0.8);
		transform: scale(0.8);
		opacity: 0.3;
	}
	to {
		-webkit-transform: scale(1);
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes spinner-pulsing-ellipsis {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1);
		opacity: 1;
	}
	50% {
		-webkit-transform: scale(0.8);
		transform: scale(0.8);
		opacity: 0.3;
	}
	to {
		-webkit-transform: scale(1);
		transform: scale(1);
		opacity: 1;
	}
}
</style>
