CAV SDK Resources
-----------------

The SDK
=======

A general purpose wearable camera for open access.

See `the wearable module presentation <https://odys-z.github.io/archive/market/imgs/CAV\ module.pdf>`_.

Sample Products
===============

Here is `a brief summary <https://odys-z.github.io/archive/market/cav-survey.html>`_.

References
==========

#. [Espressif] `SoCs Products Overview <https://www.espressif.com/en/products/socs>`_,

#. [ESP32 S2]

    * ESP32 S2 + Camera, Circuits & Source, `Github: wms2537/esp32s2-camera, ESP32S2 Camera + Websockets stream <https://github.com/wms2537/esp32s2-camera>`_

    .. raw:: html

        <p style="height:5em">
        <a href="https://github.com/wms2537/esp32s2-camera" >
        <img style="height:5em" src="https://github.com/wms2537/esp32s2-camera/raw/main/images/pcb.jpeg"/>
        <img style="height:5em" src="https://raw.githubusercontent.com/wms2537/esp32s2-camera/main/images/Schematic_ESP32S2CAM.png">
        </a>
        </p>
    ..
    
    * `ESP32 S2 mini-1/1U datasheet <https://www.espressif.com/sites/default/files/documentation/esp32-s2-mini-1_esp32-s2-mini-1u_datasheet_en.pdf>`_,

    ::

        GPIO, SPI, LCD, UART, I2C, I2S, Camera interface, IR, pulse counter, LED PWM, TWAI®
        (compatible with ISO 11898-1, i.e. CAN Specification 2.0), full-speed USB OTG, ADC,
        DAC, touch sensor, temperature sensor
        15.4 × 20.0 × 2.4 / 15.4 × 15.4 × 2.4
    
    * `Github: Research about the ESP32-S2 Camera Interface <https://gist.github.com/askpatrickw/0179d09e74d5f2a4347d5666ea937c4d>`_

    .. raw:: html

        <p style="height:5em">
        <a href="https://gist.github.com/askpatrickw/0179d09e74d5f2a4347d5666ea937c4d" >
        <img style="height:5em" src="https://user-images.githubusercontent.com/4002194/212280165-75d68f04-37dc-4334-a196-270e4212d141.png"/>
        </a>
        </p>
    ..

#. [Audio Module]

    * Reading SPL, `Microphone Sound Input Module Quickstart Guide <https://www.freetronics.com.au/pages/microphone-sound-input-module-quickstart-guide>`_

    .. image:: ./imgs/mic-pinout_large.webp
        :height: 5em
    
    * `Example of Speaker Amplifiers Connected to I2S, (QT Py) <http://www.technoblogy.com/show?4ECO>`_.

    .. image:: ./imgs/i2sspeaker.gif
        :height: 5em

#. [Vedio]

    * ArduCam, `OV2640 Specification <https://www.arducam.com/ov2640/>`_

    * Github, `ESP32 Camera Driver <https://github.com/espressif/esp32-camera>`_

      For ESP32, ESP32-S2, ESP32-S3, support OV2640, etc.
