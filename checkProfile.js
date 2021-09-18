//checkProfile
//settingとdeleteの実行は注意。常にコメントアウトしておく。

// function setting() {
//   PropertiesService.getScriptProperties().setProperty('sheet_name','biglobe');
//   let value =  PropertiesService.getScriptProperties().getProperty('sheet_name');
//   console.log(value);
// }



function looking(){
  let value =  PropertiesService.getScriptProperties().getProperty('sheet_name');
  Logger.log(value);
}

// function deleteId(){
//   PropertiesService.getScriptProperties().deleteProperty('dev_id');
// }