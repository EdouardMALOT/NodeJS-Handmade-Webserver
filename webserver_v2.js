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


function fileReader(filepath){
    return new Promise( (resolved, rejected) => {
        fs.readFile(filepath, (error, data) => {
            if(!error) {
                resolved(data);
            }else{
                rejected(error);
            }
        });
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
        .then(fileReader)
        .then(data => { 
            res.writeHead(200, {'content-type' : contentType});
            res.end(data, 'utf-8');
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });
}

http.createServer(webserver).listen(3000, () => console.log('Server started (port:3000) !'));
