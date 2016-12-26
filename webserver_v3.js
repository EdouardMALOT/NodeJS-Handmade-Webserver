'use strict'
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpeg',
    '.png' : 'image/png'
}

function fileAccess(filepath){
    return new Promise( (resolved, rejected ) => {
        fs.access(filepath, fs.F_OK | fs.R_OK, (error) => {
            if(!error){
                resolved(filepath);
            }else{
                rejected(error);
            }
        });
    });
}


function StreamFile(filepath){
    return new Promise( (resolved, rejected) => {
        let fileStream = fs.createReadStream(filepath);

        fileStream.on('open', () => {   resolved(fileStream);  });
        fileStream.on('error', (error) => { rejected(error) });
    });
}




function webserver(req, res) {
    
    //Compute the route
    //-----------------
    let baseURI = url.parse(req.url);
    let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
    let contentType = mimes[path.extname(filepath)];

    //Render the page with Promise
    //----------------------------
    fileAccess(filepath)
        .then(StreamFile)
        .then( stream => { 
            res.writeHead(200, {'content-type' : contentType});
            stream.pipe(res);
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });
}

http.createServer(webserver).listen(3000, () => console.log('Server started (port:3000) !'));
