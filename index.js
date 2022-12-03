import WebSocket from "ws"
import chalk from "chalk"

const binanceWebSpotSocket = "wss://stream.binance.com:443/stream?streams=btcusdt@depth/ethusdt@depth"

const ws = new WebSocket(binanceWebSpotSocket)
const d = {
  btc: {},
  eth: {}
}

ws.on("open", function open() {
  console.log(chalk.green.underline("Connected to Binance Websocket."))
})

ws.on("message", function incoming(raw) {
  const buffer = Buffer.from(raw)
  const data = JSON.parse(buffer.toString()).data

  if (data.s === "BTCUSDT") {
    d.btc = data
  } else if (data.s === "ETHUSDT") {
    d.eth = data
  }
  // console.log("Data: ", data.b.length)

  console.clear()
  console.log(chalk.bgYellowBright.black("\n\t\t\t\t\t\t   B I N A N C E   D E P T H   C H A R T   \t\t\t\t\t\t\n"))
  console.log(
    chalk
      .hex("#000000")
      .bgWhiteBright("\t\t\t\t_BTC_\t\t\t\t\t\t\t\t_ETH_")
  )
  console.log(
    chalk.green("\t\t   Buy\t\t"),
    chalk.red("\t\tSell\t\t\t"),
    chalk.green("\tBuy\t\t"),
    chalk.red("\t\tSell")
  )
  console.log(
    chalk.green("\t  Price\t     Quantity\t"),
    chalk.red("\t  Price\t     Quantity\t"),
    chalk.green("\t  Price      Quantity\t"),
    chalk.red("\t  Price      Quantity")
  )
  const btcLength = d.btc.b?.length < d.btc.a?.length ? d.btc.b?.length : d.btc.a?.length
  const ethLength = d.eth.b?.length < d.eth.a?.length ? d.eth.b?.length : d.eth.a?.length
  const length = btcLength < ethLength ? btcLength : ethLength
  for (let i = 0; i < length - 1; i++) {
    console.log(
      chalk.green("\t" + Number(d.btc.b[i][0])?.toFixed(2) + "   ", d.btc.b[i][1], "     "),
      chalk.red("\t" + Number(d.btc.a[i][0])?.toFixed(2) + "   ", d.btc.a[i][1], "     "),
      chalk.green("\t" + Number(d.eth.b[i][0])?.toFixed(2), "   ", d.eth.b[i][1], "     "),
      chalk.red("\t" + Number(d.eth.a[i][0])?.toFixed(2), "   ", d.eth.a[i][1])
    )
  }
})

ws.on("close", function close() {
  console.log(chalk.red.underline("Binance WebSocket closed."))
})

ws.on("error", error => {
  console.log(chalk.red.underline("Binance WebSocket error: " + error?.message))
})
