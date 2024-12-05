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

const PUSHUP_THRESHOLD = 0.15; // Angle threshold for push-up detection
const MIN_CONFIDENCE = 0.3;
let isPushupUp = true;
let lastAngle = 0;

function calculateAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

export async function detectPushup(video: HTMLVideoElement): Promise<boolean> {
  if (!detector) return false;

  const poses = await detector.estimatePoses(video);
  if (poses.length === 0) return false;

  const pose = poses[0];
  const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
  const leftElbow = pose.keypoints.find(k => k.name === 'left_elbow');
  const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
  const rightShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');
  const rightElbow = pose.keypoints.find(k => k.name === 'right_elbow');
  const rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');

  // Check if all required keypoints are detected with sufficient confidence
  const requiredPoints = [leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist];
  if (requiredPoints.some(point => !point?.score || point.score < MIN_CONFIDENCE)) return false;

  // Calculate angles for both arms
  const leftAngle = calculateAngle(
    {x: leftShoulder!.x, y: leftShoulder!.y},
    {x: leftElbow!.x, y: leftElbow!.y},
    {x: leftWrist!.x, y: leftWrist!.y}
  );
  
  const rightAngle = calculateAngle(
    {x: rightShoulder!.x, y: rightShoulder!.y},
    {x: rightElbow!.x, y: rightElbow!.y},
    {x: rightWrist!.x, y: rightWrist!.y}
  );

  // Use the average angle of both arms
  const currentAngle = (leftAngle + rightAngle) / 2;
  
  // Detect push-up based on arm angle changes
  if (isPushupUp && currentAngle < 90 && Math.abs(currentAngle - lastAngle) > PUSHUP_THRESHOLD) {
    // Going down
    isPushupUp = false;
  } else if (!isPushupUp && currentAngle > 160 && Math.abs(currentAngle - lastAngle) > PUSHUP_THRESHOLD) {
    // Coming up - count the push-up
    isPushupUp = true;
    lastAngle = currentAngle;
    return true;
  }

  lastAngle = currentAngle;
  return false;
}
