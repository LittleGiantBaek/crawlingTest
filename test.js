const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const getHTML = async(url) => {
    try{
        return await axios.get(url);
    }catch(err){
        console.log(err);
    }
}
const parsingRefernce = async (keyword) => {
    const url = "https://www.inflearn.com/courses?s=" + keyword;
    const html = await getHTML(url);
    const $ = cheerio.load(html.data); // cheerio module이 html을 파싱하여 node 형식으로 만들어줌.
    // reference code ( 출처: https://www.youtube.com/watch?v=xbehh8lWy_A )
    const $courseList = $(".course_card_item");
    
    let courses = [];
    $courseList.each((idx, node) => { // courseList node의 child node를 순회하며 정보를 추출
        console.log($(node));
        courses.push({
            title: title = $(node).find(".card-content > .course_title").text(),
            instructor: $(node).find(".instructor").text(),
            price: $(node).find(".price").text(),
            rating: $(node).find(".star_solid").css("width"),
            img: $(node).find(".card-image > figure > img").attr("src")
        })
    });
    console.log(courses);
}

const parsingKeyword = async (keyword) => {
    const url = "https://finance.naver.com/item/main.nhn?code=" + keyword;
    const html = await getHTML(url); // url에 따른 전체 html 데이터 수집
    // const decodedHTML = iconv.decode(html.data.toString('binary'),"utf-8"); 받아온 한글이 깨지는 현상 발생0
    // console.log(decodedHTML);
    // console.log(html);
    
    const $ = cheerio.load(html.data); // cheerio module이 html을 파싱하여 node 형식으로 만들어줌.
    

    const $chartarea = $("#chart_area");
    const data = () => {
        const obj = {};
        const $chartarea = $("#chart_area");
        const currentPrice = $chartarea.find("div.rate_info > div.today > p.no_today > .no_up").children("span")[0].children[0].data;
        const netChange = $chartarea.find("div.rate_info > div.today > p.no_exday > .no_up:eq(0)").children("span")[1].children[0].data;
        const priceParentNode = $chartarea.find("div.rate_info > div.today > p.no_exday > .no_up:eq(1)").children();
        const changeRate = priceParentNode[0].children[0].data + priceParentNode[1].children[0].data + priceParentNode[priceParentNode.length-1].children[0].data;
        
        obj.currentPrice = currentPrice; 
        obj.netChange = netChange; 
        obj.changeRate = changeRate; 
        return obj;
    }

    let stockItemInfo = data();

    console.log(stockItemInfo);
}

// parsingRefernce("node");
parsingKeyword("205470");