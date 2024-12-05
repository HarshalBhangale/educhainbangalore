import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

let detector: poseDetection.PoseDetector | null = null;

export async function initializeDetector() {
  if (!detector) {
    // Initialize TensorFlow backend
    await tf.setBackend('webgl');
    await tf.ready();
    
    const model = poseDetection.SupportedModels.MoveNet;
    detector = await poseDetection.createDetector(model);
  }
  return detector;
}

const PUSHUP_THRESHOLD = 0.3;
let isPushupUp = true;
let lastY = 0;

export async function detectPushup(video: HTMLVideoElement): Promise<boolean> {
  if (!detector) return false;

  const poses = await detector.estimatePoses(video);
  if (poses.length === 0) return false;

  const pose = poses[0];
  const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
  const leftElbow = pose.keypoints.find(k => k.name === 'left_elbow');
  const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');

  if (!leftShoulder?.y || !leftElbow?.y || !leftWrist?.y) return false;

  const currentY = leftElbow.y;
  const deltaY = Math.abs(currentY - lastY);

  if (deltaY > PUSHUP_THRESHOLD) {
    if (isPushupUp && currentY > lastY) {
      isPushupUp = false;
      lastY = currentY;
      return true;
    } else if (!isPushupUp && currentY < lastY) {
      isPushupUp = true;
    }
  }

  lastY = currentY;
  return false;
}
