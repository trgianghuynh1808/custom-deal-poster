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
  curFile = file;
  reader.readAsDataURL(file);
};

const formatImgObject = (img, canvas, scale) => {
  const canvasCenter = canvas.getCenter();

  img.scale(scale).set("flipX", true);
  img.left = canvasCenter.left;
  img.top = canvasCenter.top;
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

const callGenerateVoucherAPI = (qrConfigData, barConfigData) => {
  const query = `
  mutation($file: Upload!, $configs: GENERATE_VOUCHER_CONFIGS!){
    generate_voucher(file: $file, configs:$configs)
  }
`;

  const configs = {
    giftCode: giftCodeInput.value || "GIANGKUTE",
    qrConfig: {
      x: qrConfigData.left,
      y: qrConfigData.top,
      height: qrConfigData.height,
      width: qrConfigData.width,
    },
    barConfig: {
      x: barConfigData.left,
      y: barConfigData.top,
    },
  };

  let formData = new FormData();
  const operations = JSON.stringify({
    query,
    variables: { configs, file: null },
  });
  formData.append("operations", operations);

  const map = {
    0: ["variables.file"],
  };
  formData.append("map", JSON.stringify(map));
  formData.append("0", curFile);

  axios({
    url: "http://localhost:4002/graphql",
    method: "post",
    data: formData,
  })
    .then((response) => {
      const { data } = response.data;
      const url = data.generate_voucher;
      giftCodeInput.value = "";

      console.log({ url });
    })
    .catch((error) => {
      console.log({ error });
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

  const qrConfigData = data.find((item) => item.cacheKey === QR_CODE_CACHE_KEY);
  const barConfigData = data.find(
    (item) => item.cacheKey === BAR_CODE_CACHE_KEY
  );
  callGenerateVoucherAPI(qrConfigData, barConfigData);
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
const giftCodeInput = document.getElementById("gift-code-input");

const reader = new FileReader();
const canvas = initCanvas(CANVAS_ID);
let curFile = null;

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
  giftCodeInput.value = "";
});

exportButton.addEventListener("click", () => {
  exportData(canvas);
});
