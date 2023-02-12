const Moralis = require("moralis").default
require('dotenv').config({path: './.env'})
const { EvmChain } = require('@moralisweb3/evm-utils') ;



// helper 
function removeDuplicates(arr) {
    return Array.from(new Set(arr));
  }


// main

async function main(startDate, endDate) {

    let numberIncomingTxs = 0;
    let uniqueWalletAddresses = []

    try {
        const walletAddress = process.env.MORALIS_API_KEY;
    
        const chain = EvmChain.ETHEREUM;
    
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
            // ...and any other configuration
        });
    
        let cursor = null;

        do {
            const response = await Moralis.EvmApi.transaction.getWalletTransactions({
                address: walletAddress,
                chain: 0x1,
                fromDate: startDate,
                toDate: endDate,
                cursor: cursor
            });


            

        for(let i=0; i<response.result.length; i++) {
            
            const toAddress = response.result[i]._data.to._value
            const fromAddress = response.result[i]._data.from._value

            if (toAddress == "0xCac0F1A06D3f02397Cfb6D7077321d73b504916e") {

                numberIncomingTxs++;
                uniqueWalletAddresses.push(fromAddress)
            }
        }

        


        cursor = response.data.cursor;
        } while (cursor != null && cursor !="")
        
        uniqueWalletAddresses = removeDuplicates(uniqueWalletAddresses)
        console.log("start date:", startDate)
        console.log("end date:", endDate)
        console.log("numberIncomingTxs: ", numberIncomingTxs)
        console.log("uniqueWalletAddresses number: ", uniqueWalletAddresses.length, "\n")

    } catch (e) {
        console.error(e);
    }
}

async function executeMain() {

    let arrStartDates = ["2022-08-01", "2022-09-01", "2022-10-01", "2022-11-01", "2022-12-01", "2023-01-01"]
    let arrEndDates = ["2022-09-01", "2022-10-01", "2022-11-01", "2022-12-01", "2023-01-01", "2023-02-01"]

    // for (let i=0; i<arrStartDates.length; i++) {
        await main("2022-08-01", "2023-02-01")
    // }
}

try {
    executeMain()
} catch(e) {
    console.error(e)
}