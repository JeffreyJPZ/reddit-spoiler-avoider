module.exports = {
    launch: {
        headless: false,
        slowMo: 30,
        args: [
            `--disable-extensions-except=${__dirname + '/dist'}`,
            `--load-extension=${__dirname + '/dist'}`
        ]
    }
}