.. _unity_to_godot:

..    references :
..    `Godot File Format - TSCN<https://docs.godotengine.org/en/latest/development/file_formats/tscn.html>`

Godot Tilemap Format
======================

Tilemap is a type of TSCN Node2D. For a TSCN Node description,
see `Godot Doc: TSCN File Format<https://docs.godotengine.org/en/latest/development/file_formats/tscn.html>`.

.. note::

   Data format here is try and figured out from TSCN file, only for resource handling
   in loader, not for implementation reference.

TileMap in TSCN file example:

::

    [ext_resource path="res://autoset.tres" type="TileSet" id=1]
    [ext_resource path="res://tset1.tres" type="TileSet" id=2]

    [node name="TileMap" type="TileMap" parent="."]
    visible = false
    scale = Vector2( 0.25, 0.25 )
    tile_set = ExtResource( 2 )
    cell_size = Vector2( 128, 128 )
    cell_quadrant_size = 8
    format = 1
    tile_data = PoolIntArray( 0, 1, 0, 1, 1073741824, 0, 2, 0, 0, 3, 1610612736, 0, 65536, 1, 0 )

tile_date
---------

TileMap is handled by

.. code-block:: cpp

    class TileMap : public Node2D { ... }

see GodotEngin/scene/2d/tile_map.h.

C struct for tile:

.. code-block:: cpp

    union PosKey {
        struct {
            int16_t x;
            int16_t y;
        };
        uint32_t key;
    };

    union Cell {
        struct {
            int32_t id : 24;
            bool flip_h : 1;
            bool flip_v : 1;
            bool transpose : 1;
            int16_t autotile_coord_x : 16;
            int16_t autotile_coord_y : 16;
        };

        uint64_t _u64t;
        Cell() { _u64t = 0; }
    };


A 1D 32 bits int array in decimal digital string.

.. image:: img/001-tilemap1.png
    :width: 800px

+------------------------------+-------------------------------------------------+----------------------------------------------------------------+
|         Node Data            |        Data Formatted                           |            Remarks                                             |
+==============================+=================================================+================================================================+
| tile_set = ExtResource( 2 )  |      ExtResource(2) = tset1.tres                |           Tileset                                              |
+------------------------------+-------------------------------------------------+----------------------------------------------------------------+
|   PoolIntArray[0:2]          |   0: [x: 0, y: 0] - PosKey                      |   Postion: x, y = 0, 0                                         |
| | 0, 1, 0                    | | 1: [id: 1]      - Cell.struct.id              | | Tileset's tile id: 1                                         |
|                              | | 0: [auto-x: 0, auto-y: 0] -C.struct.autox/y   | | Cell's auto tile id x, y = 0, 0                              |
+------------------------------+-------------------------------------------------+----------------------------------------------------------------+
|   PoolIntArray[3:5]          |   0: [x: 1, y: 0] - PosKey                      |   Postion: x, y = 1, 0                                         |
| | 1, 1073741824, 0           | | 1: [id: 0]      - Cell.struct.id              | | Tileset's tile id = 0  ( 1073741824 = 4000 0000h )           |
|                              | |    [fliph: 0, flipv: 1]                       | | flip (x/h, y/v) = 0, 1 ( Why not 04h? )                      |
|                              | | 0: [auto-x: 0, auto-y: 0]                     |                                                                |
+------------------------------+-------------------------------------------------+----------------------------------------------------------------+
| ...                          |   1610612736                                    |   6000 0000h: id, h, v = 0, 1, 1 ?                             |
|                              | | 65536                                         | | 65536: pos(x, y) = 0, 1                                      |
+------------------------------+-------------------------------------------------+----------------------------------------------------------------+
