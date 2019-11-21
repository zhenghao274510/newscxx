<template>
	<div class="wrapper">
		<!-- <main-header :text="text" @back="back"></main-header> -->
		<div class="problemDetails-zi">
      <web-view :src="url"></web-view>
			<!-- <iframe :src="this.url" height="100%" width="100%" frameborder="0"></iframe> -->
		</div>
	</div>
</template>

<script>
	import Request from "@/common/js/request";
	export default {
		data() {
			return {
				url: ""
			};
		},
		components: {
		},
		onLoad() {
       if(wx.getStorageSync('url')){
				 this.url=wx.getStorageSync('url');
				 wx.removeStorageSync("url");
				 console.log(this.url);
			 }
		},
		mounted() {
		},
		methods: {
		}
	};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.wrapper {
		width: 100%;
		height: 100%;
	}
	
	.problemDetails-zi {
		width: 100%;
		height: 100%;
		padding: 50px 0.4rem 30px;
		box-sizing: border-box;
	}
</style>
