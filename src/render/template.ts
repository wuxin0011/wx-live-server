import { getIconBeforeClass } from "./files"

export const NotFound = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>
  <style>

  * {
    margin: 0;
    padding: 0;
  }

  html,body {
    height: 100vh;
    background:url("https://wuxin0011.github.io/fantasy/screen.png");
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    font-size:40px;
  }

</style>
</head>

<body>
  <h2>页面未找到！</h2>
</body>

</html>
`



export const Template = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>template</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        height: 100vh;
        background-color: #eee;
      }
      .unknown-file::before {
        content: '❓';
      }

      .folder::before{
        content: '👝';
      }

      .file::before{
        content: '🀄';
      }
      
      ${getIconBeforeClass()}
      a {
        text-decoration: none;
        cursor: pointer;
        color: #000;
        transition: all ease-in-out 0.3s;
      }
      a:hover {
        color: teal;
      }
      .container {
        display: flex;
        width: 75%;
        margin: 0 auto;
        margin-top: 100px;
        flex-wrap: wrap;
      }
      .container a {
        display: inline-block;
        margin: 10px;
        width: 150px;
        overflow:hidden;
        padding: 10px;
      }
    </style>
    
  </head>
  
  <body>
    <div class="container"></div>
  </body>
  </html>
  `



export const VideoTemplate = (src: string) => `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>template</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        height: 100vh;
        background-color: #eee;
      }
      .container {
        width: 75%;
        margin: 0 auto;
        margin-top: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    
  </head>
  
  <body>
    <div class="container">
      <video width="500" height="500" src="${src}" controls></video>
    </div>
  </body>
  </html>
  `
