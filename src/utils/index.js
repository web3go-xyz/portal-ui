import { imgUpload } from "@/api/common";
import domtoimage from 'dom-to-image';
import { BigNumber } from "bignumber.js";

export function formatUrl(prefix, url) {
    if (url.indexOf('http') < 0) {
        let apiPrefix = prefix || '';
        if (apiPrefix) {
            if (apiPrefix.endsWith('/')) {
                apiPrefix = apiPrefix.substr(0, apiPrefix.length - 1);
            }
            return apiPrefix + url;
        }
    }
    return url;
}

// 数字千分位分隔显示
export function numberSplit(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
}
//使用递归的方式实现数组、对象的深拷贝
export function deepClone(obj) {
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    var objClone = Array.isArray(obj) ? [] : {};
    //进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
export const KSM_RATIO = 1000 * 1000 * 1000 * 1000;
export const DOT_RATIO = 1000 * 1000 * 1000 * 10;

export function formatToken(amount, tokenRatio, precision) {
    if (tokenRatio == undefined) {
        console.error('tokenRatio undefined');
    }
    let tokenRatio_formated = tokenRatio || DOT_RATIO;
    let amountFormated = new BigNumber(amount).div(
        new BigNumber(tokenRatio_formated)
    );

    let precision_format = precision || 2;
    amountFormated = amountFormated.toFormat(precision_format);
    return amountFormated;
}
export function formatTokenNumber(amount, tokenRatio, precision) {
    if (tokenRatio == undefined) {
        console.error('tokenRatio undefined');
    }

    let tokenRatio_formated = tokenRatio || DOT_RATIO;
    let amountFormated = new BigNumber(amount).div(
        new BigNumber(tokenRatio_formated)
    );
    let precision_format = precision || 2;
    amountFormated = amountFormated.toFixed(precision_format);
    return Number(amountFormated);
}

export function formatedDisplay4CrowdloanKSM(value, kRangeForced) {
    return formatedDisplay4CrowdloanToken(value, kRangeForced, KSM_RATIO);
}
export function formatedDisplay4CrowdloanDOT(value, kRangeForced) {
    return formatedDisplay4CrowdloanToken(value, kRangeForced, DOT_RATIO);
}
export function formatedDisplay4CrowdloanToken(value, kRangeForced, tokenRatio) {
    if (tokenRatio == undefined) {
        console.error('tokenRatio undefined');
    }

    let formatedCap = value;
    let mRange = 1000000;
    let kRange = 1000;
    let precision_cap = 1;
    formatedCap = formatedCap / tokenRatio;
    if (kRangeForced) {
        let result = +(formatedCap / kRange).toFixed(precision_cap).toString();
        //console.log('formatedDisplay4CrowdloanToken:', result);
        return result;
    }
    if (formatedCap >= mRange) {
        precision_cap = 2;
        formatedCap = +(formatedCap / mRange).toFixed(precision_cap).toString() + "M";
    } else if (formatedCap >= kRange) {
        precision_cap = 2;
        formatedCap = +(formatedCap / kRange).toFixed(precision_cap).toString() + "K";
    } else {
        precision_cap = 1;
        formatedCap = +(formatedCap).toFixed(precision_cap).toString();
    }
    return formatedCap;
}
export function html2Img(el, transferSuccessFn) {
    return new Promise((resolve, reject) => {
        domtoimage.toPng(el)
            .then((dataUrl) => {
                const canvas1 = document.createElement("canvas");
                // const canvas1 = document.getElementById("myCanvas");
                // 设置宽高
                canvas1.width = el.offsetWidth; //注意：没有单位
                canvas1.height = el.offsetHeight; //注意：没有单位
                const initalImg = new Image();
                initalImg.src = dataUrl; //由于图片异步加载，一定要等initalImg加载好，再设置src属性
                initalImg.onload = () => {
                    const iconImg = new Image();
                    iconImg.src = require("@/assets/logo.png");
                    iconImg.onload = () => {
                        const ctx = canvas1.getContext("2d");
                        // 绘制图片
                        ctx.drawImage(initalImg, 0, 0);
                        //水印文字添加
                        // ctx.font = "14px Calibri";
                        // ctx.fillStyle = "rgba(0,0,0,0.8)";
                        // ctx.fillText("水印文字", 0, 14);
                        // 绘制水印
                        ctx.globalAlpha = 0.2;
                        ctx.drawImage(iconImg, 0, el.offsetHeight - 144, 412, 144);
                        if (transferSuccessFn) {
                            transferSuccessFn();
                        }
                        canvas1.toBlob((blob) => {
                            // 上传图片
                            let file2 = new File([blob], "a.png", { type: "image/png" });
                            const formData = new FormData();
                            formData.append("file", file2);
                            imgUpload(formData).then((d) => {
                                resolve({
                                    address: `https://web3go.xyz/img/${d}`,
                                    base64: canvas1.toDataURL(),
                                });
                            });
                        });
                    };
                };
            });
    });
}
export function share(jumpUrl, imgUrl, title) {
    let metaArr = [
        "twitter:card",
        "summary_large_image",
        "twitter:site",
        "https://web3go.xyz",
        "twitter:url",
        jumpUrl,
        "twitter:title",
        title,
        "twitter:image",
        imgUrl,
    ];

    let metaParams = metaArr.toString();
    console.log("\r\noriginal metaParams:\r\n");
    console.log(metaParams);
    // 需要encode两次 因为浏览器会自动decode一次，另一次是服务端会decode

    metaParams = encodeURIComponent(encodeURIComponent(metaParams));

    let backInterfaceUrl = `https://web3go.xyz/portal/twittershare?meta=${metaParams}`;
    let fullUrl = `https://twitter.com/share?text=${title}&url=${backInterfaceUrl}`;
    window.open(fullUrl);
}
export function downloadFile(data, filename) {
    const save_link = document.createElement("a");
    save_link.href = data;
    save_link.download = filename;
    save_link.click();
}
export default {
    formatToken,
    formatTokenNumber,
    formatedDisplay4CrowdloanKSM,
    formatedDisplay4CrowdloanDOT,
    deepClone,
    numberSplit,
    html2Img,
    share,
    downloadFile,
    formatUrl,
    KSM_RATIO,
    DOT_RATIO
}