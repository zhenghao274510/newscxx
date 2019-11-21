<template>
	<div class="list" >
		<div class="store">
			<div class="wrapper">
				<div class="content">
					<textarea placeholder="请留下您宝贵的意见" v-model="value"></textarea>
				</div>
				<div class="submit" @click="submit">提交</div>
			</div>
		</div>
		<dialogs :data1="data1" :data2="data2" :showDialog="showDialog" @hide="hide"></dialogs>
	</div>
</template>

<script>
import Request from '@/common/js/request'
import Dialogs from '@/components/dialogs'
export default {
	data() {
		return {
			data1: '感谢您的宝贵意见',
			data2: '知道了',
			showDialog: false,
			value: '',
			cid: ''
		}
	},
	onLoad() {
		  wx.setNavigationBarTitle({
      title: "意见反馈"
    });
		this.cid = JSON.parse(wx.getStorageSync('user')).cid;
	},
	components: {
		Dialogs
	},
	mounted() {
  },
	methods: {
	
		submit() {
			let self = this

			if (this.value == '') {
				wx.showToast({title:'反馈不能为空'})
				return
			}

			if (this.value.length > 120) {
				wx.showToast({title:'内容长度不能超过120个字'})
				return
			}
			let datas = {
				cmd: 'feedback',
				cid: this.cid,
				content: this.value
			}
			console.log(datas)
			Request.postRequest(datas).then(res => {
				console.log(res)
				if (res.result == 0) {
					self.showDialog = true
          self.clear();
          // this.$router.go(-1);
				}
			}).catch(res => {
			wx.showToast({title:res.resultNote})
			})
    },
    Toast(val){
      wx.showToast({
        title:val
      })
    },
		clear() {
			this.value = ''
		},
		hide() {
			this.showDialog = false
			this.$router.go(-1)
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	
	.list
		width: 100%
		height: 100%
		.store
			width: 100%
			display: flex
			flex-direction: column
			.wrapper
				width: 100%
				display: flex
				flex-direction: column
				border-top: 1px solid #eee
				padding: 0.5rem 0.4rem
				box-sizing: border-box
				.content
					width: 100%
					border: 1px solid #eee
					border-radius: 6px
					padding: 0.3rem
					box-sizing: border-box
					font-size: 14px
					color: #333
					textarea
						width: 100%
						height: 3rem
						resize: none
						border: none
				.submit
					width: 100%
					height: 1rem
					display: flex
					align-items: center
					justify-content: center
					background: rgb(114,209,65)
					font-size: 14px
					color: #fff
					border-radius: 6px
					margin: 1rem auto 0
</style>
