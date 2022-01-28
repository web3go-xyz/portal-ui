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



export default {
    formatToken,
    formatTokenNumber,

    formatUrl,
    KSM_RATIO,
    DOT_RATIO,

}