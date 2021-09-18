function devmain(next_results){
	let params = '';
  params = next_results;
  let dataArray = [];
  let idArray = [];
  let judge = 'NO';
  let dev_id =  PropertiesService.getScriptProperties().getProperty('dev_id');

	while(true){
		  const api = getTwitterService();
      let req_url = "https://api.twitter.com/1.1/search/tweets.json?" + params + "&count=100&lang=ja&tweet_mode=extended&result_type=recent";
      console.log(req_url);
		  const data = api.fetch(req_url);
		  const jsonObj = JSON.parse(data);
      console.log(jsonObj);

		  for(let i=0;i<jsonObj.statuses.length;i++){
		      let content = jsonObj.statuses[i];
          let video_link = '';
          let expanded_url = '';
          let photo = '';
          let text = content.full_text;
          let user_name = content.user.name;
          let source = content.source.replace(/(<([^>]+)>)/gi, '');

          if(content.retweeted_status || content.possibily_sensitive || user_name.includes("オトク情報館") || user_name.includes("LOQUY広報部") || user_name.includes("BIGLOBE") || user_name.includes("im_fine0829") || user_name.includes("テルル") || user_name.includes("スマホ、モバイルブログ") || user_name.includes("モバワン") || user_name.includes("かたづけ") || user_name.includes("舞台DVD")|| user_name.includes("店") || user_name.includes("user_name") || user_name.includes("horo")　|| user_name.includes("まだショップで買ってるの？") || user_name.includes("Bot") || user_name.includes("bot") || source === "Botbird tweets" || source === "twittbot.net" || source === "SocialDog for Twitter" || source === "Twitter for Advertisers" || source === "格安SIM比較ウェブ" || source === "Tweetbot for Mac" || source === "Tweetbot for iΟS"　|| source === "WordPress.com"　|| user_name.includes("おすすめセレクション") || user_name.includes("インターネット回線研究所")){
            //console.log(content.user.name,text);
            //console.log(content.retweeted_status);
            update(content.retweeted_status);
		      }else{
            //スクリーンネーム
            let screen_name = content.user.screen_name;
            //ツイートID
		        let tweet_id = content.id_str;
            //投稿日付
		        let created_date = new Date(content.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC"));
            //投稿時間
            let hour = ("0"+created_date.getHours()).slice(-2);
            let minutes = ("0"+created_date.getMinutes()).slice(-2);
            let created_time = `${hour}:${minutes}`;  
            //フォロワー数
            let followers_count = content.user.followers_count;
            //いいね数
            let favorite_count = content.retweet_count;
            //リツイート数
            let retweet_count = content.retweet_count;
            //ツイート元URL
            let tweet_link = `https://twitter.com/${screen_name}/status/${tweet_id}`;

            user_name = `=HYPERLINK(\"${tweet_link}\",\"${user_name}\")`;

            //フルパスの取得
            if(content.entities.urls === undefined){
              console.log("expanded_urlはありません");
            }else{
              let urls = content.entities.urls;
              for(let i=0; i<urls.length; i++){
                expanded_url += `${urls[i].expanded_url} `;
              }
            }


            //URL置換セクション

            //URLをdisplay_urlに置換
            if(content.entities.urls === undefined){
              //console.log("urlsはありません");
            }else{
              let urls = content.entities.urls;
              for(let i=0;i<urls.length;i++){
                text = text.replace(urls[i].url,urls[i].display_url);
              }
            }

            //画像URL取得&display_urlに置換
            if(content.extended_entities === undefined){
              //console.log("extended_entitiesはありません");
            }else{
              let media = content.extended_entities.media;
              for(let i=0;i<media.length;i++){
                text = text.replace(media[i].url,media[i].display_url);
              }

              photo = "=image(\"" + media[0].media_url_https + "\")"

              // for(let i=0;i<media.length;i++){
              //   photo += `${media[i].media_url_https} `;
              // }
            }

            //動画URL取得&display_urlに置換
            if(content.extended_entities === undefined){
              //console.log("extended_entitiesはありません");
            }else{
              if(content.extended_entities.media[0].video_info === undefined){
                //console.log("video_infoはありません");
              }else{
                let video_info = content.extended_entities.media[0].video_info.variants;

                for(let i=0;i<video_info.length;i++){
                  if(video_info[i].content_type　=== "video/mp4"){
                    video_link = video_info[i].url;

                    break;
                  }
                }
              }
            }

            let judge_id = tweet_id;
            //これツイート消されたら参照できなくなるので、違うやり方考えた方がいい
            if(judge_id <= dev_id){
              Logger.log("前回まで遡りました");
              judge = 'YES';
              Logger.log(judge);

              break;
            }
		        //配列へ格納
            dataArray.push([created_date,created_time,user_name,text,photo,video_link,expanded_url,retweet_count,favorite_count,followers_count,source,tweet_id]);
            idArray.push(tweet_id);
		      }
		  }

		let nextResult = jsonObj.search_metadata.next_results;
    console.log(`nextResult: ${nextResult}`);

    if(!nextResult || judge === 'YES'){
        Logger.log("終了しました");
        if(dataArray.length !== 0){
          console.log(dataArray);
          writeSheetMegeTest(dataArray);
          setScriptProperty(idArray[0]);
          console.log(idArray[0],typeof(idArray[0]));
        }
        //removeDouble;
        break;
    }

    params = nextResult;
	}
}

function start_devmain(){
  devmain("q=biglobe%20%28donedone%20OR%20ビッグローブ%20OR%20モバイル%20OR%20契約%20OR%20sim%20OR%20光%20OR%20解約%20OR%20モバイ%20OR%20解約%20OR%20エンタメフリ%20OR%20MNP%20OR%20メール%20OR%20サービス%20OR%20工事%20OR%20被害%20OR%20遅い%20OR%20繋がらない%20OR%20モバイル%20OR%20遅い%20OR%20ネットワーク%20OR%20引き止め%20OR%20解約チャレンジ%20OR%20アプリ%20OR%20メール%20OR%20wifi%20OR%20セキュリティ%20OR%20電話%20OR%20でんわ%20OR%20ひかり電話%20OR%20電気%20OR%20でんき%20OR%20光テレビ%29%20-%28from%3ABIGLOBE%20OR%20from%3Ashunkannews%29%20-%22BIGLOBEニュース%22-%22news.biglobe.ne.jp%22");
}

//いいね数などを更新
function update(retweeted_status){
  if(retweeted_status !== undefined){
    let sheet_name = PropertiesService.getScriptProperties().getProperty('sheet_name');
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
    let lastRow = sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得
    let retweeted_id = retweeted_status.id_str;
    for(let i=1;i<=lastRow;i++){
      if(sheet.getRange(i,12).getValue() === retweeted_id){
        console.log(i);
        //フォロワー数の更新
        sheet.getRange(i,10).setValue(retweeted_status.user.followers_count);
        //いいね数の更新
        sheet.getRange(i,9).setValue(retweeted_status.favorite_count);
        //リツイート数
        sheet.getRange(i,8).setValue(retweeted_status.retweet_count);
      }
    }
  }
} 

//スプレッドシートへアップロード
function writeSheetMegeTest(dataArray){
  console.log("スプレッドシートへアップロード開始");
  let sheet_name = PropertiesService.getScriptProperties().getProperty('sheet_name');
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  let values = dataArray;
  const numRows = values.length;
  const numColumns = values[0].length;
  console.log(numRows,numColumns);
  sheet.insertRows(2,numRows);
  sheet.getRange(2, 1, numRows, numColumns).setValues(values);

}

//TweetIDの保存
function setScriptProperty(id) {
  let set_id = id;
  if(set_id !== undefined){
    PropertiesService.getScriptProperties().setProperty('dev_id',set_id);
    let value =  PropertiesService.getScriptProperties().getProperty('dev_id');
    Logger.log(value);
  }
}