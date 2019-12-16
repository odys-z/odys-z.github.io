Godot Resource Loader
=====================

Godot text resource loading are handled by ResourceFormatLoaderText, one of
ResourceFormatLoader subclasses.

In core.io.resource_loader.cpp:

.. code-block:: cpp

    void ResourceFormatLoader::_bind_methods() {

        {
            MethodInfo info = MethodInfo(Variant::NIL, "load", PropertyInfo(Variant::STRING, "path"), PropertyInfo(Variant::STRING, "original_path"));
            info.return_val.usage |= PROPERTY_USAGE_NIL_IS_VARIANT;
            ClassDB::add_virtual_method(get_class_static(), info);
        }

        ClassDB::add_virtual_method(get_class_static(), MethodInfo(Variant::POOL_STRING_ARRAY, "get_recognized_extensions"));
        ClassDB::add_virtual_method(get_class_static(), MethodInfo(Variant::BOOL, "handles_type", PropertyInfo(Variant::STRING, "typename")));
        ClassDB::add_virtual_method(get_class_static(), MethodInfo(Variant::STRING, "get_resource_type", PropertyInfo(Variant::STRING, "path")));
        ClassDB::add_virtual_method(get_class_static(), MethodInfo("get_dependencies", PropertyInfo(Variant::STRING, "path"), PropertyInfo(Variant::STRING, "add_types")));
        ClassDB::add_virtual_method(get_class_static(), MethodInfo(Variant::INT, "rename_dependencies", PropertyInfo(Variant::STRING, "path"), PropertyInfo(Variant::STRING, "renames")));
    }

    RES ResourceLoader::_load(const String &p_path, const String &p_original_path, const String &p_type_hint, bool p_no_cache, Error *r_error) {

        bool found = false;

        // Try all loaders and pick the first match for the type hint
        for (int i = 0; i < loader_count; i++) {

            if (!loader[i]->recognize_path(p_path, p_type_hint)) {
                continue;
            }
            found = true;
            RES res = loader[i]->load(p_path, p_original_path != String() ? p_original_path : p_path, r_error);
            if (res.is_null()) {
                continue;
            }

            return res;
        }

        ERR_FAIL_COND_V_MSG(found, RES(), "Failed loading resource: " + p_path + ".");

        ERR_FAIL_V_MSG(RES(), "No loader found for resource: " + p_path + ".");
    }

..

In core.class_db.cpp:

.. code-block:: cpp

    void ClassDB::add_virtual_method(const StringName &p_class, const MethodInfo &p_method, bool p_virtual) {
        ERR_FAIL_COND(!classes.has(p_class));

        OBJTYPE_WLOCK;

    #ifdef DEBUG_METHODS_ENABLED
        MethodInfo mi = p_method;
        if (p_virtual)
            mi.flags |= METHOD_FLAG_VIRTUAL;
        classes[p_class].virtual_methods.push_back(mi);

    #endif
    }

..

That means all resource loader are dynamically bound.
