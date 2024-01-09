module.exports = {
    launch: {
        headless: false,
        slowMo: 30,
        args: [
            `--disable-extensions-except=${__dirname}`,
            `--load-extension=${__dirname}`
        ]
    }
}