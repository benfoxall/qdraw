import './style.css'
import simplify from 'simplify-js';
import QRious from 'qrious'

function doSimplify(path) {
  return simplify(path.map(([x, y]) => ({ x, y })), 10)
    .map(({ x, y }) => ([x, y]))
}

const qr = document.querySelector('#qr')
const canvas = document.querySelector('#draw')
const ctx = canvas.getContext('2d')

// state
const paths = [];

let current;

// v1 - 255 / 255
function save() {

  const parts = []
  for (const path of paths) {
    const coords = path
      .flatMap(([x, y]) => [x, y])
      .map(v => Math.floor(v / 4))
      .map(v => Math.min(v, 255))
      .map(v => Math.max(0, v))

    const bstr = coords.map(b => String.fromCharCode(b)).join('')

    const b64 = btoa(bstr);
    parts.push(b64);
  }

  const s = parts.join('.')
  const params = new URLSearchParams();
  params.set('v0', s)

  history.replaceState(null, "", '?' + params);

  new QRious({
    element: qr,
    value: document.location.href
  });

  // location.search = params
}
function restore(str) {
  for (const part of str.split('.')) {
    const decoded = atob(part);
    const pairs = [];
    for (let i = 0; i < decoded.length; i += 2) {
      const x = decoded.charCodeAt(i) * 4;
      const y = decoded.charCodeAt(i + 1) * 4;
      pairs.push([x, y]);
    }

    paths.push(pairs)
  }

  redraw()
}

const v0 = new URLSearchParams(location.search).get('v0')
if (v0) {
  restore(v0)
}

canvas.addEventListener('pointerdown', e => {
  console.log("down")
  current = []
  canvas.setPointerCapture(e.pointerId)
})

canvas.addEventListener('pointerup', e => {
  console.log("up")
  const min = doSimplify(current);
  console.log(current.length, min.length)

  paths.push(min);
  current = null;
  canvas.releasePointerCapture(e.pointerId)
  redraw()

  save()
})


canvas.addEventListener('pointermove', e => {
  let [x, y] = normalise(e, canvas)

  current?.push([x, y]);

  redraw()
})

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  window.deb = { paths, current }

  for (const path of paths) {
    ctx.beginPath()
    ctx.lineWidth = 8
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.strokeStyle = '#333'
    for (const [x, y] of path) {
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  if (current) {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.strokeStyle = '#fc0'
    for (const [x, y] of current) {
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}




// 
function normalise(event, canvas) {
  let rect = canvas.getBoundingClientRect();

  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  let x = event.offsetX * scaleX;
  let y = event.offsetY * scaleY;

  return [x, y]
}
