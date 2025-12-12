links = { "type": "@deprecated",
    "apk": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/portfolio-0.7.4.apk",
    "synode-gui": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/portfolio-synode-0.7.7.zip",
    "registry-central": "https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip"
}

function loadLinks(onRedirect) {
    fetch('res/redirection.json')
    .then(response => response.json())
    .then(data => {
        console.log('Redirecting:', data.redirect);
        fetch('res/' + data.redirect)
            .then(response => response.json())
            .then(data => {
                console.log("links:", data);
                onRedirect(data);
            })
            .catch(error => console.error('Error:', error));
    })
    .catch(error => {
        console.error('Error:', error);
        console.error('redirection.json example:', '{"redirect": "links-github.json"}');
        console.error('links-?.json example:', 'see res/links-github.json');
    });
}

function setHref(aid, linkname) {
    document.getElementById(aid).href = links[linkname];
}

function addZipImages(pid, images, title) {

    if (title) {
        let t = document.getElementById(title.id);
        t.textContent = title.text;
    }

    let p = document.getElementById(pid);

    
    Object.keys(images).forEach(imgk => {
        let i = document.createElement('b');
        i.classList.add('a', 'w3-padding-16', 'w3-text-indigo')
        i.textContent = '';

        let a = document.createElement('a');
        a.href = images[imgk];
        a.setAttribute('download', '');
        a.textContent = `💾 ${imgk}`;

        i.appendChild(a);
        p.appendChild(i);
    });
}