Godot Node2D Loader
=====================

Node2D loader
-------------

In scene/2d/node_2d.h, Node2D is declared like:

.. code-block:: cpp

    class Node2D : public CanvasItem {

        GDCLASS(Node2D, CanvasItem);

        Point2 pos;
        float angle;
        Size2 _scale;
        int z_index;
        bool z_relative;

        Transform2D _mat;
        bool _xform_dirty;
        void _update_transform();
        void _update_xform_values();

    protected:
        static void _bind_methods();

    public:
        ...
    }
..

In scene/2d/node_2d.cpp:

.. code-block:: cpp

    void Node2D::_bind_methods() {

        ClassDB::bind_method(D_METHOD("set_position", "position"), &Node2D::set_position);
        ClassDB::bind_method(D_METHOD("set_rotation", "radians"), &Node2D::set_rotation);
        ClassDB::bind_method(D_METHOD("set_rotation_degrees", "degrees"), &Node2D::set_rotation_degrees);
        ClassDB::bind_method(D_METHOD("set_scale", "scale"), &Node2D::set_scale);

        ClassDB::bind_method(D_METHOD("rotate", "radians"), &Node2D::rotate);
        ...

        ClassDB::bind_method(D_METHOD("set_global_position", "position"), &Node2D::set_global_position);
        ClassDB::bind_method(D_METHOD("get_global_position"), &Node2D::get_global_position);
        ...

        ClassDB::bind_method(D_METHOD("set_transform", "xform"), &Node2D::set_transform);
        ...

        ADD_GROUP("Transform", "");
        ADD_PROPERTY(PropertyInfo(Variant::VECTOR2, "position"), "set_position", "get_position");
        ADD_PROPERTY(PropertyInfo(Variant::REAL, "rotation", PROPERTY_HINT_NONE, "", PROPERTY_USAGE_NOEDITOR), "set_rotation", "get_rotation");
        ...

        ADD_PROPERTY(PropertyInfo(Variant::VECTOR2, "global_position", PROPERTY_HINT_NONE, "", 0), "set_global_position", "get_global_position");
        ADD_PROPERTY(PropertyInfo(Variant::REAL, "global_rotation", PROPERTY_HINT_NONE, "", 0), "set_global_rotation", "get_global_rotation");
        ...

        ADD_GROUP("Z Index", "");
        ADD_PROPERTY(PropertyInfo(Variant::INT, "z_index", PROPERTY_HINT_RANGE, itos(VS::CANVAS_ITEM_Z_MIN) + "," + itos(VS::CANVAS_ITEM_Z_MAX) + ",1"), "set_z_index", "get_z_index");
        ADD_PROPERTY(PropertyInfo(Variant::BOOL, "z_as_relative"), "set_z_as_relative", "is_z_relative");
    }

..

This method can be a reference to find out tscn file's lexical token?


TileMap loader
--------------

In scene/2d/tilemap.cpp:

.. code-block:: cpp

    void TileMap::_bind_methods() {

        ClassDB::bind_method(D_METHOD("set_tileset", "tileset"), &TileMap::set_tileset);
        ClassDB::bind_method(D_METHOD("get_tileset"), &TileMap::get_tileset);

        ClassDB::bind_method(D_METHOD("set_mode", "mode"), &TileMap::set_mode);
        ClassDB::bind_method(D_METHOD("get_mode"), &TileMap::get_mode);
        ...

        ClassDB::bind_method(D_METHOD("set_cell", "x", "y", "tile", "flip_x", "flip_y", "transpose", "autotile_coord"), &TileMap::set_cell, DEFVAL(false), DEFVAL(false), DEFVAL(false), DEFVAL(Vector2()));
        ClassDB::bind_method(D_METHOD("set_cellv", "position", "tile", "flip_x", "flip_y", "transpose"), &TileMap::set_cellv, DEFVAL(false), DEFVAL(false), DEFVAL(false));
        ClassDB::bind_method(D_METHOD("_set_celld", "position", "data"), &TileMap::_set_celld);
        ClassDB::bind_method(D_METHOD("get_cell", "x", "y"), &TileMap::get_cell);
        ClassDB::bind_method(D_METHOD("get_cellv", "position"), &TileMap::get_cellv);
        ClassDB::bind_method(D_METHOD("is_cell_x_flipped", "x", "y"), &TileMap::is_cell_x_flipped);
        ClassDB::bind_method(D_METHOD("is_cell_y_flipped", "x", "y"), &TileMap::is_cell_y_flipped);
        ClassDB::bind_method(D_METHOD("is_cell_transposed", "x", "y"), &TileMap::is_cell_transposed);

        ClassDB::bind_method(D_METHOD("get_cell_autotile_coord", "x", "y"), &TileMap::get_cell_autotile_coord);
        ...

        ClassDB::bind_method(D_METHOD("_set_tile_data"), &TileMap::_set_tile_data);
        ClassDB::bind_method(D_METHOD("_get_tile_data"), &TileMap::_get_tile_data);

        ADD_PROPERTY(PropertyInfo(Variant::INT, "mode", PROPERTY_HINT_ENUM, "Square,Isometric,Custom"), "set_mode", "get_mode");
        ADD_PROPERTY(PropertyInfo(Variant::OBJECT, "tile_set", PROPERTY_HINT_RESOURCE_TYPE, "TileSet"), "set_tileset", "get_tileset");

        ADD_GROUP("Cell", "cell_");
        ADD_PROPERTY(PropertyInfo(Variant::VECTOR2, "cell_size", PROPERTY_HINT_RANGE, "1,8192,1"), "set_cell_size", "get_cell_size");
        ADD_PROPERTY(PropertyInfo(Variant::INT, "cell_quadrant_size", PROPERTY_HINT_RANGE, "1,128,1"), "set_quadrant_size", "get_quadrant_size");
        ...

        ADD_GROUP("Collision", "collision_");
        ADD_PROPERTY(PropertyInfo(Variant::BOOL, "collision_use_parent", PROPERTY_HINT_NONE, ""), "set_collision_use_parent", "get_collision_use_parent");
        ADD_PROPERTY(PropertyInfo(Variant::BOOL, "collision_use_kinematic", PROPERTY_HINT_NONE, ""), "set_collision_use_kinematic", "get_collision_use_kinematic");
        ...

        ADD_GROUP("Occluder", "occluder_");
        ADD_PROPERTY(PropertyInfo(Variant::INT, "occluder_light_mask", PROPERTY_HINT_LAYERS_2D_RENDER), "set_occluder_light_mask", "get_occluder_light_mask");

        ADD_PROPERTY_DEFAULT("format", FORMAT_1);

        ...

        BIND_CONSTANT(INVALID_CELL);

        BIND_ENUM_CONSTANT(MODE_SQUARE);
        BIND_ENUM_CONSTANT(MODE_ISOMETRIC);
        BIND_ENUM_CONSTANT(MODE_CUSTOM);
        ...
    }
..

The property "TileSet" etc. are added with "PROPERTY_HINT_RESOURCE_TYPE".

The property hint and method info are defined in object.h. see next.
