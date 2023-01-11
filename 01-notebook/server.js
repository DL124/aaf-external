var http = require('http');
var url = require('url');
var querystring = require('querystring');
var escape_html = require('escape-html');
var serveStatic = require('serve-static');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('notes.sqlite');


// Serve up public folder 
var servePublic = serveStatic('public', {
  'index': false
});
 
function renderNotes(req, res) {
    db.all("SELECT rowid AS id, text FROM notes", function(err, rows) {
        if (err) {
            res.end('<h1>Error: ' + err + '</h1>');
            return;
        }
        res.write('<link rel="stylesheet" href="style.css">' +
                  '<h1>AAF Notebook</h1>' +
                  '<form method="POST" action="create">' +
                  '<label>Note: <input name="note" value=""></label>' +
                  '<button>Add</button>' +
                  '</form>');
        res.write('<ul class="notes">');
        rows.forEach(function (row) {
            res.write('<li>' + escape_html(row.text));
            res.write('<form action="/delete" method="POST">' + `<input type="hidden" name="deleteNote" value="${row.id}"/>` + '<button class="button">Delete</button>' + '</form>' + '</li>')
        });
        res.end('</ul>');
    });
}

var server = http.createServer(function (req, res) {
    servePublic(req, res, function () {
        if (req.method == 'GET') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            renderNotes(req, res);
        }
        else if (req.method == 'POST' && req.url == '/create') {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                var form = querystring.parse(body);
                var query = db.prepare('INSERT INTO notes (text) VALUES (?)');
            
                query.run(form.note, function(err) {
                    console.error(err)
                    res.writeHead(201, {'Content-Type': 'text/html'});
                    renderNotes(req, res);
                })
                query.finalize();
            });
        } else if (req.method == 'POST' && req.url == '/delete') {
            
            var body = '';
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                var form = querystring.parse(body);
            db.exec('DELETE FROM notes WHERE rowid="' + form.deleteNote + '"', function (err) {
                console.error(err);
                res.writeHead(201, {'Content-Type': 'text/html'});
                renderNotes(req, res);
            });
        });
          
               
    }
});
});

// initialize database and start the server
db.on('open', function () {
    db.run("CREATE TABLE notes (text TEXT)", function (err) {
        console.log('Server running at http://127.0.0.1:8080/');
        server.listen(8080);
    });
}); 