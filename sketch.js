let bodyPose;

function preload() {
  bodyPose = ml5.bodyPose("BlazePose");
}

class VideoCanvas {
  constructor(canvasId, keypointName) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.keypointName = keypointName;
  }

  draw(video, poses) {
    if (poses.length > 0) {
      const pose = poses[0]; // 假设只有一个人
      const keypoint = pose.keypoints.find(k => k.name === this.keypointName);

      if (keypoint && keypoint.confidence > 0.1) {
        const x = keypoint.x;
        const y = keypoint.y;
        const cropWidth = 50; // 裁剪区域的宽度
        const cropHeight = 50; // 裁剪区域的高度

        // 确保裁剪区域在视频范围内
        const sx = Math.max(0, x - cropWidth / 2);
        const sy = Math.max(0, y - cropHeight / 2);

        this.ctx.drawImage(
          video.elt,
          sx, sy, cropWidth, cropHeight, // 从视频中裁剪
          0, 0, this.canvas.width, this.canvas.height // 绘制到画布
        );
      } else {
        // 如果关键点不可用，绘制空白或占位符
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }
}

let video;
let canvases = [];
let poses = [];

function setup() {
  canvases.push(new VideoCanvas("1", "left_eye"));
  canvases.push(new VideoCanvas("2", "right_eye"));
  canvases.push(new VideoCanvas("3", "left_shoulder"));
  canvases.push(new VideoCanvas("4", "right_wrist"));
  canvases.push(new VideoCanvas("5", "left_thumb"));
  canvases.push(new VideoCanvas("6", "right_thumb"));
  canvases.push(new VideoCanvas("7", "mouth_left"));
  canvases.push(new VideoCanvas("8", "right_shoulder"));

  video = createCapture(VIDEO);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  canvases.forEach(canvas => canvas.draw(video, poses));
}
