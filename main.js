import './style.css'

const canvas = document.querySelector('#draw')
const ctx = canvas.getContext('2d')

// state
const paths = [];


canvas.addEventListener('pointermove', e => {
  let [x, y] = normalise(e, canvas)

  ctx.fillStyle = '#f08'

  if (e.pressure === 0) {
    ctx.fillStyle = '#08f5'
  }

  ctx.fillRect(x - 5, y - 5, 10, 10);

  const coalescedEvents = e.getCoalescedEvents();
  for (let coalescedEvent of coalescedEvents) {
    let [x, y] = normalise(coalescedEvent, canvas)

    ctx.fillStyle = '#fc09'
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }
})


function normalise(event, canvas) {
  let rect = canvas.getBoundingClientRect();

  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  let x = event.offsetX * scaleX;
  let y = event.offsetY * scaleY;

  return [x, y]
}
