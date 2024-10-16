

export function randi(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function loadImage(url) {
  return new Promise((r) => {
    let i = new Image();
    i.onload = (() => r(i));
    i.src = url;
  });
}

