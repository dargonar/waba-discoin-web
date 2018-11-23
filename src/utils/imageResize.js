//Extracted and adapted from Dropzone.js

const resize = (file, width, height, resizeMethod = "contain") => {
  let info = {
    srcX: 0,
    srcY: 0,
    srcWidth: file.width,
    srcHeight: file.height
  };

  let srcRatio = file.width / file.height;

  // Automatically calculate dimensions if not specified
  if (width == null && height == null) {
    width = info.srcWidth;
    height = info.srcHeight;
  } else if (width == null) {
    width = height * srcRatio;
  } else if (height == null) {
    height = width / srcRatio;
  }

  // Make sure images aren't upscaled
  width = Math.min(width, info.srcWidth);
  height = Math.min(height, info.srcHeight);

  let trgRatio = width / height;
  
  console.log(' imageResize.js ------------------ TARGET', 'trgRatio: ', trgRatio , 'width:', width, 'height:', height);

  if (info.srcWidth > width || info.srcHeight > height) {
    // Image is bigger and needs rescaling
    if (resizeMethod === "crop") {
      if (srcRatio > trgRatio) {
        info.srcHeight = file.height;
        info.srcWidth = info.srcHeight * trgRatio;
      } else {
        info.srcWidth = file.width;
        info.srcHeight = info.srcWidth / trgRatio;
      }
    } else if (resizeMethod === "contain") {
      // Method 'contain'
      console.log(' imageResize.js ------------------ ', 'srcRatio: ', srcRatio , 'trgRatio:', trgRatio);
      if (srcRatio > trgRatio) {
        height = width / srcRatio;
      } else {
        width = height * srcRatio;
      }
      console.log(' imageResize.js ------------------ ', 'height: ', height , 'width:', width);
    } else {
      throw new Error(`Unknown resizeMethod '${resizeMethod}'`);
    }
  }

  info.srcX = (file.width - info.srcWidth) / 2;
  info.srcY = (file.height - info.srcHeight) / 2;

  info.trgWidth = width;
  info.trgHeight = height;

  console.log(' imageResize.js ------------------ ', 'info: ', JSON.stringify(info));

  return info;
};

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
const detectVerticalSquash = img => {
  let iw = img.naturalWidth;
  let ih = img.naturalHeight;
  let canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  let { data } = ctx.getImageData(1, 0, 1, ih);

  // search image edge pixel position in case it is squashed vertically.
  let sy = 0;
  let ey = ih;
  let py = ih;
  while (py > sy) {
    let alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = (ey + sy) >> 1;
  }
  let ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

const drawImageIOSFix = (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) => {
  let vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

export const createThumbnailFromUrl = (file, width, height, callback) => {
  let fileReader = new FileReader();
  fileReader.onload = () => {
    file.dataURL = fileReader.result;
    let img = document.createElement("img");

    img.onload = () => {
      file.width = img.width;
      file.height = img.height;

      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      let resizeInfo = resize(file, width, height);

      canvas.width = resizeInfo.trgWidth;
      canvas.height = resizeInfo.trgHeight;

      // This is a bugfix for iOS' scaling bug.
      drawImageIOSFix(
        ctx,
        img,
        resizeInfo.srcX != null ? resizeInfo.srcX : 0,
        resizeInfo.srcY != null ? resizeInfo.srcY : 0,
        resizeInfo.srcWidth,
        resizeInfo.srcHeight,
        resizeInfo.trgX != null ? resizeInfo.trgX : 0,
        resizeInfo.trgY != null ? resizeInfo.trgY : 0,
        resizeInfo.trgWidth,
        resizeInfo.trgHeight
      );

      let thumbnail = canvas.toDataURL("image/png");

      if (callback != null) {
        return callback(thumbnail, canvas);
      }
    };

    if (callback != null) {
      img.onerror = callback;
    }

    return (img.src = file.dataURL);
  };

  return fileReader.readAsDataURL(file);
};

export const getMimetype = base64file => base64file.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

export const isAllowed = (base64file, allowedTypes) =>
  allowedTypes.length === 0 ? true : allowedTypes.indexOf(getMimetype(base64file)) !== -1;
