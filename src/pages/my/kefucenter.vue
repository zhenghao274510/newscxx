<template>
	<div class="service-box">
		<div class="service-zi">
			<div class="Qr-code">
				<div>
					<img :src="ershop"  alt>
					<p>微信客服二维码</p>
				</div>
			</div>
			<ul>
				<li>
					<span class="li1">软件版权</span>
					<span class="li2">{{ownerCompany}}</span>
				</li>
				<li>
					<span class="li1">网址</span>
					<span class="li2">{{website}}</span>
				</li>
				<li @click="tell">
					<span class="li1">客服电话</span>
					<span class="li2" style="color:#72D241">一键拨号</span>
				</li>
				<li>
					<span class="li1">邮箱</span>
					<span class="li2">{{email}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Request from "@/common/js/request";

	export default {
		data() {
			return {
				text: "客服中心",
				ershop: "",
				ownerCompany: "",
				email: "",
				website: "",
				phone: ""
			};
		},
		components: {
		},
		onLoad() {
		  wx.setNavigationBarTitle({
      title: "客服中心"
    });
		},
		mounted() {
			this.service();
		},
		 onShareAppMessage() {
     return this.$share.share()
   },
		methods: {
			tell(){
				let self=this;
      wx.makePhoneCall({
        phoneNumber:self.phone
      })
			},
			service() {
				let goCarlist = {
					cmd: "serviceCenter"
				};
				Request.postRequest(goCarlist)
					.then(res => {
						console.log(res);
						if (res.result == 0) {
							this.ershop = res.qrcode;
							this.ownerCompany = res.ownerCompany;
							this.website = res.website;
							this.phone = res.phone;
							this.email = res.email;
						}
					})
					.catch(res => {

					});
			}
    }
	};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.service-zi {
		// padding: 72px 10px 0;
	}

	.Qr-code {
		height: 200px;

		div {
			width: 150px;
			margin: 30px auto;
			text-align: center;

			img {
				width 100px;
				height 100px;
				margin-bottom: 10px;
			}
		}
	}

	li {
		line-height: 40px;
		padding:0 10px;
		display: flex;
		justify-content: space-between;
		position relative;
		border-bottom:1rpx solid  #e5e5e5;
		a{
			width 100%;
			height 100%;
			display block;
			position absolute;
			top:0;
			left 0;

		}
	}

	.li1 {
		font-weight: 500;
	}

	.li2 {
		color: #818080;
	}
</style>
