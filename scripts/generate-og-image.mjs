import { createCanvas } from "canvas";
import fs from "fs";

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background — near black
ctx.fillStyle = "#080808";
ctx.fillRect(0, 0, width, height);

// Subtle grid texture
ctx.strokeStyle = "rgba(255,255,255,0.03)";
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 60) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y < height; y += 60) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Left accent bar
ctx.fillStyle = "#F5F5F5";
ctx.fillRect(80, 80, 3, 470);

// Name — large
ctx.fillStyle = "#F5F5F5";
ctx.font = "bold 72px serif";
ctx.fillText("Edeh Chinedu Daniel", 120, 220);

// Alias
ctx.fillStyle = "rgba(245,245,245,0.4)";
ctx.font = "32px monospace";
ctx.fillText("@RabbitDaCoder", 120, 275);

// Divider
ctx.fillStyle = "rgba(245,245,245,0.12)";
ctx.fillRect(120, 310, 400, 1);

// Role
ctx.fillStyle = "rgba(245,245,245,0.7)";
ctx.font = "28px sans-serif";
ctx.fillText("Full-Stack Engineer & Digital Creator", 120, 360);

// Location
ctx.fillStyle = "rgba(245,245,245,0.4)";
ctx.font = "22px monospace";
ctx.fillText("Enugu, Nigeria", 120, 410);

// URL bottom right
ctx.fillStyle = "rgba(245,245,245,0.25)";
ctx.font = "22px monospace";
ctx.textAlign = "right";
ctx.fillText("edehchinedu.dev", width - 80, height - 60);

// Save
const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
fs.writeFileSync("./frontend/public/og-default.jpg", buffer);
console.log("OG image generated: frontend/public/og-default.jpg");
