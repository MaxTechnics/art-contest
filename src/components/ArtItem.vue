<template>
	<div class="grid__item" data-size="1280x961">
		<a :href="imageURL" class="img-wrap"><img :src="imageURL" alt="img" />
			<div class="description description--grid">
				<h3>{{ title }}</h3>
				<p>{{ description }}<em>&mdash; {{ author }}</em></p>
				<!-- <div class="details"> -->
					<!-- <ul> -->
						<!-- <li><i class="icon icon-camera"></i><span>Canon PowerShot S95</span></li> -->
						<!-- <li><i class="icon icon-focal_length"></i><span>22.5mm</span></li> -->
						<!-- <li><i class="icon icon-aperture"></i><span>&fnof;/5.6</span></li> -->
						<!-- <li><i class="icon icon-exposure_time"></i><span>1/1000</span></li> -->
						<!-- <li><i class="icon icon-iso"></i><span>80</span></li> -->
					<!-- </ul> -->
				<!-- </div> -->
			</div>
		</a>
	</div>
</template>

<script>
export default {
	name: 'ArtItem',
	props: {
		title: String,
		description: String,
		author: String,
		imageURL: String
	}
}
</script>
