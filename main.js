import './style.css'

const canvas = document.querySelector('#draw')
const ctx = canvas.getContext('2d')

// state
const paths = [];

let current;

canvas.addEventListener('pointerdown', e => {
  console.log("down")
  current = []
  canvas.setPointerCapture(e.pointerId)
})

canvas.addEventListener('pointerup', e => {
  console.log("up")
  paths.push(current);
  current = null;
  canvas.releasePointerCapture(e.pointerId)
  redraw()
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
    ctx.lineWidth = 5
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.strokeStyle = '#5559'
    for (const [x, y] of path) {
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  if (current) {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.lineCap = ctx.lineJoin = 'round'
    ctx.strokeStyle = '#f08'
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
