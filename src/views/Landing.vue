<template>
	<div class="component-container is-boxed has-animations lights-off" :class="{ 'is-loaded': loaded }">
    	<div class="body-wrap boxed-container" ref="contain">
    	    <main>
    	        <section class="hero">
    	            <div class="container">
    	                <div class="hero-inner">
							<div class="hero-copy">
		                        <h1 class="hero-title mt-0">r/JaidenAnimations art contest</h1>
		                        <p class="hero-paragraph">View the user's contributions and vote on your favorite one!</p>
		                        <div class="hero-cta">
									<a class="button button-primary" @click="gotoSubmissions">View submissions</a>
								</div>
							</div>
							<div class="hero-media">
								<div class="header-illustration">
									<img class="header-illustration-image asset-dark" src="@/assets/images/Landing/header-illustration-dark.svg" alt="Header illustration">
								</div>
								<div class="hero-media-illustration">
									<img class="hero-media-illustration-image asset-dark" src="@/assets/images/Landing/hero-media-illustration-dark.svg" alt="Hero media illustration">
								</div>
								<div class="hero-media-container">
									<!-- <img class="hero-media-image asset-dark" src="@/assets/images/landing.png" alt="Hero media"> -->
									<img class="hero-media-image asset-dark" :src="art_showcase" alt="Hero media">
									<!-- <img class="hero-media-image asset-dark" src="@/assets/images/Landing/hero-media-dark.svg" alt="Hero media"> -->
								</div>
							</div>
    	                </div>
    	            </div>
    	        </section>
    	    </main>

			<section class="cta section">
    	        <div class="container-sm">
    	            <div class="cta-inner section-inner">
    	                <div class="cta-header text-center">
    	                    <h2 class="section-title mt-0">Not part of our community yet?</h2>
    	                    <p class="section-paragraph">You won't be able to vote, however feel free to join our server!</p>
							<div class="cta-cta">
								<a class="button button-primary" href="https://discord.gg/98RMyYUyZa">Join server</a>
							</div>
					    </div>
    	            </div>
    	        </div>
    	    </section>

    	    <footer class="site-footer has-top-divider">
    	        <span class="footer-copyright">Proudly made by Maxim Coppieters (aka Acama's Homework)</span>
    	    </footer>
    	</div>
	</div>
</template>

<script>
import submissions from '@/assets/submissions';

export default {
	name: 'Landing',
	data: () => ({
		loaded: false,
		factor: 1,
		art_showcase: submissions[Math.floor(Math.random() * submissions.length)].asset,
		imageHeight: 0,
		imageWidth: 0
	}),
	methods: {
		handleResize() {
			// Note to whoever reads this
			// This is an absolutely disgusting piece of code, however
			// I did not have the time to properly resize the svg's and the entire site itself. this will do
			this.factor = 1 / (this.$refs.contain.clientWidth / window.innerWidth);
			// this.factor = 1 / Math.max(this.$refs.contain.clientWidth / window.innerWidth, this.$refs.contain.clientHeight.clientHeight / window.innerHeight);
			document.body.style.transform = `scale(${this.factor})`;

		},
		gotoSubmissions() {
			this.$router.replace('/submissions');
		}
	},
	mounted() {
		this.loaded = true
		// document.body.style.transform = 'scale(' + 1 / (elm.clientWidth / window.innerWidth), + ')';
		this.handleResize();
		document.body.classList.add('sheesh')
		window.addEventListener('resize', this.handleResize);
		setTimeout(() => {
			this.handleResize
		}, 1000);
	},
	unmounted() {
		window.removeEventListener('resize', this.handleResize);
		document.body.classList.remove('sheesh');
		document.body.style = ''
	}
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/Landing/scss/style";

.hero-media-image {
	object-fit: cover;
}
</style>
