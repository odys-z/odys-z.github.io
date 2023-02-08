Nginx & Https
=============

Let's encrypt certificate expired
---------------------------------

- Add PPA, install Certbot  

::
    sudo apt-get update
    sudo apt-get install software-properties-common
    sudo add-apt-repository universe
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install certbot python-certbot-nginx
..

- update cert

::
    sudo certbot --nginx




