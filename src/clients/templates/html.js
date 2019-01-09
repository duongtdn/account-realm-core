"use strict"

module.exports = ({title, data, script, dom}) => `
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
    <div id="root">${dom}</div>
    <script> var __data=${JSON.stringify(data)} </script>
    ${script? `<script type="text/javascript" src="${script}" ></script>` : ''}    
  </body>

</html>
`
