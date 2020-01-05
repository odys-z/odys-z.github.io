Godot Object
============

In core/object.h declared PropertyHint, PropertyUsageFlags, PropertyInfo,
MethodInfo and class Object:

.. code-block:: cpp

    enum PropertyHint {
        PROPERTY_HINT_NONE, ///< no hint provided.
        PROPERTY_HINT_RANGE, ///< hint_text = "min,max,step,slider; //slider is optional"
        PROPERTY_HINT_EXP_RANGE, ///< hint_text = "min,max,step", exponential edit
        PROPERTY_HINT_ENUM, ///< hint_text= "val1,val2,val3,etc"
        PROPERTY_HINT_EXP_EASING, /// exponential easing function (Math::ease) use "attenuation" hint string to revert (flip h), "full" to also include in/out. (ie: "attenuation,inout")
        PROPERTY_HINT_LENGTH, ///< hint_text= "length" (as integer)
        PROPERTY_HINT_SPRITE_FRAME, // FIXME: Obsolete: drop whenever we can break compat. Keeping now for GDNative compat.
        PROPERTY_HINT_KEY_ACCEL, ///< hint_text= "length" (as integer)
        PROPERTY_HINT_FLAGS, ///< hint_text= "flag1,flag2,etc" (as bit flags)
        PROPERTY_HINT_LAYERS_2D_RENDER,
        PROPERTY_HINT_LAYERS_2D_PHYSICS,
		...
    };

    enum PropertyUsageFlags {

        PROPERTY_USAGE_STORAGE = 1,
        PROPERTY_USAGE_EDITOR = 2,
        PROPERTY_USAGE_NETWORK = 4,
        PROPERTY_USAGE_EDITOR_HELPER = 8,
        PROPERTY_USAGE_CHECKABLE = 16, //used for editing global variables
        PROPERTY_USAGE_CHECKED = 32, //used for editing global variables
        PROPERTY_USAGE_INTERNATIONALIZED = 64, //hint for internationalized strings
        PROPERTY_USAGE_GROUP = 128, //used for grouping props in the editor
        PROPERTY_USAGE_CATEGORY = 256,
		...
    };

    #define ADD_SIGNAL(m_signal) ClassDB::add_signal(get_class_static(), m_signal)
    #define ADD_PROPERTY(m_property, m_setter, m_getter) ClassDB::add_property(get_class_static(), m_property, _scs_create(m_setter), _scs_create(m_getter))
    #define ADD_PROPERTYI(m_property, m_setter, m_getter, m_index) ClassDB::add_property(get_class_static(), m_property, _scs_create(m_setter), _scs_create(m_getter), m_index)
    #define ADD_PROPERTY_DEFAULT(m_property, m_default) ClassDB::set_property_default_value(get_class_static(), m_property, m_default)
    #define ADD_GROUP(m_name, m_prefix) ClassDB::add_property_group(get_class_static(), m_name, m_prefix)

    struct PropertyInfo {

        Variant::Type type;
        String name;
        StringName class_name; //for classes
        PropertyHint hint;
        String hint_string;
        uint32_t usage;

        PropertyInfo(Variant::Type p_type, const String p_name,
			PropertyHint p_hint = PROPERTY_HINT_NONE, const String &p_hint_string = "",
			uint32_t p_usage = PROPERTY_USAGE_DEFAULT, const StringName &p_class_name = StringName()) :
            ...
        }

        PropertyInfo(const StringName &p_class_name) :
                type(Variant::OBJECT),
                class_name(p_class_name),
                hint(PROPERTY_HINT_NONE),
                usage(PROPERTY_USAGE_DEFAULT) {
        }

        ...
    };

    Array convert_property_list(const List<PropertyInfo> *p_list);

    struct MethodInfo {

        String name;
        PropertyInfo return_val;
        uint32_t flags;
        int id;
        List<PropertyInfo> arguments;
        Vector<Variant> default_arguments;

        inline bool operator==(const MethodInfo &p_method) const { return id == p_method.id; }
        inline bool operator<(const MethodInfo &p_method) const { return id == p_method.id ? (name < p_method.name) : (id < p_method.id); }

        operator Dictionary() const;

        static MethodInfo from_dict(const Dictionary &p_dict);
        MethodInfo();
        MethodInfo(const String &p_name);
        MethodInfo(const String &p_name, const PropertyInfo &p_param1);
        ...
    };

..

This helps to find will resource are handled.

With this information, can safely figure out parser grammar ?
