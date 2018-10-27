const FIRST_CLASS_LOW_WEIGHT_PRICE = 2.66;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
    {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
    {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94}
]

const noBulgeString = "Package cannot be bulging when shipped."
const lengthAndGirthDescriptionString = `Length = The longest side of the parcel.
Girth = Measurement around the thickest part.`

function getPriorityShippingObj(weightLb, maxCost){
    return { shipMethodName:`${weightLb}Lb Priority mail with size/volume restrictions`
        , imgUrl: '../../../assets/imgs/others/own_all_and_priority_box.jpg'
        , description: `Package: Your own envelope/box or any "Priority Mail" box.
        
        Info: Cost varies by location. A flat rate is assumed by choosing the MAX shipping cost. It also assumes destination is USA only. "Added cost" is applied if package exceeds size conditions. To avoid "added cost", meet the conditions listed below.
        It may be cheaper to create ${weightLb} 'First class packages' instead. This is used for packages that are large and cannot fit in the flat rate envelope/box.
        
        Weight: Below or exactly ${weightLb}Lb, and above ${weightLb-1}Lb
        Size: Length + girth < 84 inches
        Volume: Less than or equal to 1ft*1ft*1ft (1 cubic ft)
        ${lengthAndGirthDescriptionString}
        `
        , isFlatRate: true
        , flatRatePrice: maxCost, ozPrice: null
    }
}

const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { shipMethodName:"First class"
        , imgUrl: '../../../assets/imgs/others/own_all.jpg'
        , description: `Package: Your own envelope/box.
        Info: Can't use USPS priority box.

        Weight: 16oz or less.

        Size: Maximum combined length and girth is 108 inches.

        ${lengthAndGirthDescriptionString}

        Price comparison with 'priority mail':
        'Priority mail' cost depends on location. If package exceeds certain size criteria, there is added cost. If it is shipping to worst location and there are no added costs due to size of package, the following comparisons can be made:
        2x 16oz 'First class' packages are cheaper than the max cost of '2Lb priority mail'.
        3x 16oz 'First class' packages are cheaper than the max cost of '3Lb priority mail'.

        However, priority may be cheaper if it is a good location.
        `
        , isFlatRate: false
        , flatRatePrice: null, ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},


    { shipMethodName:"Flat rate envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope.jpg'
        , description: `Package: "Flat rate envelope."

        Info: Not the same as "legal flat rate envelope" or "padded envelope".`
        , isFlatRate: true
        , flatRatePrice: 6.35, ozPrice: null },


    { shipMethodName:"Flat rate legal envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_legal.jpg'
        , description: `Package: "Flat rate envelope" with "legal flat rate enevelope" written in small prints.
        
        Info: Does not come with padding. Not the same as "flat rate envelope" or "padded envelope".`
        , isFlatRate: true
        , flatRatePrice: 6.65, ozPrice: null },


    { shipMethodName:"Flat rate padded envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_padded.jpg'
        , description: `Package: "Flat rate envelope" with bubble padding applied inside.
        
        Info: Not the same as "flat rate envelope" or "legal flat rate envelope".`
        , isFlatRate: true
        , flatRatePrice: 6.90, ozPrice: null },


    { shipMethodName:"Flat rate small box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_small.jpg'
        , description: `Package: "Small flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 6.85, ozPrice: null },


    { shipMethodName:"Flat rate medium box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_medium_all.jpg'
        , description: `Package: "Medium flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 12.45, ozPrice: null },


    { shipMethodName:"Flat rate large box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_large_all.jpg'
        , description: `Package: "Large flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 17.10, ozPrice: null },

    getPriorityShippingObj(2, 10.80),
    getPriorityShippingObj(3, 15.34)
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { shipMethodName:"tempFlatRateMethod"
        , description: "tempDescription"
        , isFlatRate: true
        , flatRatePrice: 999.99, ozPrice: null }
];

module.exports.getDefaultShipMethods = function getDefaultShipMethods(userId){
    let shipMethods = [];
    for(let obj of DEFAULT_USPS_SHIP_METHOD_LIST){
        let method = {userId: userId, shipCompanyName: "USPS", shipMethodName: obj.shipMethodName
        , imgUrl: obj.imgUrl, description: obj.description
        , isFlatRate: obj.isFlatRate
        , flatRatePrice: obj.flatRatePrice, ozPrice: obj.ozPrice}

        shipMethods.push(method);
    }
    for(let obj of DEFAULT_FEDEX_SHIP_METHOD_LIST){
        let method = {userId: userId, shipCompanyName: "FEDEX", shipMethodName: obj.shipMethodName
        , imgUrl: obj.imgUrl, description: obj.description
        , isFlatRate: obj.isFlatRate
        , flatRatePrice: obj.flatRatePrice, ozPrice: obj.ozPrice}

        shipMethods.push(method);
    }
    return shipMethods;
}