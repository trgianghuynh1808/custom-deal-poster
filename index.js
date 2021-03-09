const initCanvas = (id) => {
  return new fabric.Canvas(id);
};

const setSizeBackgroundImg = (height, width, canvas) => {
  canvas.setHeight(height);
  canvas.setWidth(width);
};

const setBackgroundImg = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    canvas.backgroundImage = img;
    canvas.renderAll();
  });
};

const uploadFile = () => {
  const inputEle = document.getElementById(INPUT_BACKGROUND_ID);
  const file = inputEle.files[0];

  reader.readAsDataURL(file);
};

const CANVAS_ID = "canvas";
const INPUT_BACKGROUND_ID = "background-upload";

const inputFile = document.getElementById(INPUT_BACKGROUND_ID);
const reader = new FileReader();
const canvas = initCanvas(CANVAS_ID);

//Event Listener
inputFile.addEventListener("change", uploadFile);
reader.addEventListener("load", () => {
  const curImg = new Image();

  curImg.src = reader.result;

  curImg.onload = function () {
    const curHeight = this.height;
    const curWidth = this.width;

    setSizeBackgroundImg(curHeight, curWidth, canvas);
    setBackgroundImg(reader.result, canvas);
  };
});
