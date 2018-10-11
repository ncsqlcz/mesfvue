<template>
	<section>
    {{ $route.path + ' -> ' + $t(`router["${$route.name}"]`) }}
	</section>
</template>

<script>
	export default {
	}
</script>


<style scoped>

</style>
