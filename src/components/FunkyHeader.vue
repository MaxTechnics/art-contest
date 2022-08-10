<template>
    <header id="header" class="animated slideInDown" :class="{ 'isScrolled': hasScrolled }" style="animation-delay:0.8s;">
        <table>
            <tr>
                <td id="logo">r/JaidenAnimations Art Contest Submissions</td>
                <td id="navigation">
                    <img v-if="$store.state.user_info.avatar" class="thign" :src="`https://cdn.discordapp.com/avatars/${$store.state.user_info?.id}/${$store.state.user_info?.avatar}.png`">
                    <a class="no-effect">
                        {{ $store.state.user_info?.username}}
                        </a>
                    <a class="logoff" @click="leave">Log off</a>
                </td>
            </tr>
        </table>
    </header>
</template>

<script>
export default {
	name: 'FunkyHeader',
	data: () => ({
		hasScrolled: false
	}),
	methods: {
		handleScroll() {
			if (window.innerWidth >= 1000) {
				this.hasScrolled = document.body.scrollTop > 80 || document.documentElement.scrollTop > 80;
			}
		},
		leave() {
			fetch('/session', {
				method: 'DELETE'
			}).then(e => {
				window.location = '/';
			})
		}
	},
	mounted() {
		window.addEventListener('scroll', this.handleScroll);
	},
	beforeUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
}
</script>

<style lang="scss" scoped>
/* so this is how vue works -a*/
// yes, every vue component has 3 parts, a template for your haitch tee em el,z a script for your functional shit and a style for your styling shit -m
// also notice how scss can use // for comments -m
// that's awesome! -a
// pro tip: use ctrl+/ to automatically comment/uncomment something -m
// oh, thanks! -a
header {
	/* width: 92vw; */
	width: 100vw;
	/* padding: 6vh 4vw; */
	padding-top: 1.5vh;
	padding-bottom: 1.5vh;
	position: fixed;
	font-weight: bold;
	background: transparent;
	color: #fff;
	box-shadow: none;
	transition: 0.4s ease-in-out;
	z-index: 2;
	backdrop-filter: blur(8px);
}
header.isScrolled {
	background-color: rgba(#182538, 0.5);
	// color: #000000;
	box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.09);
}
header table {
	width: 100%;
}
#logo {
	width: 60%;
	padding-left: 2vw;
}
/* i want to die */
#navigation {
	width: 80%;

	padding-right: 2vw;
}
#logo {
	font-size: 24px;
	// color: rgb(255, 44, 90);
}

// hide logo when width smaller than 150 pixel
@media (max-width: 480px) {
	#logo {
		display: none;
	}
}

#navigation {
	text-align: right;
}
#navigation a {
	color: inherit;
	text-decoration: none;
	padding: 5px 10px;
	border-bottom: 2px solid transparent;
	transition: 0.4s ease-in-out;
	display: inline;
}
#navigation a:hover {
	border-bottom: 2px solid #f04747;
}

.no-effect {
	border-bottom: none !important;
}

.logoff {
	color: #f04747 !important;
	cursor: pointer;
}

.thign {
	border-radius: 50%;
	height: 3vh;
	vertical-align: middle;
	display: inline;
}
</style>
