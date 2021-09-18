//certification
let consumer_key =  PropertiesService.getScriptProperties().getProperty('consumer_key');
let consumer_secret =  PropertiesService.getScriptProperties().getProperty('consumer_secret');
let CONSUMER_KEY = consumer_key;
let CONSUMER_SECRET = consumer_secret;

function logAuthorizeUri() {
  let twitterService = getTwitterService();
  Logger.log(twitterService.authorize());
}

function getTwitterService() {
  return OAuth1.createService('Twitter')
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authenticate')
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)

      .setCallbackFunction('authCallback')

      .setPropertyStore(PropertiesService.getUserProperties());
}

function authCallback(request) {
  let twitterService = getTwitterService();

  let isAuthorized = twitterService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}