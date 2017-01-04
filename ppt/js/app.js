(function (){
	router();
	function router() { 
		var path = location.hash.replace(/#([^#]*)(#.*)?/, './$1');

		// default page if hash is empty
		if (location.pathname === "/index.html") {
			path = location.pathname.replace("index.html", "docs/test.html");
		} else if (path === "") {
			path = location.pathname + "docs/test.html";
		} else if (path === "") {
			path = location.pathname + "./docs/test.html";
		}else {
			path = path + ".html";
		}
	
		getURL(path, function(err, code) {
			if (err) throw new Error("Request for ecmascript.json: " + err);
	
			document.body.querySelector( '.slides' ).innerHTML=code;
			Reveal.initialize({
				history: false,

				// More info https://github.com/hakimel/reveal.js#dependencies
				dependencies: [
					{ src: 'plugin/notes/notes.js', async: true },
					{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
				]
			});
	
			var codeNodes = Array.prototype.slice.call( document.querySelectorAll( 'code' ) );
			codeNodes.forEach( function( el ) { 
					el.addEventListener( "click", codeClick, false ); 		
				} 
			);

		});
	}
	
	var delay;
	
	document.body.querySelector( '#close' ).addEventListener( 'click', function( event ) {
			document.body.querySelector(".slide-menu").classList.remove( 'active' );
			document.body.querySelector(".slide-menu-overlay").classList.remove( 'active' );
		}, false );
		
	function codeClick(event){
		document.body.querySelector(".slide-menu").classList.add( 'active' );
		document.body.querySelector(".slide-menu-overlay").classList.add( 'active' );
				
		window.editor = window.editor || CodeMirror(document.getElementById("code"), {
													lineNumbers: true,
													mode: "javascript",
											});
		window.editor.getDoc().setValue(this.innerHTML); 
		window.editor.on("change", function() {
			clearTimeout(delay);
			delay = setTimeout(updatePreview, 300);
		});

		setTimeout(updatePreview, 300);
	}

	function updatePreview() {
        var previewFrame = document.getElementById('preview');
        var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
        preview.open();
		
		var s1 = '<!doctype html><html><head><meta charset=utf-8></head><body style="background-color:black;"><script>'+
		'window.con=document.createElement("div");'+
		'console.log=function(msg){'+
		'window.con.style.padding="5px";'+
		'window.con.style.color="white";'+
		'document.body.appendChild(window.con);'+
		'window.con.innerHTML+="<pre>"+JSON.stringify(msg,null,5)+"</pre>";'+
		'};';
		var s2 = '</script></body></html>';
        preview.write(s1+editor.getValue()+s2);
        preview.close();
     }	
	 
	 function getURL(url, c) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);
		xhr.send();
		xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status < 400) return c(null, xhr.responseText);
		var e = new Error(xhr.responseText || "No response");
		e.status = xhr.status;
		c(e);
		};
	}
	
	
})();



