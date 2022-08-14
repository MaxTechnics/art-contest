<template>
    <div> 
		<!-- <Confetti /> -->
        <FunkyHeader style="margin-top: -5vh" />
    	<div class="container space">
    		<div class="content">
    			<div class="grid" ref="grid">
                    <ArtItem v-for="item in submissions" :key="item" :title="item.title" :description="item.description" :author="item.author" :imageURL="item.asset" :author_id="item.author_id" />
    			</div>
    			<!-- /grid -->
    			<div class="preview">
    				<!-- <button class="action action--close"><i class="fa fa-times"></i><span class="text-hidden">Close</span></button> -->
    				<button class="action action--close">
    					<i>
    						<svg class="action-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
    					</i>
    					<span class="text-hidden">Close</span>
    				</button>
    				<div class="description description--preview">
						<div class="preview-container" ref="preview_container"></div>
						<Button v-if="$store.state.user_status?.can_vote" @click="open_modal" >I CHOOSE YOU!!!!</Button>
					</div>
    			</div>
    			<!-- /preview -->
    		</div>
    	</div>

		<Modal @closeModal="close_modal" modalTitle="You are about to vote" :show="show_vote_modal" :allowEscapeClose="!is_voting" :allowOutsideClick="!is_voting" :hideXButton="is_voting">
			<template #modal-subtitle>
				You chose to vote for {{ preview_author }}'s submission. Are you absolutely sure?
			</template>

			<template #modal-body>
				<img class="vote-preview" :src="preview_img" />
				<ModalCheckbox v-model="is_confirmed" label="I confirm i want to vote for this one" uuid="isConfirmed" />
			</template>

            <template #buttons>
				<Button v-if="!is_voting" @click="close_modal" class="cancel-btn" :rightMargin="true">Cancel</Button>
				<Button @click="post_vote" :isDisabled="!is_confirmed" class="confirm-btn">
                    <span :class="{ 'hide': is_voting }">Vote</span>
                    <Spinner v-if="is_voting" />
                </Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import ArtItem from '../components/ArtItem.vue';
// import Confetti from '../components/Confetti.vue';
import FunkyHeader from '../components/FunkyHeader.vue';
import Modal from '../components/Modal/Modal.vue';
import ModalCheckbox from '../components/Modal/ModalCheckbox.vue';
import Spinner from '../components/Spinner.vue';
import GridFx from '@/assets/ArtList/gridfx.js';
import submissions from '@/assets/submissions.js';

import Button from '../components/Button.vue';

let to_shou_fle = submissions

export default {
	name: 'ArtList',
	components: {
		ArtItem,
		Button,
		// Confetti,
		FunkyHeader,
		Modal,
		ModalCheckbox,
		Spinner
	},
	data: (vm) => ({
		submissions: vm.shuffle(submissions),
		show_vote_modal: false,
		is_voting: false,
		is_confirmed: false,
		preview_author: null,
		preview_img: null,
		preview_id: null
	}),
	methods: {
		shuffle(array) {
			let currentIndex = array.length, randomIndex;

			// While there remain elements to shuffle.
			while (currentIndex != 0) {

				// Pick a remaining element.
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex], array[currentIndex]];
			}

			return array;
		},
		open_modal() {
			const data = this.$refs.preview_container.getElementsByClassName('non-confusing-name')[0];
			this.preview_author = data.getAttribute('data-author');
			this.preview_img = data.getAttribute('data-image');
			this.preview_id = data.getAttribute('data-authorid');
			this.show_vote_modal = true
		},
		close_modal() {
			this.show_vote_modal = false;
			this.preview_author = null;
			this.preview_img = null;
			this.preview_id = null;
			this.is_voting = false;
			this.is_confirmed = false;

		},
		post_vote() {
			this.is_voting = true;
		}
	},
	mounted() {
		// import('@/assets/ArtList/imagesloaded.pkgd.min.js');
		// import('@/assets/ArtList/modernizr-custom.js');
		// import('@/assets/ArtList/main.js');

		var
			// support = { transitions: Modernizr.csstransitions },
			// transition end event name
			// transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
			// transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
			// transEndEventName = 'transition',
			onEndTransition = function(el, callback) {
				let onEndCallbackFn = function(ev) {
					// if (support.transitions) {
					if (ev.target != this) return;
					this.removeEventListener('transition', onEndCallbackFn);
					// }
					if (callback && typeof callback === 'function') { callback.call(this); }
				};
				// if (support.transitions) {
				el.addEventListener('transition', onEndCallbackFn);
				// }
				// else {
				// 	onEndCallbackFn();
				// }
			};

		new GridFx(this.$refs.grid, {
			imgPosition: {
				x: -0.5,
				y: 1
			},
			onOpenItem: function(instance, item) {
				instance.items.forEach(function(el) {
					if (item != el) {
						var delay = Math.floor(Math.random() * 50);
						el.style.WebkitTransition = 'opacity .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1), -webkit-transform .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1)';
						el.style.transition = 'opacity .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1), transform .5s ' + delay + 'ms cubic-bezier(.7,0,.3,1)';
						el.style.WebkitTransform = 'scale3d(0.1,0.1,1)';
						el.style.transform = 'scale3d(0.1,0.1,1)';
						el.style.opacity = 0;
					}
				});
			},
			onCloseItem: function(instance, item) {
				instance.items.forEach(function(el) {
					if (item != el) {
						el.style.WebkitTransition = 'opacity .4s, -webkit-transform .4s';
						el.style.transition = 'opacity .4s, transform .4s';
						el.style.WebkitTransform = 'scale3d(1,1,1)';
						el.style.transform = 'scale3d(1,1,1)';
						el.style.opacity = 1;

						onEndTransition(el, function() {
							el.style.transition = 'none';
							el.style.WebkitTransform = 'none';
						});
					}
				});
			}
		});
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/ArtList/main";
@import "@/assets/styles/ArtList/demo";

.space {
	margin-top: 5vh;
}

.cancel-btn {
	// width: 50%;
	margin-top: 10px !important;
	background-color: #747f8d !important;
}

.confirm-btn {
	// width: 50%;
	margin-top: 10px !important;
}

.hide {
	visibility: hidden;
}

.vote-preview {
	width: 100%;
	max-width: 100%;
	height: auto;
	max-height: 35vh;
	object-fit: contain;
	margin-bottom: 20px;
}
</style>
