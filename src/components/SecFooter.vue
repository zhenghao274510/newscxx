<template>
	<view class="sec-footer">
		<view @click="onNavTab(index)" class="item"  v-for="(item,index) in nav" :key="index">
			<image :src="tabarA==index?item.imgh:item.img"></image>
			<text  class="choose" v-if="tabarA==index">{{item.txt}}</text>
			<text class="dc" v-else>{{item.txt}}</text>
		  <text class="pos" v-if="index==3">{{cartnum}}</text>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tabarA: {
				type: Number,
				default: 0
			},
			cartnum:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				num:0,
				nav: [{
						txt: '首页',
						img: "/static/tabs/shouye1.png",
						imgh: '/static/tabs/shouye2.png',
					},
					{
						txt: '分类',
						img: "/static/tabs/fenlei.png",
						imgh: '/static/tabs/fenlei2.png',
					},
					{
						txt: '附近商家',
						img: "/static/tabs/fujinshangjia.png",
						imgh: '/static/tabs/fujinshangjia2.png',
					},
					{
						txt: '购物车',
						img: "/static/tabs/gouwuche.png",
						imgh: '/static/tabs/gouwuche2.png',
					},
						{
						txt: '我的',
						img: "/static/tabs/wode.png",
						imgh: '/static/tabs/wode2.png',
					},
				]
			}
		},
		components: {},
		onLoad() {
		},
		onShow() {
		},
		onHide() {},
		methods: {
			onNavTab(e) {
				e=e-0;
				switch (e) {
					case 0:
						wx.reLaunch({
							url: "/pages/tarba/home"
						});
						break;

					case 1:
						wx.reLaunch({
							url: "/pages/tarba/class"
						});
						break;

					case 2:
						wx.reLaunch({
							url: "/pages/tarba/nearyShop"
						});
						break;
					case 3:
						wx.reLaunch({
							url: "/pages/tarba/cart"
						});
						break;
						case 4:
						wx.reLaunch({
							url: "/pages/tarba/person"
						});
				}
			}
		},
		//  加载

	}
</script>

<style>
	.sec-footer {
		width:100%;
		padding:5px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		background: #fff;
		z-index: 9999;
		border-top: 1px solid #f2f3f4;
		box-sizing: border-box;
	}
	.pos{
		width: 15px;
		height: 15px;
		line-height:15px;
		text-align: center;
		position: absolute;
		top: -5px;
		right: 15px;
		background: red;
		color: #fff;
		border-radius: 50%;
		font-size: 10px;
	}

	.item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #999;
		position: relative;
	}

	.item image {
		width: 22px;
		height: 20px;
	}

	.choose {
		color: #72D241;
	}
</style>
