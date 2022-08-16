// ammount to add on each button press
const confettiCount = 150

// "physics" variables
const gravityConfetti = 0.3
const dragConfetti = 0.075
const terminalVelocity = 3

// init other global elements
const canvas = document.getElementById('getlost')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let cx = ctx.canvas.width / 2
let cy = ctx.canvas.height / 2

// add Confetto/Sequin objects to arrays to draw them
let confetti = []

// colors, back side is darker for confetti flipping
const colors = [
    { front: '#7b5cff', back: '#6245e0' }, // Purple
    { front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
    { front: '#5c86ff', back: '#345dd1' }  // Darker Blue
]

// helper function to pick a random number within a range
randomRange = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
initConfettoVelocity = (xRange, yRange) => {
    const x = randomRange(xRange[0], xRange[1])
    const range = yRange[1] - yRange[0] + 1
    let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range)
    if (y >= yRange[1] - 1) {
        // Occasional confetto goes higher than the max
        y += (Math.random() < .25) ? randomRange(1, 3) : 0
    }
    return { x: x, y: -y }
}

// Confetto Class
class Confetto {
    constructor() {
        this.randomModifier = randomRange(0, 99)
        this.color = colors[Math.floor(randomRange(0, colors.length))]
        this.dimensions = {
            x: randomRange(5, 9),
            y: randomRange(8, 15),
        }
        this.position = {
            // x: randomRange(canvas.width / 2 - button.offsetWidth / 4, canvas.width / 2 + button.offsetWidth / 4),
            // x: randomRange(canvas.width / 2 - 0 / 4, canvas.width / 2 + 0 / 4),
            x: randomRange(0, canvas.width),
            // y: randomRange(canvas.height / 2 + button.offsetHeight / 2 + 8, canvas.height / 2 + (1.5 * button.offsetHeight) - 8),
            // y: randomRange(canvas.height / 2 + 0 / 2 + 8, canvas.height / 2 + (1.5 * 0) - 8),
            y: canvas.height
        }
        this.rotation = randomRange(0, 2 * Math.PI)
        this.scale = {
            x: 1,
            y: 1,
        }
        // this.velocity = initConfettoVelocity([-9, 9], [6, 11])
        this.velocity = initConfettoVelocity([-9, 9], [10, 25])
    }
    update() {
        // apply forces to velocity
        this.velocity.x -= this.velocity.x * dragConfetti
        this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
        this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

        // set position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // spin confetto by scaling y and set the color, .09 just slows cosine frequency
        this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
    }
}

// add elements to arrays to be drawn
initBurst = () => {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto())
    }
}

// draws the elements on the canvas
render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    confetti.forEach((confetto, index) => {
        let width = (confetto.dimensions.x * confetto.scale.x)
        let height = (confetto.dimensions.y * confetto.scale.y)

        // move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y)
        ctx.rotate(confetto.rotation)

        // update confetto "physics" values
        confetto.update()

        // get front or back fill color
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back

        // draw confetto
        ctx.fillRect(-width / 2, -height / 2, width, height)

        // reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        // clear rectangle where button cuts off
        if (confetto.velocity.y < 0) {
            // ctx.clearRect(canvas.width / 2 - button.offsetWidth / 2, canvas.height / 2 + button.offsetHeight / 2, button.offsetWidth, button.offsetHeight)
            ctx.clearRect(canvas.width / 2 - 0 / 2, canvas.height / 2 + 0 / 2, 0, 0)
        }
    })

    // remove confetti and sequins that fall off the screen
    // must be done in seperate loops to avoid noticeable flickering
    confetti.forEach((confetto, index) => {
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1)
    })

    window.requestAnimationFrame(render)
}



// re-init canvas if the window size changes
resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cx = ctx.canvas.width / 2
    cy = ctx.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
    resizeCanvas()
})

// kick off the render loop
render()
