<template>
    <div class="container">
        <div class="loading-shadow active">
            <div class="loading-box">
                <!-- <div class="loading-items"> -->
                    <!-- <div class="loading-item" v-for="i in 10" :key="i"></div> -->
                <!-- </div> -->
				<NewSpinner />
                <label><span v-if="$store.state.user_info?.username">Hihi {{ $store.state.user_info.username }}!<br></span>{{ message }}</label>
            </div>
        </div>
    </div>
</template>

<script>
import NewSpinner from '../components/NewSpinner.vue';

export default {
	components: {
		NewSpinner
	},
	name: 'Loading',
	props: {
		message: String
	}
};
</script>

<style lang="scss" scoped>
.container {
	margin: 0;
	height: 100vh;
	font-family: helvetica;

	// background-color: black;
	background-color: #182538;
	// animation: colorize 2s ease-out 1s;
	// animation-fill-mode: forwards;
}

// @keyframes colorize {
// 	from {
// 		background-color: black;
// 	}
// 	to {
// 		background-color: #182538;
// 	}
// }

.loading-box {
	height: 100vh;
	width: 100vw;
	// transform: translateY(100px);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	// width: 300px;
	// align-items: center;
	label {
		color: white;
		width: 100%;
		text-align: center;
		margin-top: 15px;
	}
	.loading-items {
		margin-bottom: 40px;
		position: relative;
		width: 0px;
		height: 0px;
		transition: all 0s ease;
		.loading-item {
			position: absolute;
			top: calc(50% - 30px);
			left: calc(50% - 30px);
			height: 60px;
			width: 60px;
			&::after {
				position: absolute;
				content: "";
				height: 45px;
				width: 45px;
				border: 1px solid white;
				border-top: 1px solid transparent;
				border-radius: 50%;
				animation: spin-1 3s infinite linear;
			}
			&:nth-child(even) {
				&::after {
					transform: rotateY(180deg);
				}
			}
		}
	}
}

.loading-box {
	.loading-items {
		@for $i from 1 through 18 {
			.loading-item:nth-child(#{$i}) {
				transform: rotateZ(36deg * $i);
				&::after {
					animation-delay: 0.1s * $i;
				}
			}
		}
	}
}

@keyframes spin-1 {
	0% {
		transform: rotateZ(0deg);
	}
	100% {
		transform: rotateZ(360deg);
	}
} ;
</style>
