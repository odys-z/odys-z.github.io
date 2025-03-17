links = {
    "apk": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/app-release-0.7.0.4.apk",
    "synode-gui": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/jserv-album-0.7.0.zip",
    "registry-demo": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip"
}

function setHref(aid, linkname) {
    document.getElementById(aid).href = links[linkname];
}