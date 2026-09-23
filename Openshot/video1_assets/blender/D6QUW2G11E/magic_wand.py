# Shared helpers for Blender animated title scripts.
# Keep these utilities lightweight and side-effect free.

import bpy


def ensure_rgba(color):
    """Return color with an alpha component."""
    if len(color) >= 4:
        return color
    return [color[0], color[1], color[2], 1.0]


def get_action_fcurves(action):
    """Return a collection of FCurves for this action across Blender versions."""
    if hasattr(action, "fcurves"):
        return action.fcurves

    for layer in getattr(action, "layers", []):
        for strip in getattr(layer, "strips", []):
            for bag in getattr(strip, "channelbags", []):
                curves = getattr(bag, "fcurves", None)
                if curves is not None:
                    return curves

    raise AttributeError("No fcurves found on action (unsupported Blender version?)")


def update_color_fcurves(action_name, keyframes):
    """Update RGB fcurves by keyframe index using (frame, color) pairs."""
    action = bpy.data.actions.get(action_name)
    if not action:
        return None

    fcurves = get_action_fcurves(action)
    by_index = {fc.array_index: fc for fc in fcurves}

    for point, (frame, color) in enumerate(keyframes):
        for i in range(0, 3):
            fc = by_index.get(i)
            if not fc or point >= len(fc.keyframe_points):
                continue
            coord = (frame, color[i])
            keyframe_point = fc.keyframe_points[point]
            keyframe_point.co = coord
            keyframe_point.handle_left.y = coord[1]
            keyframe_point.handle_right.y = coord[1]

    return action


def keyframe_color_socket(socket, keyframes):
    """Keyframe a 4-float color socket at provided frame/value pairs."""
    for frame, color in keyframes:
        rgba = ensure_rgba(color)
        socket.default_value = rgba
        for idx in range(4):
            socket.keyframe_insert("default_value", index=idx, frame=frame)


def keyframe_value_socket(socket, value, frames):
    """Keyframe a single-float socket at provided frames."""
    socket.default_value = value
    for frame in frames:
        socket.keyframe_insert("default_value", frame=frame)


def _get_principled_node(mat):
    nt = mat.node_tree
    return nt.nodes.get("Principled BSDF") if nt else None


def keyframe_principled(
        material_name,
        base_keyframes=None,
        emission_keyframes=None,
        emission_strength=None,
        viewport_color=None,
        specular_value=None,
        specular_color=None):
    """Keyframe principled BSDF base/emission colors and optional strength."""
    mat = bpy.data.materials.get(material_name)
    if not mat:
        return None

    if viewport_color is not None:
        mat.diffuse_color = ensure_rgba(viewport_color)

    if specular_color is not None:
        # Viewport/specular color property uses RGB only
        mat.specular_color = ensure_rgba(specular_color)[:3]

    bsdf = _get_principled_node(mat)
    if not bsdf:
        return mat

    base_sock = bsdf.inputs.get("Base Color")
    emission_sock = bsdf.inputs[27] if len(bsdf.inputs) > 27 else None
    emission_strength_sock = bsdf.inputs[28] if len(bsdf.inputs) > 28 else None
    # IOR socket (Principled input index 3)
    ior_sock = bsdf.inputs[3] if len(bsdf.inputs) > 3 else None
    # Specular tint/color socket (RGBA)
    specular_tint_sock = None
    for sock in bsdf.inputs:
        if "Specular Tint" in sock.name and sock.type == 'RGBA':
            specular_tint_sock = sock
            break
    if specular_tint_sock is None and len(bsdf.inputs) > 14 and bsdf.inputs[14].type == 'RGBA':
        specular_tint_sock = bsdf.inputs[14]

    if base_sock and base_keyframes:
        keyframe_color_socket(base_sock, base_keyframes)

    if emission_sock and emission_keyframes:
        keyframe_color_socket(emission_sock, emission_keyframes)

    if emission_strength_sock and emission_strength:
        value, frames = emission_strength
        keyframe_value_socket(emission_strength_sock, value, frames)

    if ior_sock is not None and specular_value is not None:
        ior_sock.default_value = specular_value

    if specular_tint_sock is not None and specular_color is not None:
        specular_tint_sock.default_value = ensure_rgba(specular_color)

    return mat


# OpenShot Video Editor is a program that creates, modifies, and edits video files.
#   Copyright (C) 2009  Jonathan Thomas
#
# This file is part of OpenShot Video Editor (http://launchpad.net/openshot/).
#
# OpenShot Video Editor is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# OpenShot Video Editor is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with OpenShot Video Editor.  If not, see <http://www.gnu.org/licenses/>.


# Import Blender's python API.  This only works when the script is being
# run from the context of Blender.  Blender contains it's own version of Python
# with this library pre-installed.
import bpy
import json

# Debug Info:
# ./blender -b test.blend -P demo.py
# -b = background mode
# -P = run a Python script within the context of the project file

# Init all of the variables needed by this script.  Because Blender executes
# this script, OpenShot will inject a dictionary of the required parameters
# before this script is executed.
params = {
    'output_path': '/tmp/',
    'file_format': 'PNG',
    'fps': 24,
    'quality': 90,
    'resolution_x': 1920,
    'resolution_y': 1080,
    'resolution_percentage': 100,
    'start_frame': 1,
    'end_frame': 250,
    'length_multiplier': 1,

    'color_mode': 'RGBA',
    'alpha_mode': 1.0,
    'horizon_color': (0.57, 0.57, 0.57),
    'diffuse_color': (1.0, 0.9, 0.0, 1.0),

    'particles_count': 5000,
    'particles_lifetime': 50,
    'particles_gravity': 1.0,
    'particle_scale': 0.03,
    'strength': 1,
    'glare_type': 'STREAKS',

    'velocity_x': 1.0,
    'velocity_y': 0.0,
    'velocity_z': 0.0,
    'start_x': 0,
    'start_y': 0,
    'start_z': 3,
    'end_x': 20,
    'end_y': 0,
    'end_z': 3,
}


#BEGIN INJECTING PARAMS
params_json = r"""{"file_name": "TitleFileName", "title": "Title", "sub_title": "Sub Title", "extrude": 0.1, "bevel_depth": 0.02, "fontname": "Bfont", "spacemode": "CENTER", "text_size": 1.0, "width": 1.0, "diffuse_color": [1.0, 0.8117647058823529, 0.0, 1.0], "specular_color": [1.0, 1.0, 1.0], "specular_intensity": 1.0, "start_frame": 1, "end_frame": 250, "length_multiplier": 1.0, "particles_count": 5000.0, "start_x": 0.0, "start_y": 0.0, "start_z": 3.0, "end_x": 0.0, "end_y": 0.0, "end_z": 3.0, "strength": 1.0, "glare_type": "STREAKS", "particle_scale": 0.03, "particles_lifetime": 50.0, "particles_gravity": 1.0, "velocity_x": 0.0, "velocity_y": 0.0, "velocity_z": 0.0, "fps": 30, "resolution_x": 1280, "resolution_y": 720, "resolution_percentage": 50, "quality": 100, "file_format": "PNG", "color_mode": "RGBA", "alpha_mode": 1, "horizon_color": [0.57, 0.57, 0.57], "animation": true, "output_path": "/home/emi/external/Projects/ElAlbumB/Openshot/video1_assets/blender/D6QUW2G11E/TitleFileName"}"""
#END INJECTING PARAMS


# The remainder of this script will modify the current Blender .blend project
# file, and adjust the settings.  The .blend file is specified in the XML file
# that defines this template in OpenShot.
# ----------------------------------------------------------------------------

# Process parameters supplied as JSON serialization
try:
    injected_params = json.loads(params_json)
    params.update(injected_params)
except NameError:
    pass


def update_curve(curve, start, end):
    if not curve or len(curve.keyframe_points) < 2:
        return
    coords = [
        (1.0, start),
        (250.0, end),
        ]
    for i, coord in enumerate(coords):
        p = curve.keyframe_points[i]
        p.co = coord
        p.handle_left.y = coord[1]
        p.handle_right.y = coord[1]


# Modify the Location of the Wand
wand_object = bpy.data.objects["Wand"]
wand_object.location = (params["start_x"], params["start_y"], params["start_z"])

# Modify the Start and End keyframes
action = bpy.data.actions.get("CubeAction")
if action:
    try:
        fcurves = list(get_action_fcurves(action))
    except Exception:
        fcurves = list(getattr(action, "fcurves", []))

    by_index = {fc.array_index: fc for fc in fcurves}
    fc_x = by_index.get(0) if by_index else (fcurves[0] if len(fcurves) > 0 else None)
    fc_y = by_index.get(1) if by_index else (fcurves[1] if len(fcurves) > 1 else None)
    fc_z = by_index.get(2) if by_index else (fcurves[2] if len(fcurves) > 2 else None)

    update_curve(fc_x, params["start_x"], params["end_x"])
    update_curve(fc_y, params["start_y"], params["end_y"])
    update_curve(fc_z, params["start_z"], params["end_z"])

# Change the material settings (color, alpha, etc...)
material_object = bpy.data.materials["Material"]
mat_emission = material_object.node_tree.nodes["Emission"]
mat_emission.inputs[0].default_value = params["diffuse_color"]
mat_emission.inputs[1].default_value = params["strength"]
material_object.diffuse_color = params["diffuse_color"]

# Change size of particle
sval = params["particle_scale"]
bpy.data.objects["Sphere"].scale = (sval, sval, sval)

# Change glare settings (handle missing scene.node_tree like Blender 5)
def _apply_glare(node_tree):
    """Assign glare_type or equivalent input on any GLARE compositor node (recursing into groups)."""
    if not node_tree:
        return False
    updated = False
    glare_input_map = {
        "STREAKS": "Streaks",
        "GHOSTS": "Ghosts",
        "SIMPLE_STAR": "Simple Star",
        "SUN_BEAMS": "Sun Beams",
    }
    glare_input_value = glare_input_map.get(params["glare_type"], "Ghosts")
    glare_color = params.get("diffuse_color")
    glare_strength = params.get("strength")
    for node in node_tree.nodes:
        if node.type == 'GLARE':
            if hasattr(node, "glare_type"):
                node.glare_type = params["glare_type"]
                updated = True
            elif hasattr(node, "inputs") and len(node.inputs) > 1:
                try:
                    node.inputs[1].default_value = glare_input_value
                    updated = True
                except Exception:
                    pass
            # Optional tint/strength if sockets exist
            if hasattr(node, "inputs"):
                if glare_color is not None and len(node.inputs) > 9:
                    try:
                        node.inputs[9].default_value = glare_color
                    except Exception:
                        pass
                if glare_strength is not None and len(node.inputs) > 2:
                    try:
                        node.inputs[2].default_value = glare_strength
                    except Exception:
                        pass
        elif node.type == 'GROUP' and getattr(node, "node_tree", None):
            updated = _apply_glare(node.node_tree) or updated
    return updated

scene_tree = getattr(bpy.context.scene, "node_tree", None)
if not _apply_glare(scene_tree):
    comp_group = bpy.data.node_groups.get("Compositing Nodetree")
    if comp_group:
        _apply_glare(comp_group)

# Change particle settings
psettings = bpy.data.particles["ParticleSettings"]
psettings.count = int(params["particles_count"])
psettings.lifetime = params["particles_lifetime"]
psettings.effector_weights.gravity = params["particles_gravity"]
psettings.object_align_factor = (
    params["velocity_x"], params["velocity_y"], params["velocity_z"])

# Set the render options.  It is important that these are set
# to the same values as the current OpenShot project.  These
# params are automatically set by OpenShot
render = bpy.context.scene.render
render.filepath = params["output_path"]
render.fps = params["fps"]
if "fps_base" in params:
    render.fps_base = params["fps_base"]
render.image_settings.file_format = params["file_format"]
render.image_settings.color_mode = params["color_mode"]
render.film_transparent = params["alpha_mode"]
render.resolution_x = params["resolution_x"]
render.resolution_y = params["resolution_y"]
render.resolution_percentage = params["resolution_percentage"]

bpy.data.worlds["World"].color = params["horizon_color"]

# Clear particle cache before remapping
bpy.ops.ptcache.free_bake_all()

# Animation Speed (use Blender's time remapping to slow or speed up animation)
length_multiplier = round(params["length_multiplier"])  # time remapping multiplier
new_length = params["end_frame"] * length_multiplier  # new length (in frames)
render.frame_map_old = 1
render.frame_map_new = length_multiplier

# Set render length/position
bpy.context.scene.frame_start = params["start_frame"]
bpy.context.scene.frame_end = new_length

if "preview_frame" not in params:
    bpy.ops.ptcache.bake_all()
