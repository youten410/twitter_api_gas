function createNewsheet() {
  let date = new Date;
  let year = date.getFullYear();
  let month = date.getMonth()+1;

  year = `${year}年`;

  if(month === 12){
    month = '1月';
  }else{
    month = `${month+1}月`;
  }

  let source = SpreadsheetApp.getActiveSpreadsheet();
  let active_sheet = source.getActiveSheet();
  let newCopySheet = active_sheet.copyTo(source);
  newCopySheet.setName(year+month);

  active_sheet = source.getSheetByName(year+month);
  active_sheet.activate();
  let sheet_name = active_sheet.getName();
  let last_row = active_sheet.getLastRow();
  active_sheet.deleteRows(2, last_row - 1);
  PropertiesService.getScriptProperties().setProperty('sheet_name',sheet_name);
  let value =  PropertiesService.getScriptProperties().getProperty('sheet_name');
  Logger.log(value);
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName());
  // PropertiesService.getScriptProperties().deleteProperty('sheet_name');
}