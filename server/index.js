const { google } = require('googleapis');
const credentials = require('./nmural.json');
const express = require("express")
const fs = require('fs');
const axios = require("axios")
const FormData = require('form-data');
const app = express();
const cors = require("cors")
app.use(express.json())
app.use(cors())
var sheetID = '1Ax1MiJe1BGfHK9DhTZ-8BlEmNMYfb4yoB9KBXZ6Mqhw';
var contract = '0x04a119a53a68f8ad7bc9453d9b0a84cf34a20bf3'

const client = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

let config = {
  headers: {
    Authorization: "5ae0b683-6e6f-458b-bd91-1f601f3c24c5",
  }
}

app.post("/getGSheetData", async (resss,reqq,next)=>{
    var lst= await client.authorize(async (err) => {
        if (err) return console.log(`Error during authentication: ${err}`);
        const sheets = google.sheets({ version: 'v4', auth: client });
        var lsst = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetID,
          range: 'A1:Z',
        }, (err, res) => {
          if (err) return console.log(`The API returned an error: ${err}`);
          const rows = res.data.values;
          var lastele = rows[rows.length -1];
          console.log(lastele);
          reqq.send({arr: lastele,value:rows.length-1})
        });
      });
})

app.post("/mintNFT", async (req,res,next)=>{
  try{
    const form = new FormData();
    const fileStream = fs.createReadStream("../src/images/"+req.body.value+".jpg");
    form.append('file', fileStream);
    var request = await axios.post("https://api.nftport.xyz/v0/files", form, config)
    console.log(request.data)
    var metadata = {
      "name":req.body.name,
      "description":"Cute Neural Painting of"+req.body.name,
      "file_url": request.data.ipfs_url
    }
    var metareq = await axios.post("https://api.nftport.xyz/v0/metadata", metadata, config)
    var NewMeata = {
      "chain": "goerli",
      "contract_address": "0x39AE75fb377Fe96fDd5FC150bb559bBFa33bE584",
      "metadata_uri": metareq.data.metadata_uri,
      "mint_to_address": req.body.toaddress
    }
    var mintNFT = await axios.post('https://api.nftport.xyz/v0/mints/customizable',NewMeata, config)
    console.log(mintNFT.data);
    res.send({data: mintNFT.data})
  }catch(err)
  {
    console.log("Error");
    console.log(err.data);
    res.send({data: "error"})
  }
})

app.post("/deployNFT", async (req,res,next)=>{
  var datass = {
    "chain":"goerli",
    "name":"Neural Mural",
    "symbol":"NLM",
    "owner_address":"0xD4E4cbd23a0D2a4B4E4a23bb5CbED205d72f67EC",
    "metadata_updatable":true
  }
  var metareq = await axios.post("https://api.nftport.xyz/v0/contracts", datass, config)
  console.log(metareq)
  res.send({constract: metareq})
})

app.listen(4030, ()=>{
    console.log("Server Started at 4030")
})