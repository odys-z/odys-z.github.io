Issues
======

File Block Chain vs. SynStream
------------------------------

::

    May 26 2025

File block chain works will in Portolio 0.7.2 (Semantic.jserv 1.5.16, 
Semantic.DA 1.5.18), but the cons are using a lot of memory at server
side, as all blocks are buffered and updated to database, by semantics
*extfile*. Base 64 file content is committed like a database field. the
intended function, resume at breakpoint, is not implemented.

In May 2025, a new semantics, the DocRef stream, without database semantics
handler, only has Funcalls, is introduced to asynchronously upload file content
and synchronize files. SynssionClient and SynssionServ use this schema for
synchronize files asynchronously.

The pushBlock() schema is planned to replace stream uploading in the future
for breakpoint resumming.

If this object is the reply to client's Doclientier.pushBlock(), clients
can simultaneously upload files in streams mode.

DocRef Stream is used to resolve file reference, while file's json block chains
are used to transfere data. The only possible confliction is extfilev2 triggering
by semantics.DA handler and the DocRef is resolving by a Synode. Since Semantic.DA
1.5.18, ShExtFilev2, the handler, will ignore the field is the content is starting
with an envelope's beginning data::

    {\s*"type":

The Base64 string cannot has such characters like the curely brace ({), double
quotes (") or colon (:). 
