<template>
	<div class="tenants-box wrapper">
		<div class="tenants-zi">
			<!-- <iframe :src="url" height="100%" width="100%" frameborder="0"></iframe> -->
			<ul>
			  <li v-for="(item,index) in list" :key="index" @click="problemDetails(item)">
			    <span>{{item.title}}</span>
			    <span>
			      <img src="/static/img/right.png" alt>
			    </span>
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
				text: "服务条文",
				list: []
			};
		},
		components: {
		},
		onLoad() {
			this.getshop();
		},
		mounted() {
		},
		onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
		methods: {
			problemDetails(item){
        console.log(item)
        wx.setStorageSync("tiaowen",JSON.stringify(item));
        wx.navigateTo({
          url:'./provisionsDetail'
        })
			},
			getshop() {
				let goCarlist = {
					cmd: "serviceProtocal"
				};
				Request.postRequest(goCarlist)
					.then(res => {
						console.log(res);
						if (res.result == 0) {
							this.list = res.dataList;
						}
					})
					.catch(res => {
            wx.showToast({
              title:"获取失败"
            })
					});
			}
		}
	};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.wrapper {
		width: 100%;
		height: 100%;
	}
	
	.tenants-zi {
		width: 100%;
		height: 100%;
		border-top: 1px solid #dedede;
		
		ul {
		  li {
		    padding: 0 0.5rem;
		    font-size: 16px;
		    line-height: 40px;
		    border-bottom: 1px solid #dedede;
		    display: flex;
		    justify-content: space-between;
		    span {
		      color:#000;
		      img {
		        width: 20px;
		        height: 20px;
		      }
		    }
		  }
		}
	}
</style>
