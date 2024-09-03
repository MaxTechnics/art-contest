<template>
	<div class="wavePage" style="flex: 1 1 auto">
		<div class="textDiv" style="flex: 0 1 auto">
			<h4 class="waveTitle">Voting has not started yet</h4>
			<div class="waveBody">
				<p class="waveLine">Please come back once voting starts.</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wavePage {
	height: 100vh;
	width: 100%;
	margin: 0;
	// background-image: url("@/assets/WavePage/wave.svg");
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-ms-flex-wrap: nowrap;
	flex-wrap: nowrap;
	overflow: hidden;
	min-height: 100vh;
	background-size: cover;
	color: white;
	background-color: #182538;
	background-position: 50% 0;
	font-family: Arial, Helvetica, sans-serif;
	line-height: 1;
	position: absolute;
	z-index: 9999;
}

.textDiv {
	width: 440px;
	margin-bottom: 20px;
}

.waveTitle {
	margin: 0;
	font-size: 24px;
	line-height: 8px;
	margin-bottom: 24px;
	font-weight: 600;
	color: white;
	text-align: center;
}

.waveBody {
	font-size: 16px;
	color: white;
	text-align: center;
}

.waveLine {
	margin: 14px 0;
}
</style>
