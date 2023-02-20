
# Resources

## Nasa elevation data

- about

https://www2.jpl.nasa.gov/srtm/dataprelimdescriptions.html#perspshaded

- download

https://dds.cr.usgs.gov/srtm/


- data format

from docs [SRTM30](https://dds.cr.usgs.gov/srtm/version2_1/SRTM30/srtm30_documentation.pdf):

~~~
The 8 files included for each tile in GTOPO30 are also present in SRTM30, using the
following extensions:

Extension Contents

------------- ------------

 DEM digital elevation model data

 HDR header file for DEM

 DMW world file

 STX statistics file

 PRJ projection information file

 GIF shaded relief image

 SRC source map

 SCH header file for source map

In addition several additional files are included using these extensions:

Extension Contents

------------- ------------
 DIF difference between SRTM30 and GTOPO30

 JPG color coded shaded relief image

 NUM number of valid point included in the 10x10 average

 STD standard deviation of the elevations used in the average


Further information on the contents and format of the files is provided below.

2.1 DEM File (.DEM) - Same as GTOPO30

The DEM is provided as 16-bit signed integer data in a simple binary raster. There
are no header or trailer bytes imbedded in the image. The data are stored in row
major order (all the data for row 1, followed by all the data for row 2, etc.).

2.2 Header File (.HDR) - Same as GTOPO30

The DEM header file is an ASCII text file containing size and coordinate information
for the DEM. The following keywords are used in the header file:

BYTEORDER byte order in which image pixel values are stored

 M = Motorola byte order (most significant byte first)

LAYOUT organization of the bands in the file

 BIL = band interleaved by line (note: the DEM is a single band image)

NROWS number of rows in the image

NCOLS number of columns in the image

NBANDS number of spectral bands in the image (1 for a DEM)

NBITS number of bits per pixel (16 for a DEM)

BANDROWBYTES number of bytes per band per row (twice the number of columns
 for a 16-bit DEM)

TOTALROWBYTES total number of bytes of data per row (twice the number of
 columns for a single band 16-bit DEM)

BANDGAPBYTES the number of bytes between bands in a BSQ format image
 (0 for a DEM)

NODATA value used for masking purposes

ULXMAP longitude of the center of the upper-left pixel (decimal degrees)

ULYMAP latitude of the center of the upper-left pixel (decimal degrees)

XDIM x dimension of a pixel in geographic units (decimal degrees)

YDIM y dimension of a pixel in geographic units (decimal degrees)

Example header file (W100N40.HDR):

BYTEORDER M

LAYOUT BIL

NROWS 6000

NCOLS 4800

NBANDS 1

NBITS 16

BANDROWBYTES 9600

TOTALROWBYTES 9600

BANDGAPBYTES 0

NODATA -9999

ULXMAP -99.99583333333334

ULYMAP 39.99583333333333

XDIM 0.00833333333333

YDIM 0.00833333333333
~~~
