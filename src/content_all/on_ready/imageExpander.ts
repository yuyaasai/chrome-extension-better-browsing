/* 画像拡大 */
export default (window: Window) => {
    if (/\.(?:jpe?g|png|gif|bmp|webp|avif)$/i.test(window.location.pathname)) {
        const body = window.document.body
        body.style.background = "#222"
        body.style.textAlign = "center"
        const img = body.getElementsByTagName("img")[0]
        /* cssのobject-fit使えばよくなったのでonResizeの処理は不要
        const imgRatio = img.height / img.width;
        const onResize = () => {
            if (imgRatio < window.innerHeight / window.innerWidth) {
                img.style.width = "100%";
                img.style.height = "auto";
            } else {
                img.style.width = "auto";
                img.style.height = "100%";
            }
        onResize();
        window.onresize = onResize;
        }; */
        img.style.width = "100%"
        img.style.height = "100%"
        img.style.objectFit = "contain"
    }
}
