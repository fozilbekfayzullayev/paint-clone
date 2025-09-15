const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const toolBtn = document.querySelectorAll(".tool");
const fillShape = document.querySelector("#fill-shape");
const sizeSlider = document.querySelector("#size-slider");
const colorBtn = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas")
const saveCanvas = document.querySelector(".save-canvas")

let isDrawing = false,
    brushWidth = 5,
    selectedTool = 'brush',
    prevMouseX,
    prevMouseY,
    snapshot,
    selectedColor = '#000'

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = selectedColor
}

window.addEventListener("load", ()=> {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground()
})

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0,0, canvas.width,canvas.height)
    console.log(snapshot);

}
const stopDraw = () =>{
    isDrawing = false
}

const drawRectangle = (e) => {
    !fillShape.checked ?
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY)
    :ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath()
    const radius = Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)) + Math.pow((prevMouseY - e.offsetY),2)
    ctx.arc(prevMouseX,prevMouseY,radius/50, 0,2*Math.PI)
    !fillShape.checked ? ctx.stroke() : ctx.fill()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX,prevMouseY)
    ctx.lineTo(e.offsetX,e.offsetY)
    ctx.lineTo(prevMouseX*2 - e.offsetX,e.offsetY)
    ctx.closePath()
    !fillShape.checked ? ctx.stroke() : ctx.fill()
}

const drawing = e=> {
    if(!isDrawing) return
    ctx.putImageData(snapshot,0,0)

    if(selectedTool == "brush" || selectedTool == "eraser") {
        ctx.strokeStyle = selectedTool == "eraser" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX,e.offsetY)
        ctx.stroke()
    }
    switch (selectedTool) {
        case "rectangle":
            drawRectangle(e)
            break;
        case "circle":
            drawCircle(e)
            break;
        case "triangle":
            drawTriangle(e)
            break;
        case "eraser":
            const isEraser = selectedTool
            break;
        default:
            break;
    }

}


sizeSlider.addEventListener("change", ()=> brushWidth=sizeSlider.value)

colorBtn.forEach(btn=> {
    btn.addEventListener("click", ()=> {
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
        selectedColor = bgColor
    })

})

colorPicker.addEventListener("change", ()=> {
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

toolBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(btn.id);
    })

})

clearCanvas.addEventListener("click", ()=> {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    setCanvasBackground()
})

saveCanvas.addEventListener("click", ()=> {
    const link=document.createElement('a')
    link.download = `your-img${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})


canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)