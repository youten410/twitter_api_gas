// checkProfile
// settingとdeleteの実行は注意。常にコメントアウトしておく。

function setting() {
  PropertiesService.getScriptProperties().setProperty('dev_id','1439286596235190277');
  let value =  PropertiesService.getScriptProperties().getProperty('dev_id');
  console.log(value);
}

function looking(){
  let value =  PropertiesService.getScriptProperties().getProperty('dev_id');
  Logger.log(value);
}

function deleteId(){
  PropertiesService.getScriptProperties().deleteProperty('dev_id');
}