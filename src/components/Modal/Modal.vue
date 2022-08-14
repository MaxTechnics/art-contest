<template>
	<!-- <Transition name="modal"> -->
		<div v-if="show" class="modal" @keyup.esc="handleEscape" tabindex="0">
			<div class="modal-mask" @click="handleOutsideClick"></div>
			<div class="modal-container visible">
				<div class="pop-up__title">
					<span>{{ modalTitle }}</span>
					<svg v-if="!hideXButton" @click="$emit('closeModal')" class="close feather feather-x-circle" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10" />
						<path d="M15 9l-6 6M9 9l6 6" />
					</svg>
				</div>
				<div class="pop-up__subtitle"><slot name="modal-subtitle"></slot></div>
				<slot name="modal-body"></slot>
				<div class="content-button-wrapper">
					<slot name="buttons"></slot>
				</div>
			</div>
		</div>
	<!-- </Transition> -->
</template>

<script>
export default {
	name: 'Modal',
	props: {
		show: Boolean,
		hideXButton: Boolean,
		allowEscapeClose: {
			type: Boolean,
			default: true
		},
		allowOutsideClick: {
			type: Boolean,
			default: true
		},
		modalTitle: {
			type: String,
			required: true
		}
	},
	methods: {
		handleEscape() {
			if (this.allowEscapeClose) this.$emit('closeModal');
		},
		handleOutsideClick() {
			if (this.allowOutsideClick) this.$emit('closeModal');
		}
	}
};
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transition: opacity 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
}

.modal-container {
	position: absolute;
	padding: 30px 40px;

	border: 1px solid rgba(255, 255, 255, 0.5);
	border-right: 1px solid rgba(255, 255, 255, 0.2);
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);

	overflow-y: auto;
	background-color: transparent;
	color: #dcddde;
	// @include themed() {
	// font-family: t($font-whitney);
	// }
	width: 500px;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	white-space: normal;
}

@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
	.modal-container {
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}
}

@media screen and (max-width: 570px) {
	.modal-container {
		width: 100%;
	}
}

.pop-up__title {
	padding-bottom: 20px;
	border-bottom: 1px solid #b9bbbe;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.pop-up__subtitle {
	white-space: normal;
	margin: 20px 0;
	font-size: 14px;
	font-weight: 400;
	line-height: 1.8em;
}

// .pop-up__subtitle a {
// 	@include themed() {
// 		color: t($text-link);
// 	}
// }

.content-button-wrapper .content-button.status-button.open.close {
	width: auto;
}

.close {
	margin-right: 0;
	width: 24px;
	cursor: pointer;
}

.content-button-wrapper {
	margin-top: auto;
	margin-left: auto;
}

.content-button-wrapper .open {
	margin-right: 8px;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}

.modal-leave-to .modal-container {
	-webkit-transform: scale(0.9);
	transform: scale(0.9);
}
</style>
