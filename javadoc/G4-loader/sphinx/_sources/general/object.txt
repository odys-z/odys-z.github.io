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
        PROPERTY_HINT_LAYERS_3D_RENDER,
        PROPERTY_HINT_LAYERS_3D_PHYSICS,
        PROPERTY_HINT_FILE, ///< a file path must be passed, hint_text (optionally) is a filter "*.png,*.wav,*.doc,"
        PROPERTY_HINT_DIR, ///< a directory path must be passed
        PROPERTY_HINT_GLOBAL_FILE, ///< a file path must be passed, hint_text (optionally) is a filter "*.png,*.wav,*.doc,"
        PROPERTY_HINT_GLOBAL_DIR, ///< a directory path must be passed
        PROPERTY_HINT_RESOURCE_TYPE, ///< a resource object type
        PROPERTY_HINT_MULTILINE_TEXT, ///< used for string properties that can contain multiple lines
        PROPERTY_HINT_PLACEHOLDER_TEXT, ///< used to set a placeholder text for string properties
        PROPERTY_HINT_COLOR_NO_ALPHA, ///< used for ignoring alpha component when editing a color
        PROPERTY_HINT_IMAGE_COMPRESS_LOSSY,
        PROPERTY_HINT_IMAGE_COMPRESS_LOSSLESS,
        PROPERTY_HINT_OBJECT_ID,
        PROPERTY_HINT_TYPE_STRING, ///< a type string, the hint is the base type to choose
        PROPERTY_HINT_NODE_PATH_TO_EDITED_NODE, ///< so something else can provide this (used in scripts)
        PROPERTY_HINT_METHOD_OF_VARIANT_TYPE, ///< a method of a type
        PROPERTY_HINT_METHOD_OF_BASE_TYPE, ///< a method of a base type
        PROPERTY_HINT_METHOD_OF_INSTANCE, ///< a method of an instance
        PROPERTY_HINT_METHOD_OF_SCRIPT, ///< a method of a script & base
        PROPERTY_HINT_PROPERTY_OF_VARIANT_TYPE, ///< a property of a type
        PROPERTY_HINT_PROPERTY_OF_BASE_TYPE, ///< a property of a base type
        PROPERTY_HINT_PROPERTY_OF_INSTANCE, ///< a property of an instance
        PROPERTY_HINT_PROPERTY_OF_SCRIPT, ///< a property of a script & base
        PROPERTY_HINT_OBJECT_TOO_BIG, ///< object is too big to send
        PROPERTY_HINT_NODE_PATH_VALID_TYPES,
        PROPERTY_HINT_SAVE_FILE, ///< a file path must be passed, hint_text (optionally) is a filter "*.png,*.wav,*.doc,". This opens a save dialog
        PROPERTY_HINT_MAX,
        // When updating PropertyHint, also sync the hardcoded list in VisualScriptEditorVariableEdit
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
        // FIXME: Drop in 4.0, possibly reorder other flags?
        // Those below are deprecated thanks to ClassDB's now class value cache
        //PROPERTY_USAGE_STORE_IF_NONZERO = 512, //only store if nonzero
        //PROPERTY_USAGE_STORE_IF_NONONE = 1024, //only store if false
        PROPERTY_USAGE_NO_INSTANCE_STATE = 2048,
        PROPERTY_USAGE_RESTART_IF_CHANGED = 4096,
        PROPERTY_USAGE_SCRIPT_VARIABLE = 8192,
        PROPERTY_USAGE_STORE_IF_NULL = 16384,
        PROPERTY_USAGE_ANIMATE_AS_TRIGGER = 32768,
        PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED = 65536,
        PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE = 1 << 17,
        PROPERTY_USAGE_CLASS_IS_ENUM = 1 << 18,
        PROPERTY_USAGE_NIL_IS_VARIANT = 1 << 19,
        PROPERTY_USAGE_INTERNAL = 1 << 20,
        PROPERTY_USAGE_DO_NOT_SHARE_ON_DUPLICATE = 1 << 21, // If the object is duplicated also this property will be duplicated
        PROPERTY_USAGE_HIGH_END_GFX = 1 << 22,
        PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT = 1 << 23,
        PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT = 1 << 24,
        PROPERTY_USAGE_KEYING_INCREMENTS = 1 << 25, // Used in inspector to increment property when keyed in animation player

        PROPERTY_USAGE_DEFAULT = PROPERTY_USAGE_STORAGE | PROPERTY_USAGE_EDITOR | PROPERTY_USAGE_NETWORK,
        PROPERTY_USAGE_DEFAULT_INTL = PROPERTY_USAGE_STORAGE | PROPERTY_USAGE_EDITOR | PROPERTY_USAGE_NETWORK | PROPERTY_USAGE_INTERNATIONALIZED,
        PROPERTY_USAGE_NOEDITOR = PROPERTY_USAGE_STORAGE | PROPERTY_USAGE_NETWORK,
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

        _FORCE_INLINE_ PropertyInfo added_usage(int p_fl) const {
            PropertyInfo pi = *this;
            pi.usage |= p_fl;
            return pi;
        }

        operator Dictionary() const;

        static PropertyInfo from_dict(const Dictionary &p_dict);

        PropertyInfo() :
                type(Variant::NIL),
                hint(PROPERTY_HINT_NONE),
                usage(PROPERTY_USAGE_DEFAULT) {
        }

        PropertyInfo(Variant::Type p_type, const String p_name, PropertyHint p_hint = PROPERTY_HINT_NONE, const String &p_hint_string = "", uint32_t p_usage = PROPERTY_USAGE_DEFAULT, const StringName &p_class_name = StringName()) :
                type(p_type),
                name(p_name),
                hint(p_hint),
                hint_string(p_hint_string),
                usage(p_usage) {

            if (hint == PROPERTY_HINT_RESOURCE_TYPE) {
                class_name = hint_string;
            } else {
                class_name = p_class_name;
            }
        }

        PropertyInfo(const StringName &p_class_name) :
                type(Variant::OBJECT),
                class_name(p_class_name),
                hint(PROPERTY_HINT_NONE),
                usage(PROPERTY_USAGE_DEFAULT) {
        }

        bool operator==(const PropertyInfo &p_info) const {
            return ((type == p_info.type) &&
                    (name == p_info.name) &&
                    (class_name == p_info.class_name) &&
                    (hint == p_info.hint) &&
                    (hint_string == p_info.hint_string) &&
                    (usage == p_info.usage));
        }

        bool operator<(const PropertyInfo &p_info) const {
            return name < p_info.name;
        }
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

This method can be a reference to find out tscn file's lexical token?
