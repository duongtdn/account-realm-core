"use strict"

module.exports = ({title, script, dom}) => `
<!DOCTYPE html>
<html class="w3-light-grey">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">  
    <title>${title}</title>         
    <link rel="stylesheet" type="text/css" href="https://www.w3schools.com/w3css/4/w3.css">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>

  <body>    
    <div class="w3-bar w3-blue">
      <button id="sso" class="w3-bar-item w3-button"> SSO </button>
      <button id="lso" class="w3-bar-item w3-button"> LSO </button>
      <button id="signup" class="w3-bar-item w3-button"> Sign up</button>
      <button id="signin" class="w3-bar-item w3-button"> Sign in</button>
      <button id="signout" class="w3-bar-item w3-button"> Sign out</button>
    </div>
    <div id="root">${dom}</div>
    <script type="text/javascript" src="${script}" ></script>
  </body>

</html>
`
