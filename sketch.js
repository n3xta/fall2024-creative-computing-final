const cnv1 = document.getElementById("1")
const cnv2 = document.getElementById("2")

let ctx1
let ctx2

let video

function setup() {
  console.log(cnv1)
  ctx1 = cnv1.getContext('2d')
  ctx2 = cnv2.getContext('2d')
  console.log(ctx1)
  video = createCapture(VIDEO)
  console.log(video)
  video.hide()
}

function draw() {
  const aspectRatio = video.width / video.height;
  const newHeight1 = cnv1.width / aspectRatio;
  const newHeight2 = cnv2.width / aspectRatio;

  ctx1.drawImage(video.elt, 0, 0, cnv1.width, newHeight1);
  ctx2.drawImage(video.elt, 0, 0, cnv2.width, newHeight2);
}
