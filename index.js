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

const uploadFile = (event) => {
  const file = event.target.files[0];
  reader.readAsDataURL(file);
};

const formatImgObject = (img, canvas, scale) => {
  const canvasCenter = canvas.getCenter();

  img.scale(scale).set("flipX", true);
  img.left = canvasCenter.left;
  img.top = canvasCenter.top;
  img.originX = "center";
  img.originY = "center";
};

const generateQRCode = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    const QR_CODE_IMG_SCALE = 0.1;

    formatImgObject(img, canvas, QR_CODE_IMG_SCALE);
    canvas.add(img);
    canvas.renderAll();
  });
};

const generateBarCode = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    const BAR_CODE_IMG_SCALE = 0.5;

    formatImgObject(img, canvas, BAR_CODE_IMG_SCALE);
    canvas.add(img);
    canvas.renderAll();
  });
};

const clearCanvas = (canvas) => {
  canvas.getObjects().forEach((obj) => {
    if (obj !== canvas.backgroundImage) {
      canvas.remove(obj);
    }
  });
};

const CANVAS_ID = "canvas";
const INPUT_BACKGROUND_ID = "background-upload";
const QR_CODE_BTN_ID = "qr-code-btn";
const BAR_CODE_BTN_ID = "bar-code-btn";
const RESET_BTN_ID = "reset-btn";

const QR_CODE_URL = "./public/imgs/qr-code.png";
const BAR_CODE_URL = "./public/imgs/bar-code.png";

const inputFile = document.getElementById(INPUT_BACKGROUND_ID);
const qrCodeButton = document.getElementById(QR_CODE_BTN_ID);
const barCodeButton = document.getElementById(BAR_CODE_BTN_ID);
const resetButton = document.getElementById(RESET_BTN_ID);

const reader = new FileReader();
const canvas = initCanvas(CANVAS_ID);

//Event Listeners
inputFile.addEventListener("change", uploadFile);

reader.addEventListener("load", () => {
  //create Image to get height, width
  const curImg = new Image();
  curImg.src = reader.result;

  curImg.onload = function () {
    const curHeight = this.height;
    const curWidth = this.width;

    setSizeBackgroundImg(curHeight, curWidth, canvas);
    setBackgroundImg(reader.result, canvas);
  };
});

qrCodeButton.addEventListener("click", () =>
  generateQRCode(QR_CODE_URL, canvas)
);

barCodeButton.addEventListener("click", () =>
  generateBarCode(BAR_CODE_URL, canvas)
);

resetButton.addEventListener("click", () => {
  clearCanvas(canvas);
});
