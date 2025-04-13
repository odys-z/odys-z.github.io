links = {
    "apk": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/app-release.apk",
    "synode-gui": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/jserv-portfolio-0.7.1.zip",
    "registry-demo": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip"
}

function setHref(aid, linkname) {
    document.getElementById(aid).href = links[linkname];
}