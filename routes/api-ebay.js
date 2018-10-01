const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request');

const parseString = require('xml2js').parseString;

function getXmlHeader(ebayKey){
    let xmlHeaders = {
        'X-EBAY-API-SITEID':'0',
        'X-EBAY-API-COMPATIBILITY-LEVEL':'967',
        'X-EBAY-API-CALL-NAME':'GetSellerList',
        'X-EBAY-API-IAF-TOKEN': `${ebayKey}`
    }
    return xmlHeaders;
}
function getXmlRequestBody(ebayUserName){
    let curDate = new Date();
    let pastDate = new Date();
    pastDate.setDate(curDate.getDate()-120);

    let curDateStr = curDate.toISOString();
    let pastDateStr = pastDate.toISOString();

    return `<?xml version="1.0" encoding="utf-8"?>
    <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">    
        <ErrorLanguage>en_US</ErrorLanguage>
        <WarningLevel>High</WarningLevel>
        <GranularityLevel>Coarse</GranularityLevel>
        <StartTimeFrom>${pastDateStr}</StartTimeFrom>
        <StartTimeTo>${curDateStr}</StartTimeTo>
        <UserID>${ebayUserName}</UserID>
        <IncludeVariations>true</IncludeVariations>
        <Pagination>
            <EntriesPerPage>100</EntriesPerPage>
        </Pagination>
        
        <OutputSelector>ItemID,Title,PictureDetails,Variations,SellingStatus</OutputSelector>
    </GetSellerListRequest>`;
}

function handleSellerListResponseErrMsg(res, sellerListResponse){
    let errors = sellerListResponse.Errors[0];
    let msg = 'SellerListResponse: ' + errors.LongMessage[0];
    res.json({success: false, msg: msg});
}

function handleValidJsonOfListings(res, sellerListResponse){
    let itemArray = sellerListResponse.ItemArray[0].Item;
    for(let item of itemArray){
        if(item.SellingStatus[0].ListingStatus[0] == 'Active'){
            if(item.Variations){
                let variations = item.Variations[0].Variation;
            }
        }
    }
}
    
function handleJsonOfListings(res, ebayKey, ebaySettings){
    let body = getXmlRequestBody(ebaySettings.ebayUserName);
    request({
        url: "https://api.ebay.com/ws/api.dll",
        method: "POST",
        headers: {
            "content-type": "application/xml",
            },
            headers: getXmlHeader(ebayKey),
            body: body
        }, 
        function (err, response, body){
            console.log(body)
            if(err) res.json({success: false, msg: err.message});
            else{
                parseString(body, function (err, result) {
                    let sellerListResponse = result.GetSellerListResponse;
                    if(err) res.json({success: false, msg: err});
                    else{
                        let ack = sellerListResponse.Ack[0];
                        if(ack === 'Success')
                            handleValidJsonOfListings(res, sellerListResponse);
                        else 
                            handleSellerListResponseErrMsg(res, sellerListResponse);
                    }
                });
            }
        });
}

router.post('/listings', (req, res, next) => {
    let userId = req.body.userId;
    User.getEbayKey(userId, (err, ebayKey) => {
        if(err) res.json({success: false, msg: err.message});
        else{
            User.getEbaySettings(userId, (err, ebaySettings) => {
                if(err) res.json({success: false, msg: err.message});
                else{
                    handleJsonOfListings(res, ebayKey, ebaySettings);
                }
            })
        }
    });
})

module.exports = router;