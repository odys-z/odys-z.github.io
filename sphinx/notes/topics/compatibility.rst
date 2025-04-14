Compatibility Issues
====================

H256 and the Codec Names
------------------------

Exiftool 12.69 parsed codec name for H256 is 'hvc1'.

::

    exiftool *.mp4
    ...
    Compressor ID                   : hvc1
    ...
    Compressor ID                   : avc1
        2 image files read

According to `FourCC.org, AVC1 <https://fourcc.org/avc1/>`_, *avc1* is 

::

    fourcc: AVC1
    AVC1 info
    Owner: Apple
    Apple's version of the MPEG4 part 10/H.264 standard apparently.

and no *hvc1*.

Grok::

    Why 'hvc1' Appears in Your Files

    Your exiftool output showing 'hvc1' indicates that the MP4 file was likely
    created or optimized for streaming or playback in environments expecting MP4
    compatibility (e.g., web browsers, mobile devices). This is consistent with
    the "Multimedia Cloud Transcode (cloud.baidu.com)" encoder you saw, which
    probably used 'hvc1' to ensure compatibility with modern players while
    leveraging H.265’s efficiency.

To convert codec

::
    
    ./ffmpeg -i 2024-07/010V\ mda-qc38bb8jwum66ied.mp4 -c:v libx264 -c:a aac "010V mda-qc38bb8jwum66ied.h264.mp4"

Tests shows Android 10 WebView cannot display 'hvc1'.

References:
___________

#. `Grok Answers <https://grok.com/share/bGVnYWN5_8a5396bb-d7df-4ee1-b517-58f5aa1fa564>`_
#. `FourCC.org <https://fourcc.org>`_
#. Information technology — Coding of audio-visual objects, Part 15: Carriage of network abstraction layer (NAL) unit structured video in the ISO base media file format, `ISO/IEC 14496-15:2024 <https://www.iso.org/standard/89118.html>`_
#. `FFMPEG <https://www.ffmpeg.org/download.html>`_
