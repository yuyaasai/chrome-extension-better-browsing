export default {
    ignoreDomains: [
        "localhost", // デバッグで邪魔になる
        /^192\.168\./ // デバッグで邪魔になる
    ],
    ignoreUrls: [
    ],
    ignorePathnames: [
        /\.(?:png|jpe?g|bmp|webp|avif|pdf)$/
    ]
}
