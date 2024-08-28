<template>
	<div class="checkbox-wrapper">
		<input @change="$emit('update:modelValue', $event.target.checked)" type="checkbox" :id="uuid" class="checkbox" :checked="modelValue" >
		<label :for="uuid">{{ label }}</label>
	</div>
</template>

<script>
export default {
	name: 'ModalCheckbox',
	emits: ['update:modelValue'],
	props: {
		uuid: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		modelValue: Boolean
	}
};
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 400;
}

.checkbox-wrapper + .checkbox-wrapper {
	margin: 20px 0 40px;
}

.checkbox {
	display: none;
}

.checkbox + label {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.checkbox + label:before {
	content: "";
	margin-right: 10px;
	width: 15px;
	height: 15px;
	border: 1px solid #43b581;
	border-radius: 4px;
	cursor: pointer;
	flex-shrink: 0;
}

.checkbox:checked + label:before {
	/* background-color: #3a6df0; */
	/* border-color: #3a6df0; */
	background-color: #43b581;
	border-color: #43b581;
	background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3e%3cpath d='M20 6L9 17l-5-5'/%3e%3c/svg%3e");
	background-position: 50%;
	background-size: 12px;
	background-repeat: no-repeat;
}
</style>
