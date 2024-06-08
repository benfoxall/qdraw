import './style.css'

const canvas = document.querySelector('#draw')
const ctx = canvas.getContext('2d')

canvas.addEventListener('pointermove', e => {

  const { offsetX: x, offsetY: y } = e;

  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  let scaledX = x * scaleX;
  let scaledY = y * scaleY;

  ctx.fillStyle = '#f08'

  if (e.pressure === 0) {
    ctx.fillStyle = '#08f3'
  }

  ctx.fillRect(scaledX - 5, scaledY - 5, 10, 10);

  console.log(e)
  console.log(scaledX, scaledY)

})

