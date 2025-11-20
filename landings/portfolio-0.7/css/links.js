links = {
    "apk": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/portfolio-0.7.4.apk",
    "synode-gui": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/portfolio-synode-0.7.7.zip",
    "registry-central": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip"
}

function setHref(aid, linkname) {
    document.getElementById(aid).href = links[linkname];
}