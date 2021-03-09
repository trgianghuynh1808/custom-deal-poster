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
    img.cacheKey = QR_CODE_CACHE_KEY;

    canvas.add(img);
    canvas.renderAll();
  });
};

const generateBarCode = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    const BAR_CODE_IMG_SCALE = 0.5;

    formatImgObject(img, canvas, BAR_CODE_IMG_SCALE);
    img.cacheKey = BAR_CODE_CACHE_KEY;

    canvas.add(img);
    canvas.renderAll();
  });
};

const clearCanvas = (canvas) => {
  canvas.getObjects().forEach((obj) => {
    canvas.remove(obj);
  });
};

const exportData = (canvas) => {
  const data = canvas.getObjects().map((obj) => {
    const { cacheKey, height, width, scaleX, scaleY, top, left, angle } = obj;

    return {
      cacheKey,
      height: height * scaleY,
      width: width * scaleX,
      top,
      left,
      angle,
    };
  });

  //add canvas data
  const { height, width } = canvas;
  const canvasData = {
    cacheKey: BACKGROUND_CACHE_KEY,
    height,
    width,
  };
  data.push(canvasData);

  console.log({
    data,
  });
};

const CANVAS_ID = "canvas";
const QR_CODE_CACHE_KEY = "qr-code";
const BAR_CODE_CACHE_KEY = "bar-code";
const BACKGROUND_CACHE_KEY = "background";
const QR_CODE_URL = "./public/imgs/qr-code.png";
const BAR_CODE_URL = "./public/imgs/bar-code.png";

const inputFile = document.getElementById("background-upload");
const qrCodeButton = document.getElementById("qr-code-btn");
const barCodeButton = document.getElementById("bar-code-btn");
const resetButton = document.getElementById("reset-btn");
const exportButton = document.getElementById("export-btn");

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

exportButton.addEventListener("click", () => {
  exportData(canvas);
});
