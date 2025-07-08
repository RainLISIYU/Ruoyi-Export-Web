<script setup>

const show = ref(false)

onMounted(() => {
  canvasTest()
})

const videoTest = () => {
  // 参数
  var constraints = {
    audio: false,
    video: {
      width: 400,
      height: 300
    }
  }
  // 调用视频音频
  navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        var video = document.querySelector('video')
        video.srcObject = mediaStream
        video.onloadedmetadata = (e) => {
          video.play()
        }
      })
      .catch((err) => {
        document.querySelector('video').remove()
        const p = document.createElement('p')
        p.className = 'video-error-content'
        p.textContent = '暂不支持'
        document.querySelector('.video-form').appendChild(p)
      })
}
videoTest()

const canvasTest = () => {
  const myCanvas = document.querySelector('.myCanvas')
  const width = myCanvas.width
  const height = myCanvas.height
  const ctx = myCanvas.getContext('2d')
  // 背景
  ctx.fillStyle = 'rgb(0, 0, 0)'
  ctx.fillRect(0, 0, width, height)
  // 绘图
  ctx.fillStyle = 'rgb(255, 0, 0)'
  ctx.beginPath()
  ctx.moveTo(50, 50)
  ctx.lineTo(150, 50)
  const triHeight = 50 * Math.tan(degToRad(60))
  ctx.lineTo(100, 50 + triHeight)
  ctx.lineTo(50, 50)
  ctx.fill()
  ctx.fillStyle = 'rgb(0, 0, 255, 0.75)'
  ctx.beginPath()
  ctx.arc(150, 50, 50, degToRad(0), degToRad(360), false)
  ctx.fill()
  ctx.strokeStyle = 'rgb(255,255,255,0.75)'
  ctx.fillStyle = 'rgba(26,197,13,0.55)'
  ctx.beginPath()
  ctx.arc(150, 100, 50, degToRad(-45), degToRad(45), true)
  ctx.lineTo(150, 100)
  ctx.lineTo(150 + 50 * Math.cos(degToRad(45)), 100 - 50 * Math.sin(degToRad(45)))
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.fill()
  // 字体
  ctx.strokeStyle = 'rgb(255,255,255)'
  ctx.lineWidth = 1
  ctx.fillStyle = 'rgb(211,0,0)'
  ctx.font = '48px georgia'
  ctx.fillText('Canvas text', 200, 150)
  ctx.strokeText('Canvas text', 200, 150)
  // 图片
  const image = new Image()
  image.src = 'https://dytrq.com/static/img/user.69a73b63.gif'
  image.addEventListener('load', () => ctx.drawImage(image, 50, 50))
  myCanvas.setAttribute('aria-label', 'profile')
  // 循环和动画
  ctx.translate(width / 2, height / 2)
  let length = 250
  let moveOffset = 20
  for (let loopNum = 0; loopNum < length; loopNum++) {
    ctx.fillStyle = `rgb(${255-length}, 0, ${255 - length}, 0.5)`
    ctx.beginPath()
    ctx.moveTo(moveOffset, moveOffset)
    ctx.lineTo(moveOffset + length, moveOffset)
    const triHeight = (length / 2) * Math.tan(degToRad(60))
    ctx.lineTo(moveOffset + length / 2, moveOffset + triHeight)
    ctx.lineTo(moveOffset, moveOffset)
    ctx.fill()
    length --
    moveOffset += 0.7
    ctx.rotate(degToRad(5))
  }
}

// 角度转弧度
const degToRad = (degrees) => {
  return ( degrees * Math.PI ) / 180
}

// 随机数
const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
</script>

<template>
  <div class="video-form">
    <video></video>
  </div>
  <div>
    <el-button @click="show = !show">Toggle</el-button>
    <Transition name="fade">
      <p v-if="show">hello</p>
    </Transition>
  </div>
  <div class="canvas-region">
    <canvas class="myCanvas" width="500" height="360">
      <p>你的浏览器不支持canvas<</p>
    </canvas>
  </div>
</template>

<style scoped lang="scss">

</style>