Godot Node2D Loader
=====================

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
