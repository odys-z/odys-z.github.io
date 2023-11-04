var pic;
function showFig(picurl) {
	//var pic = document.getElementById(divname);
	pic.style.display='block';
	pic.style.position = "fixed";
	pic.style.width = window.innerWidth * 0.9 + "px";
	//pic.style.height = h;
	pic.style.height = window.innerHeight + "px";
	pic.style.background= "rgba(125, 125, 125, 0.0) url('" + picurl + "') no-repeat";
	pic.style.backgroundPosition= "center";
}

function hide() {
	//var pic = document.getElementById(divname);
	pic.style.background = "";
	pic.style.display = 'none';
}


function initDiv(divname) {
	pic = document.getElementById(divname);
	pic.style.position = "fixed";
	pic.style.bottom = "5%";
	pic.style.display = 'none';
	pic.style.width = window.innerWidth + "px";
	pic.style.height = window.innerHeight + "px";
}
